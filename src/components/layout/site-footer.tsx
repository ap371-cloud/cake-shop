import Link from "next/link";
import { Camera, Mail, MapPin, Phone } from "lucide-react";
import { STORE_SETTINGS } from "@/lib/data";
import { CopyrightYear } from "@/components/layout/copyright-year";

const SHOP_LINKS = [
  { href: "/shop?category=cakes", label: "Cakes" },
  { href: "/shop?category=pastries", label: "Pastries" },
  { href: "/shop?category=cookies", label: "Cookies" },
  { href: "/shop?category=breads", label: "Breads" },
  { href: "/custom-cake", label: "Custom Cakes" },
];

const HELP_LINKS = [
  { href: "/faq", label: "FAQ" },
  { href: "/track-order", label: "Track Order" },
  { href: "/contact", label: "Contact Us" },
  { href: "/account/orders", label: "My Orders" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-outline-variant/60 bg-surface-container-low">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <p className="font-display text-2xl font-semibold text-primary">Crumble &amp; Co.</p>
          <p className="mt-1 text-label-sm uppercase tracking-[0.22em] text-secondary">Artisan Bakehouse</p>
          <p className="mt-4 max-w-xs text-body leading-relaxed text-on-surface-variant">
            Small-batch cakes, laminated pastries and slow-fermented breads, baked fresh twice a day.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href="#"
              aria-label="Instagram (link to be configured)"
              className="rounded-full border border-outline-variant p-2.5 text-primary transition-colors hover:border-primary-container hover:bg-surface-container"
            >
              <Camera className="size-4" aria-hidden />
            </a>
            <a
              href={`mailto:${STORE_SETTINGS.email}`}
              aria-label="Email us"
              className="rounded-full border border-outline-variant p-2.5 text-primary transition-colors hover:border-primary-container hover:bg-surface-container"
            >
              <Mail className="size-4" aria-hidden />
            </a>
          </div>
        </div>

        <nav aria-label="Shop">
          <h2 className="text-label-md uppercase tracking-[0.16em] text-primary">Shop</h2>
          <ul className="mt-4 space-y-2.5">
            {SHOP_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-block py-1 text-body text-on-surface-variant transition-colors hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Help">
          <h2 className="text-label-md uppercase tracking-[0.16em] text-primary">Help</h2>
          <ul className="mt-4 space-y-2.5">
            {HELP_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-block py-1 text-body text-on-surface-variant transition-colors hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-label-md uppercase tracking-[0.16em] text-primary">Visit</h2>
          <ul className="mt-4 space-y-3 text-body text-on-surface-variant">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden />
              <span>{STORE_SETTINGS.address}</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden />
              <span>{STORE_SETTINGS.phone}</span>
            </li>
            <li className="text-label-md uppercase tracking-[0.12em] text-secondary">{STORE_SETTINGS.openingHours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-outline-variant/60">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-5 text-label-sm text-on-surface-variant sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© <CopyrightYear /> Crumble &amp; Co. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="inline-block py-1 transition-colors hover:text-primary">
                {link.label}
              </Link>
            ))}
            <span className="text-outline">Cash on Delivery · UPI on delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
