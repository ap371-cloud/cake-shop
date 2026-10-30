import { cn } from "@/lib/utils";

export function Card({
  className,
  interactive,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-outline-variant/60 bg-surface-container-lowest shadow-level1",
        interactive &&
          "transition-all duration-400 ease-[var(--ease-soft)] hover:-translate-y-1 hover:shadow-level2",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5", className)} {...rest}>
      {children}
    </div>
  );
}
