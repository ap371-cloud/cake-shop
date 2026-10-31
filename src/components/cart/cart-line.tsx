"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart, type CartLine as CartLineType } from "@/store/cart";

export function CartLine({ line }: { line: CartLineType }) {
  const setQuantity = useCart((state) => state.setQuantity);
  const remove = useCart((state) => state.remove);

  const key = [line.productId, line.variantId] as const;
  const maxQuantity = Math.max(1, Math.min(10, line.stock));

  return (
    <li className="flex gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-level1">
      <Link
        href={`/shop/${line.slug}`}
        className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-surface-container"
      >
        <Image src={line.image} alt={line.name} fill sizes="96px" className="object-cover" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/shop/${line.slug}`}
              className="block truncate font-title-lg font-semibold text-primary hover:text-primary-container"
            >
              {line.name}
            </Link>
            {line.variantLabel && (
              <p className="text-body-sm text-on-surface-variant">{line.variantLabel}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => remove(...key)}
            className="shrink-0 text-body-sm text-on-surface-variant underline-offset-2 hover:text-error hover:underline"
          >
            Remove
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center rounded-full border border-outline-variant">
            <button
              type="button"
              aria-label={`Decrease quantity of ${line.name}`}
              onClick={() => setQuantity(...key, line.quantity - 1)}
              className="px-3 py-1.5 text-on-surface-variant"
            >
              −
            </button>
            <span className="w-7 text-center text-body-sm font-semibold">{line.quantity}</span>
            <button
              type="button"
              aria-label={`Increase quantity of ${line.name}`}
              disabled={line.quantity >= maxQuantity}
              onClick={() => setQuantity(...key, line.quantity + 1)}
              className="px-3 py-1.5 text-on-surface-variant disabled:opacity-40"
            >
              +
            </button>
          </div>

          <span className="font-price-md font-bold text-primary">
            ₹{(line.unitPrice * line.quantity).toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </li>
  );
}
