import Link from "next/link";
import { Cookie } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-6 py-24 text-center">
      <Cookie className="size-12 text-secondary" aria-hidden />
      <p className="mt-6 text-label-md uppercase tracking-[0.22em] text-secondary">404</p>
      <h1 className="mt-2 text-display-lg-mobile sm:text-display-lg">This page went out with the morning bake</h1>
      <p className="mt-4 max-w-md text-body leading-relaxed text-on-surface-variant">
        The page you are looking for does not exist, or it has moved. Let us get you back to something warm.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonStyles("primary", "md")}>
          Back to home
        </Link>
        <Link href="/shop" className={buttonStyles("outline", "md")}>
          Browse the counter
        </Link>
      </div>
    </div>
  );
}
