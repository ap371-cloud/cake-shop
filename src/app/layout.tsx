import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Providers } from "@/components/providers";
import { getCurrentUser } from "@/lib/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Crumble & Co. — Artisan Bakehouse",
    template: "%s · Crumble & Co.",
  },
  description:
    "Small-batch cakes, laminated pastries and slow-fermented breads from Crumble & Co. Fresh bake drops twice a day, cash on delivery.",
  openGraph: {
    type: "website",
    siteName: "Crumble & Co.",
    title: "Crumble & Co. — Artisan Bakehouse",
    description:
      "Small-batch cakes, laminated pastries and slow-fermented breads. Fresh bake drops twice a day, cash on delivery.",
    url: siteUrl,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#6F3827",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary-container focus:px-5 focus:py-2.5 focus:text-label-lg focus:text-on-primary"
        >
          Skip to content
        </a>
        <Providers>
          <SiteHeader user={user} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
