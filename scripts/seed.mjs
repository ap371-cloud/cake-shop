// Seeds the catalogue from src/lib/data.ts so the Stitch content stays the single
// source of truth. Run: node scripts/seed.mjs
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { PRODUCTS, CATEGORIES, STORE_SETTINGS } from "../src/lib/data.ts";

function loadEnv() {
  const env = {};
  for (const file of [".env.local", ".env"]) {
    let raw;
    try {
      raw = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const line of raw.split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!match) continue;
      env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
  return { ...env, ...process.env };
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const slug = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

async function seedCategories() {
  const rows = CATEGORIES.map((category, index) => ({
    slug: slug(category.name),
    name: category.name,
    description: category.description,
    image_url: category.image,
    sort_order: index,
  }));

  const { data, error } = await supabase
    .from("categories")
    .upsert(rows, { onConflict: "slug" })
    .select("id, name");

  if (error) throw error;
  console.log(`categories: ${data.length}`);
  return new Map(data.map((row) => [row.name, row.id]));
}

async function seedProducts(categoryIds) {
  let productCount = 0;
  let variantCount = 0;

  for (const product of PRODUCTS) {
    const { data: saved, error } = await supabase
      .from("products")
      .upsert(
        {
          slug: product.slug,
          name: product.name,
          description: product.description,
          category_id: categoryIds.get(product.category) ?? null,
          base_price: product.price,
          weight: product.weight ?? null,
          ingredients: product.ingredients,
          allergens: product.allergens,
          dietary: product.dietary,
          storage: product.storage,
          is_available: product.available,
          is_featured: product.featured,
          is_bestseller: product.bestseller,
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (error) throw new Error(`${product.slug}: ${error.message}`);
    productCount += 1;

    // Checkout always references a variant, so single-size products get one too.
    const variants =
      product.variants && product.variants.length > 0
        ? product.variants.map((variant, index) => ({
            product_id: saved.id,
            label: variant.label,
            price: variant.price,
            stock: variant.stock,
            sort_order: index,
          }))
        : [
            {
              product_id: saved.id,
              label: product.weight ?? "Standard",
              price: product.price,
              stock: product.stock,
              sort_order: 0,
            },
          ];

    const { error: variantError } = await supabase
      .from("product_variants")
      .upsert(variants, { onConflict: "product_id,label" });
    if (variantError) throw new Error(`${product.slug} variants: ${variantError.message}`);
    variantCount += variants.length;

    await supabase.from("product_images").delete().eq("product_id", saved.id);
    const { error: imageError } = await supabase.from("product_images").insert(
      product.images.map((image, index) => ({
        product_id: saved.id,
        url: image,
        alt: product.name,
        sort_order: index,
      }))
    );
    if (imageError) throw new Error(`${product.slug} images: ${imageError.message}`);
  }

  console.log(`products: ${productCount}, variants: ${variantCount}`);
}

async function seedStoreSettings() {
  const { error } = await supabase
    .from("store_settings")
    .update({
      delivery_fee: STORE_SETTINGS.deliveryFee,
      free_delivery_threshold: STORE_SETTINGS.freeDeliveryThreshold,
      phone: STORE_SETTINGS.phone,
      email: STORE_SETTINGS.email,
      address: STORE_SETTINGS.address,
      opening_hours: STORE_SETTINGS.openingHours,
      bake_drop_times: STORE_SETTINGS.bakeDropTimes,
    })
    .eq("id", true);

  if (error) throw error;
  console.log("store settings: updated");
}

async function seedAdmin() {
  const email = env.SEED_ADMIN_EMAIL;
  const password = env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("admin: skipped (set SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD to create one)");
    return;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "Store Admin" },
  });

  if (error && !/already been registered/i.test(error.message)) throw error;

  let userId = data?.user?.id;
  if (!userId) {
    const { data: list } = await supabase.auth.admin.listUsers({ perPage: 200 });
    userId = list?.users.find((user) => user.email === email)?.id;
  }
  if (!userId) throw new Error("Admin user created but id could not be resolved");

  const { error: roleError } = await supabase.from("profiles").update({ role: "admin" }).eq("id", userId);
  if (roleError) throw roleError;
  console.log(`admin: ${email} is now an administrator`);
}

const categoryIds = await seedCategories();
await seedProducts(categoryIds);
await seedStoreSettings();
await seedAdmin();
console.log("done");
