import type { Metadata } from "next";
import { AccountPage } from "@/components/account/account-page";

export const metadata: Metadata = {
  title: "Account",
  description: "Your Crumble & Co. account — orders, delivery details and quick reorders.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AccountPage />;
}
