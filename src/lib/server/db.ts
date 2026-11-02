import { existsSync, mkdirSync, readFileSync, renameSync, rmSync } from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { seedDatabase } from "./seed";

declare global {
  // eslint-disable-next-line no-var
  var __crumbleDb: Promise<PGlite> | undefined;
}

const dataDir = path.join(process.cwd(), ".data", "pg");
const shimsFile = path.join("supabase", "local", "00-shims.sql");
const migrationFile = path.join("supabase", "migrations", "20261031000001_init.sql");

// Vercel's filesystem is read-only, so the deployed demo keeps Postgres in
// memory: seeded on cold start, gone when the function instance recycles.
const isServerless = Boolean(process.env.VERCEL);

// A dev server killed with Ctrl+C (or restarted when next.config.ts changes)
// leaves postmaster.pid behind and PGlite then refuses to start. Only remove
// the file when that pid is actually gone.
function clearStaleLock(dir: string) {
  const pidFile = path.join(dir, "postmaster.pid");
  if (!existsSync(pidFile)) return;

  const pid = Number.parseInt(readFileSync(pidFile, "utf8").split("\n")[0] ?? "", 10);
  if (Number.isFinite(pid) && pid > 0) {
    try {
      process.kill(pid, 0);
      return;
    } catch {
      // no such process — the lock is stale
    }
  }

  rmSync(pidFile, { force: true });
}

// One connection per process: PGlite is a single embedded Postgres, and dev
// hot-reload would otherwise open a new one on every edit.
export function getDb() {
  if (!globalThis.__crumbleDb) {
    globalThis.__crumbleDb = openDatabase().catch((error) => {
      // Do not cache a failed init — the next request should retry cleanly.
      globalThis.__crumbleDb = undefined;
      throw error;
    });
  }
  return globalThis.__crumbleDb;
}

async function openDatabase() {
  if (isServerless) return start();

  try {
    mkdirSync(dataDir, { recursive: true });
  } catch {
    // Read-only filesystem without VERCEL set — memory is the only option.
    return start();
  }

  clearStaleLock(dataDir);

  try {
    return await start(dataDir);
  } catch (error) {
    // A half-written database only happens in dev (an abrupt restart). Keep the
    // old directory for inspection instead of deleting anyone's data.
    if (process.env.NODE_ENV === "production") throw error;

    const parked = `${dataDir}-broken-${Date.now()}`;
    try {
      renameSync(dataDir, parked);
    } catch {
      // Files are still locked — another dev server is probably using them.
      throw error;
    }

    console.warn(`[db] could not open the local database, moved it to ${parked}`);
    mkdirSync(dataDir, { recursive: true });

    return start(dataDir);
  }
}

async function start(dir?: string) {
  const db = dir ? new PGlite(dir) : new PGlite();

  const { rows } = await db.query<{ ready: boolean }>(
    "select to_regclass('public.products') is not null as ready"
  );

  if (!rows[0].ready) {
    await db.exec(readFileSync(shimsFile, "utf8"));
    await db.exec(readFileSync(migrationFile, "utf8"));
    await seedDatabase(db);
  }

  return db;
}
