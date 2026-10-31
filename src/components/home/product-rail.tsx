"use client";

import { useCart } from "@/store/cart";
import type { Product } from "@/types";
import { ProductCard } from "@/components/shop/product-card";

export function ProductRail({ products }: { products: Product[] }) {
  const { add } = useCart();

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={add} />
      ))}
    </div>
  );
}
