// Deletes the local database. The next request recreates and reseeds it.
// Usage: npm run db:reset
import { rmSync } from "node:fs";

rmSync(".data", { recursive: true, force: true });
console.log("local database removed — it will be rebuilt on the next request");
