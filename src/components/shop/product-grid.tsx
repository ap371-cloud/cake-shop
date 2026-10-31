"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { PRODUCTS, CATEGORIES } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/product-card";
import { Skeleton } from "@/components/ui/skeleton";

function parseParams(sp: Record<string, string | string[] | undefined>) {
  const get = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  return {
    category: get("category") || "all",
    q: get("q") || "",
    sort: get("sort") || "featured",
    page: Math.max(1, parseInt(get("page") || "1", 10)),
  };
}

export function ProductGrid({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const params = parseParams(searchParams);
  const [loading, setLoading] = useState(false);
  const [serverProducts, setServerProducts] = useState<typeof PRODUCTS | null>(null);
  const [serverTotal, setServerTotal] = useState<number | null>(null);

  const { add } = useCart();

  const filtered = useMemo(() => {
    if (serverProducts) return { list: serverProducts, total: serverTotal ?? serverProducts.length };
    let list = PRODUCTS.filter((p) => p.available);
    if (params.category && params.category !== "all") {
      list = list.filter((p) => p.category.toLowerCase() === params.category.toLowerCase());
    }
    if (params.q) {
      const q = params.q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.ingredients.some((i) => i.toLowerCase().includes(q))
      );
    }
    switch (params.sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
    }
    return { list, total: list.length };
  }, [params, serverProducts, serverTotal]);

  useEffect(() => {
    if (!serverProducts) return;
    setLoading(false);
  }, [serverProducts]);

  // Fetch from the API when a query or category filter is active.
  useEffect(() => {
    if (!params.q && params.category === "all") return;
    let mounted = true;
    setLoading(true);
    const qs = new URLSearchParams();
    if (params.category !== "all") qs.set("category", params.category);
    if (params.q) qs.set("q", params.q);
    if (params.sort !== "featured") qs.set("sort", params.sort);
    qs.set("page", String(params.page));
    qs.set("limit", "48");
    fetch(`/api/catalog?${qs}`)
      .then((r) => r.json())
      .then((d) => {
        if (!mounted) return;
        setServerProducts(d.products ?? []);
        setServerTotal(d.total ?? 0);
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [params.q, params.category, params.sort, params.page]);

  const list = filtered.list;
  const total = filtered.total;
  const limit = 48;
  const pages = Math.max(1, Math.ceil(total / limit));
  const shown = list.slice((params.page - 1) * limit, params.page * limit);

  if (loading && !shown.length) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="aspect-square rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!shown.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="font-display text-2xl font-semibold text-primary">No bakes found</p>
        <p className="mt-2 text-body-md text-on-surface-variant">
          Try a different category or search term.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shown.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={add} />
        ))}
      </div>

      {pages > 1 && (
        <Pagination page={params.page} pages={pages} />
      )}
    </div>
  );
}

function Pagination({ page, pages }: { page: number; pages: number }) {
  const range = () => {
    const out: number[] = [];
    const start = Math.max(1, page - 1);
    const end = Math.min(pages, page + 1);
    for (let i = start; i <= end; i++) out.push(i);
    return out;
  };
  return (
    <div className="flex items-center justify-center gap-2">
      {page > 1 && (
        <PageButton delta={-1} label="Previous" page={page} />
      )}
      {range().map((p) => (
        <Link
          key={p}
          href={`?page=${p}`}
          className={cn(
            "flex h-10 min-w-10 items-center justify-center rounded-full text-label-md transition-colors",
            p === page
              ? "bg-primary-container text-on-primary"
              : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
          )}
        >
          {p}
        </Link>
      ))}
      {page < pages && (
        <PageButton delta={1} label="Next" page={page} />
      )}
    </div>
  );
}

function PageButton({ delta, label, page }: { delta: number; label: string; page: number }) {
  const href = `?page=${page + delta}`;
  return (
    <Link
      href={href}
      className="flex h-10 items-center gap-1 rounded-full px-4 text-label-md text-primary transition-colors hover:bg-surface-container-low"
    >
      {label}
    </Link>
  );
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}