import type { Metadata } from "next";
import { OrdersPage } from "@/components/account/orders-page";

export const metadata: Metadata = {
  title: "My Orders",
  description: "Every Crumble & Co. order booked with your account.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <OrdersPage />;
}
