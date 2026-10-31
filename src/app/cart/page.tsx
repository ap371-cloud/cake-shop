import type { Metadata } from "next";
import { CartPage } from "@/components/cart/cart-page";

export const metadata: Metadata = {
  title: "Your Cart · Crumble & Co.",
  description: "Review and adjust your pastry bag before checkout.",
};

export default function CartRoute() {
  return <CartPage />;
}