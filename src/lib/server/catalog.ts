import type { Product, ProductCategory, ProductVariant } from "@/types";
import { getDb } from "@/lib/server/db";

type CatalogRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  base_price: string;
  weight: string | null;
  ingredients: string[];
  allergens: string[];
  dietary: string[];
  storage: string | null;
  is_available: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  category: string | null;
  images: { url: string; alt: string }[];
  variants: { id: string; label: string; price: string; stock: number }[];
};

const CATALOG_QUERY = `
  select
    p.id, p.slug, p.name, p.description, p.base_price, p.weight,
    p.ingredients, p.allergens, p.dietary, p.storage,
    p.is_available, p.is_featured, p.is_bestseller,
    c.name as category,
    coalesce((
      select json_agg(json_build_object('url', i.url, 'alt', i.alt) order by i.sort_order)
      from public.product_images i where i.product_id = p.id
    ), '[]') as images,
    coalesce((
      select json_agg(json_build_object('id', v.id, 'label', v.label, 'price', v.price, 'stock', v.stock) order by v.sort_order)
      from public.product_variants v where v.product_id = p.id
    ), '[]') as variants
  from public.products p
  left join public.categories c on c.id = p.category_id
  where p.is_available
  order by p.is_featured desc, p.name
`;

function toProduct(row: CatalogRow): Product {
  const variants: ProductVariant[] = row.variants.map((variant) => ({
    id: variant.id,
    label: variant.label,
    price: Number(variant.price),
    stock: variant.stock,
  }));

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: Number(row.base_price),
    category: (row.category ?? "Cakes") as ProductCategory,
    images: row.images.map((image) => image.url),
    dietary: row.dietary as Product["dietary"],
    allergens: row.allergens,
    ingredients: row.ingredients,
    storage: row.storage ?? "",
    available: row.is_available,
    stock: variants.reduce((sum, variant) => sum + variant.stock, 0),
    variants,
    featured: row.is_featured,
    bestseller: row.is_bestseller,
    weight: row.weight ?? undefined,
  };
}

export async function listCatalog(options: {
  category?: string | null;
  q?: string | null;
  sort?: string | null;
  page?: number;
  limit?: number;
}) {
  const db = await getDb();
  const { rows } = await db.query<CatalogRow>(CATALOG_QUERY);
  let products = rows.map(toProduct);

  const category = options.category?.toLowerCase();
  if (category && category !== "all") {
    products = products.filter((product) => product.category.toLowerCase() === category);
  }

  const q = options.q?.toLowerCase().trim();
  if (q) {
    products = products.filter(
      (product) =>
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.ingredients.some((ingredient) => ingredient.toLowerCase().includes(q))
    );
  }

  switch (options.sort) {
    case "price-asc":
      products.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      products.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      products.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      break;
  }

  const limit = Math.min(48, Math.max(1, options.limit ?? 24));
  const page = Math.max(1, options.page ?? 1);
  const start = (page - 1) * limit;

  return {
    products: products.slice(start, start + limit),
    total: products.length,
    page,
    pages: Math.max(1, Math.ceil(products.length / limit)),
  };
}

export async function getProductBySlug(slug: string) {
  const { products } = await listCatalog({ limit: 48 });
  return products.find((product) => product.slug === slug) ?? null;
}

export async function listCategories() {
  const db = await getDb();
  const { rows } = await db.query<{ name: string; slug: string; description: string; image_url: string }>(
    "select name, slug, description, image_url from public.categories order by sort_order"
  );
  return rows.map((row) => ({
    name: row.name,
    slug: row.slug,
    description: row.description,
    image: row.image_url,
  }));
}
