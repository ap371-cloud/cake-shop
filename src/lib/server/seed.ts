import type { PGlite } from "@electric-sql/pglite";
import { CATEGORIES, PRODUCTS, STORE_SETTINGS } from "@/lib/data";
import { hashPassword } from "./password";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function seedDatabase(db: PGlite) {
  const categoryIds = new Map<string, string>();

  for (const [index, category] of CATEGORIES.entries()) {
    const { rows } = await db.query<{ id: string }>(
      `insert into public.categories (slug, name, description, image_url, sort_order)
       values ($1, $2, $3, $4, $5)
       on conflict (slug) do update set
         name = excluded.name,
         description = excluded.description,
         image_url = excluded.image_url,
         sort_order = excluded.sort_order
       returning id`,
      [slugify(category.name), category.name, category.description, category.image, index]
    );
    categoryIds.set(category.name, rows[0].id);
  }

  for (const product of PRODUCTS) {
    const { rows } = await db.query<{ id: string }>(
      `insert into public.products
         (slug, name, description, category_id, base_price, weight, ingredients,
          allergens, dietary, storage, is_available, is_featured, is_bestseller)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       on conflict (slug) do update set
         name = excluded.name,
         description = excluded.description,
         category_id = excluded.category_id,
         base_price = excluded.base_price,
         weight = excluded.weight,
         ingredients = excluded.ingredients,
         allergens = excluded.allergens,
         dietary = excluded.dietary,
         storage = excluded.storage,
         is_available = excluded.is_available,
         is_featured = excluded.is_featured,
         is_bestseller = excluded.is_bestseller
       returning id`,
      [
        product.slug,
        product.name,
        product.description,
        categoryIds.get(product.category) ?? null,
        product.price,
        product.weight ?? null,
        product.ingredients,
        product.allergens,
        product.dietary,
        product.storage,
        product.available,
        product.featured,
        product.bestseller,
      ]
    );

    const productId = rows[0].id;

    // Checkout always references a variant, so single-size products get one.
    const variants =
      product.variants && product.variants.length > 0
        ? product.variants.map((variant, index) => ({
            label: variant.label,
            price: variant.price,
            stock: variant.stock,
            sortOrder: index,
          }))
        : [
            {
              label: product.weight ?? "Standard",
              price: product.price,
              stock: product.stock,
              sortOrder: 0,
            },
          ];

    for (const variant of variants) {
      await db.query(
        `insert into public.product_variants (product_id, label, price, stock, sort_order)
         values ($1, $2, $3, $4, $5)
         on conflict (product_id, label) do update set
           price = excluded.price,
           stock = excluded.stock,
           sort_order = excluded.sort_order`,
        [productId, variant.label, variant.price, variant.stock, variant.sortOrder]
      );
    }

    await db.query("delete from public.product_images where product_id = $1", [productId]);

    for (const [index, url] of product.images.entries()) {
      await db.query(
        "insert into public.product_images (product_id, url, alt, sort_order) values ($1, $2, $3, $4)",
        [productId, url, product.name, index]
      );
    }
  }

  await db.query(
    `update public.store_settings set
       delivery_fee = $1,
       free_delivery_threshold = $2,
       phone = $3,
       email = $4,
       address = $5,
       opening_hours = $6,
       bake_drop_times = $7
     where id`,
    [
      STORE_SETTINGS.deliveryFee,
      STORE_SETTINGS.freeDeliveryThreshold,
      STORE_SETTINGS.phone,
      STORE_SETTINGS.email,
      STORE_SETTINGS.address,
      STORE_SETTINGS.openingHours,
      STORE_SETTINGS.bakeDropTimes,
    ]
  );

  await seedDemoAdmin(db);
}

// The deployed demo runs on an in-memory database, so there is no shell to run
// `npm run db:admin` against. Env vars give it an owner account on every boot.
async function seedDemoAdmin(db: PGlite) {
  const email = process.env.DEMO_ADMIN_EMAIL;
  const password = process.env.DEMO_ADMIN_PASSWORD;
  if (!email || !password) return;

  const { rows } = await db.query<{ id: string }>(
    `insert into auth.users (email, encrypted_password, email_confirmed_at, raw_user_meta_data)
     values ($1, $2, now(), $3::jsonb)
     on conflict (email) do update set encrypted_password = excluded.encrypted_password
     returning id`,
    [email, await hashPassword(password), JSON.stringify({ full_name: "Atelier Owner" })]
  );

  await db.query(
    `insert into public.profiles (id, full_name, role)
     values ($1, $2, 'admin')
     on conflict (id) do update set role = 'admin'`,
    [rows[0].id, "Atelier Owner"]
  );
}
