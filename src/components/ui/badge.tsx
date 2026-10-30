import { cn } from "@/lib/utils";

type Tone = "neutral" | "brand" | "gold" | "sage" | "error" | "outline";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-container text-on-surface-variant",
  brand: "bg-primary-fixed text-primary",
  gold: "bg-secondary-container/70 text-on-secondary-container",
  sage: "bg-sage/12 text-sage",
  error: "bg-error-container text-error",
  outline: "border border-outline-variant text-on-surface-variant",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-label-sm uppercase",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
