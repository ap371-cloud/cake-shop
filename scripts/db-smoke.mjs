// Smoke test: does the real Supabase migration run unchanged on PGlite, and
// does create_order() price an order correctly? Run: node scripts/db-smoke.mjs
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";

const db = new PGlite();

await db.exec(readFileSync("supabase/local/00-shims.sql", "utf8"));
await db.exec(readFileSync("supabase/migrations/20261031000001_init.sql", "utf8"));
console.log("schema applied");

const category = await db.query(
  "insert into public.categories (slug, name) values ('cakes', 'Cakes') returning id"
);
const product = await db.query(
  `insert into public.products (slug, name, description, category_id, base_price)
   values ('truffle', 'Truffle Cake', 'test', $1, 599) returning id`,
  [category.rows[0].id]
);
const variant = await db.query(
  "insert into public.product_variants (product_id, label, price, stock) values ($1, '500g', 599, 5) returning id",
  [product.rows[0].id]
);

const order = await db.query(
  "select * from public.create_order($1::jsonb, $2::jsonb)",
  [
    JSON.stringify([{ variant_id: variant.rows[0].id, quantity: 2 }]),
    JSON.stringify({
      customer_name: "Test Buyer",
      phone: "9999999999",
      email: "test@example.com",
      address_line1: "1 Test Lane",
      city: "Mumbai",
      state: "MH",
      pincode: "400001",
      fulfilment: "delivery",
      delivery_date: "2026-11-05",
      delivery_slot: "10:00 - 13:00",
      payment_method: "cash_on_delivery",
    }),
  ]
);

const row = order.rows[0];
console.log("order:", row.order_number, "subtotal", row.subtotal, "fee", row.delivery_fee, "total", row.total);
console.log("status:", row.status);

const stock = await db.query("select stock from public.product_variants where id = $1", [variant.rows[0].id]);
console.log("stock left:", stock.rows[0].stock);

const items = await db.query("select product_name, quantity, line_total from public.order_items where order_id = $1", [row.id]);
console.log("items:", JSON.stringify(items.rows));

// Free delivery above the threshold should zero the fee.
const big = await db.query("select * from public.create_order($1::jsonb, $2::jsonb)", [
  JSON.stringify([{ variant_id: variant.rows[0].id, quantity: 3 }]),
  JSON.stringify({
    customer_name: "Test Buyer",
    phone: "9999999999",
    city: "Mumbai",
    state: "MH",
    pincode: "400001",
    fulfilment: "delivery",
    delivery_date: "2026-11-05",
    delivery_slot: "10:00 - 13:00",
  }),
]);
console.log("free delivery case:", big.rows[0].subtotal, "fee", big.rows[0].delivery_fee);

// Overselling must be rejected.
try {
  await db.query("select * from public.create_order($1::jsonb, $2::jsonb)", [
    JSON.stringify([{ variant_id: variant.rows[0].id, quantity: 10 }]),
    JSON.stringify({ customer_name: "x", phone: "1", delivery_date: "2026-11-05", delivery_slot: "10:00" }),
  ]);
  console.log("OVERSELL NOT BLOCKED — bad");
} catch (error) {
  console.log("oversell blocked:", error.message.split("\n")[0]);
}
