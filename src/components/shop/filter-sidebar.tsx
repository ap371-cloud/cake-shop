"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ProductCategory } from "@/types";

export function FilterSidebar({ categories }: { categories: { name: ProductCategory; description: string }[] }) {
  const pathname = usePathname();
  const current = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search.slice(1) : ""
  );
  const activeCategory = current.get("category") || "all";

  return (
    <aside className="hidden lg:block">
      <h2 className="mb-3 font-display text-lg font-semibold text-primary">Category</h2>
      <ul className="flex flex-col">
        <li>
          <Link
            href="/shop"
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-label-lg transition-colors ${
              activeCategory === "all"
                ? "bg-primary-container text-on-primary"
                : "text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            All Bakes
          </Link>
        </li>
        {categories.map((c) => (
          <li key={c.name}>
            <Link
              href={`/shop?category=${c.name}`}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-label-lg transition-colors ${
                activeCategory === c.name
                  ? "bg-primary-container text-on-primary"
                  : "text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              <span>{c.name}</span>
              <span className="text-label-sm text-outline-variant">{c.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}