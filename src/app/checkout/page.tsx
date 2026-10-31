import type { Metadata } from "next";
import { CheckoutPage } from "@/components/checkout/checkout-page";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Confirm your delivery details and place the order. No online payment — pay by cash or UPI when your bakes arrive.",
};

export default function Page() {
  return <CheckoutPage />;
}
