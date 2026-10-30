import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary-container text-on-primary hover:bg-primary shadow-level1 hover:shadow-level2 disabled:bg-outline-variant disabled:text-on-surface-variant disabled:shadow-none",
  secondary:
    "bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed shadow-level1 hover:shadow-level2",
  outline:
    "border border-outline-variant text-primary bg-transparent hover:border-primary-container hover:bg-surface-container-low",
  ghost: "text-primary bg-transparent hover:bg-surface-container-low",
  danger: "bg-error text-on-error hover:brightness-95",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-label-md",
  md: "h-11 px-6 text-label-lg",
  lg: "h-13 px-8 text-label-lg",
  icon: "h-10 w-10 justify-center",
};

export function buttonStyles(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-300 ease-[var(--ease-soft)]",
    "disabled:pointer-events-none disabled:opacity-60 active:scale-[0.98]",
    variants[variant],
    sizes[size],
    className
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

export function Button({ variant = "primary", size = "md", loading, className, children, disabled, ...rest }: ButtonProps) {
  return (
    <button
      className={buttonStyles(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  );
}
