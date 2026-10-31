"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product, ProductVariant } from "@/types";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";

const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export function ProductDetail({ product }: { product: Product }) {
  const add = useCart((state) => state.add);
  const [variant, setVariant] = useState<ProductVariant | undefined>(product.variants?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  const price = variant?.price ?? product.price;
  const stock = variant?.stock ?? product.stock;
  const maxQuantity = Math.max(1, Math.min(10, stock));

  function handleAdd() {
    add(
      {
        productId: product.id,
        variantId: variant?.id ?? null,
        slug: product.slug,
        name: product.name,
        variantLabel: variant?.label ?? null,
        unitPrice: price,
        image: product.images[0],
        stock,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-2 text-body-sm text-on-surface-variant">
        <Link href="/shop" className="hover:text-primary">
          Shop
        </Link>
        <span>/</span>
        <span className="text-on-surface">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-container">
            <Image
              src={product.images[activeImage] ?? product.images[0]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {product.bestseller && (
              <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-label-sm font-semibold text-on-surface">
                Bestseller
              </span>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`relative size-16 overflow-hidden rounded-lg border-2 ${
                    activeImage === index ? "border-primary-container" : "border-transparent"
                  }`}
                >
                  <Image src={image} alt="" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-label-md uppercase tracking-wider text-on-surface-variant">
            {product.category}
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-primary sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-2 flex items-center gap-2 text-body-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-secondary">
              star
            </span>
            <span className="font-semibold text-on-surface">{product.rating}</span>
            <span>({product.reviewCount} reviews)</span>
          </div>

          <p className="mt-4 text-body-lg text-on-surface-variant">{product.description}</p>

          <p className="mt-6 font-price-lg font-bold text-primary">{money(price)}</p>
          {product.weight && (
            <p className="text-body-sm text-on-surface-variant">Net weight {product.weight}</p>
          )}

          {product.variants && product.variants.length > 1 && (
            <div className="mt-6">
              <p className="mb-2 text-label-md font-semibold text-on-surface">Choose a size</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((option) => {
                  const soldOut = option.stock <= 0;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={soldOut}
                      onClick={() => {
                        setVariant(option);
                        setQuantity(1);
                      }}
                      className={`rounded-full border px-4 py-2 text-label-md transition-colors ${
                        variant?.id === option.id
                          ? "border-primary-container bg-primary-container text-on-primary"
                          : "border-outline-variant text-on-surface-variant hover:border-primary-container"
                      } ${soldOut ? "cursor-not-allowed opacity-40" : ""}`}
                    >
                      {option.label} · {money(option.price)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-outline-variant">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="px-3 py-2 text-on-surface-variant disabled:opacity-40"
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="w-8 text-center text-body font-semibold">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))}
                className="px-3 py-2 text-on-surface-variant disabled:opacity-40"
                disabled={quantity >= maxQuantity}
              >
                +
              </button>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleAdd}
              disabled={stock <= 0}
              className={added ? "bg-sage" : ""}
            >
              {stock <= 0 ? "Sold out" : added ? "Added to bag" : "Add to pastry bag"}
            </Button>
          </div>

          {stock > 0 && stock <= 5 && (
            <p className="mt-3 text-body-sm text-primary">Only {stock} left in this batch.</p>
          )}

          <dl className="mt-8 divide-y divide-outline-variant border-t border-outline-variant text-body-sm">
            <Detail label="Ingredients" value={product.ingredients.join(", ")} />
            {product.allergens.length > 0 && (
              <Detail label="Allergens" value={product.allergens.join(", ")} />
            )}
            {product.dietary.length > 0 && (
              <Detail label="Dietary" value={product.dietary.join(", ")} />
            )}
            {product.storage && <Detail label="Storage" value={product.storage} />}
          </dl>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 py-3">
      <dt className="font-semibold text-on-surface">{label}</dt>
      <dd className="text-on-surface-variant">{value}</dd>
    </div>
  );
}
