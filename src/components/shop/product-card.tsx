"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/store/cart";
import type { Product, ProductVariant } from "@/types";
import { Button } from "@/components/ui/button";

const dietaryColor: Record<string, string> = {
  Eggless: "bg-sage/15 text-sage",
  Vegetarian: "bg-sage/15 text-sage",
  Vegan: "bg-sage/15 text-sage",
  "Contains Egg": "bg-primary-container/20 text-primary",
  "Chilled Patisserie": "bg-surface-container text-on-surface-variant",
};

export function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (line: Omit<any, "quantity">, quantity?: number) => void;
}) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.[0]
  );
  const [added, setAdded] = useState(false);

  const price = selectedVariant ? selectedVariant.price : product.price;

  function handleAdd() {
    onAdd(
      {
        productId: product.id,
        variantId: selectedVariant?.id ?? null,
        slug: product.slug,
        name: product.name,
        variantLabel: selectedVariant?.label ?? null,
        unitPrice: price,
        image: product.images[0],
        stock: selectedVariant ? selectedVariant.stock : product.stock,
      },
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-level1 transition-all duration-300 hover:shadow-level2">
      <Link href={`/shop/${product.slug}`} className="relative block aspect-square overflow-hidden bg-surface-container">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute left-3 top-3 flex size-4 items-center justify-center rounded-sm bg-surface-container-lowest shadow-sm`}
          title={product.dietary[0]}
        >
          <span
            className={`size-2 rounded-full ${product.dietary[0] === "Eggless" ? "bg-sage" : "bg-secondary"}`}
          />
        </span>
        {product.bestseller && (
          <span className="absolute right-3 top-3 rounded-full bg-gold px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-on-surface">
            Bestseller
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-1 text-secondary text-body-sm">
          <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            star
          </span>
          <span className="font-semibold text-on-surface">{product.rating}</span>
          <span className="text-outline-variant">({product.reviewCount})</span>
        </div>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-title-lg font-semibold leading-tight text-primary transition-colors group-hover:text-primary-container">
            {product.name}
          </h3>
        </Link>
        <p className="line-clamp-1 text-body-sm text-on-surface-variant">{product.description}</p>

        {product.variants && product.variants.length > 1 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVariant(v)}
                className={`rounded-full border px-3 py-1 text-label-sm transition-colors ${
                  selectedVariant?.id === v.id
                    ? "border-primary-container bg-primary-container text-on-primary"
                    : "border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-primary-container"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-price-md font-bold text-primary">₹{price}</span>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAdd}
            className={added ? "bg-sage" : ""}
          >
            {added ? "Added" : "Add"}
          </Button>
        </div>
      </div>
    </article>
  );
}