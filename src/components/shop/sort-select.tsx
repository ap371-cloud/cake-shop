"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("sort") || "featured");

  useEffect(() => {
    setValue(params.get("sort") || "featured");
  }, [params]);

  function change(next: string) {
    setValue(next);
    const sp = new URLSearchParams(params.toString());
    if (next === "featured") sp.delete("sort");
    else sp.set("sort", next);
    sp.delete("page");
    router.push(`${pathname}?${sp.toString()}`);
  }

  return (
    <label className="flex items-center gap-2">
      <span className="hidden text-label-md text-on-surface-variant sm:block">Sort by</span>
      <select
        value={value}
        onChange={(e) => change(e.target.value)}
        className="h-11 rounded-full border border-outline-variant bg-surface-container-lowest px-4 text-body text-on-surface focus:outline-none focus:border-primary-container"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}