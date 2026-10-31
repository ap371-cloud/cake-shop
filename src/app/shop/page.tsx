import type { Metadata } from "next";
import { PRODUCTS, CATEGORIES } from "@/lib/data";
import { ProductGrid } from "@/components/shop/product-grid";
import { FilterSidebar } from "@/components/shop/filter-sidebar";
import { SortSelect } from "@/components/shop/sort-select";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse Crumble & Co.'s cakes, pastries, cookies, breads and desserts. Filter by category, sort by price and add to your pastry bag.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
            Our Bakes
          </h1>
          <p className="mt-2 text-body-lg text-on-surface-variant">
            Freshly baked daily in small batches. Filter, sort and add to your pastry bag.
          </p>
        </div>
        <SortSelect />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <FilterSidebar categories={CATEGORIES} />
        <ProductGrid searchParams={sp} />
      </div>
    </div>
  );
}