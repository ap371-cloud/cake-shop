// Promotes an existing account to administrator, or lists the accounts when
// no email is given. The dev server must be stopped first: PGlite keeps the
// database locked while it is open.
// Usage: npm run db:admin -- someone@example.com
import { PGlite } from "@electric-sql/pglite";

const email = process.argv[2];

const db = new PGlite(".data/pg");

try {
  if (!email) {
    const { rows } = await db.query(
      `select u.email, p.full_name, p.role
         from auth.users u
         left join public.profiles p on p.id = u.id
        order by u.created_at`
    );

    if (rows.length === 0) {
      console.log("No accounts yet. Register through the site first.");
    } else {
      for (const row of rows) {
        console.log(`${row.role ?? "customer"}\t${row.email}\t${row.full_name ?? ""}`);
      }
    }
  } else {
    const { rows } = await db.query(
      `update public.profiles set role = 'admin'
        where id = (select id from auth.users where lower(email) = lower($1))
        returning id`,
      [email]
    );

    if (rows.length === 0) {
      console.log(`No account for ${email}. Register through the site first.`);
      process.exitCode = 1;
    } else {
      console.log(`${email} is now an administrator.`);
    }
  }
} finally {
  await db.close();
}
