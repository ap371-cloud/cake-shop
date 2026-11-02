"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { cartCount, useCart } from "@/store/cart";
import type { UserProfile } from "@/types";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/custom-cake", label: "Custom Cakes" },
  { href: "/about", label: "Our Story" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ user }: { user: UserProfile | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const lines = useCart((state) => state.lines);

  useEffect(() => setMounted(true), []);
  useEffect(() => setMenuOpen(false), [pathname]);

  // Without this the page keeps scrolling behind the open drawer, which makes
  // the menu feel broken on a phone.
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const count = mounted ? cartCount(lines) : 0;

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const term = query.trim();
    router.push(term ? `/shop?q=${encodeURIComponent(term)}` : "/shop");
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant/50 bg-background/92 backdrop-blur-md">
      <div className="bg-primary-container px-4 py-1.5 text-center text-label-sm uppercase tracking-[0.1em] text-on-primary sm:tracking-[0.14em]">
        Fresh bake drops 9 AM &amp; 4 PM
        <span className="hidden sm:inline"> · Free delivery above ₹1,500</span>
      </div>

      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:h-18 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="-ml-2 rounded-full p-2 text-primary transition-colors hover:bg-surface-container-low lg:hidden"
        >
          {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>

        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-display text-xl font-semibold tracking-tight text-primary transition-colors group-hover:text-primary-container sm:text-2xl">
            Crumble &amp; Co.
          </span>
          <span className="mt-0.5 hidden text-label-sm uppercase tracking-[0.22em] text-secondary sm:block">
            Artisan Bakehouse
          </span>
        </Link>

        <nav aria-label="Main" className="ml-6 hidden items-center gap-7 lg:flex">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative py-1 text-label-lg transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary-container after:transition-transform after:duration-300 hover:text-primary-container hover:after:scale-x-100",
                  active ? "text-primary-container after:scale-x-100" : "text-on-surface-variant"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            aria-expanded={searchOpen}
            aria-controls="header-search"
            aria-label="Search products"
            className="rounded-full p-2.5 text-primary transition-colors hover:bg-surface-container-low"
          >
            <Search className="size-5" aria-hidden />
          </button>

          <Link
            href={user ? "/account" : "/login"}
            aria-label={user ? "Your account" : "Log in"}
            className="rounded-full p-2.5 text-primary transition-colors hover:bg-surface-container-low"
          >
            <User className="size-5" aria-hidden />
          </Link>

          <Link
            href="/cart"
            aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
            className="relative rounded-full p-2.5 text-primary transition-colors hover:bg-surface-container-low"
          >
            <ShoppingBag className="size-5" aria-hidden />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center rounded-full bg-primary-container text-[10px] font-semibold text-on-primary">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <form
          id="header-search"
          onSubmit={submitSearch}
          className="animate-panel-enter border-t border-outline-variant/50 bg-surface-container-low px-4 py-3"
        >
          <div className="mx-auto flex w-full max-w-3xl items-center gap-2">
            <label htmlFor="header-search-input" className="sr-only">
              Search products
            </label>
            <input
              id="header-search-input"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search cakes, breads, cookies…"
              className="h-10 w-full rounded-full border border-outline-variant bg-surface-container-lowest px-4 text-body outline-none focus:border-primary-container"
              autoFocus
            />
            <button
              type="submit"
              className="h-10 shrink-0 rounded-full bg-primary-container px-5 text-label-md text-on-primary"
            >
              Search
            </button>
          </div>
        </form>
      )}

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="animate-panel-enter border-t border-outline-variant/50 bg-background px-4 pb-5 pt-2 lg:hidden"
        >
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block border-b border-outline-variant/40 py-3 text-title-lg text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={user ? "/account" : "/login"} className="block py-3 text-title-lg text-primary">
                {user ? "My Account" : "Log In"}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
