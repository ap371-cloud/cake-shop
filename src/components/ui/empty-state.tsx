import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] border border-dashed border-outline-variant bg-surface-container-low/60 px-6 py-14 text-center",
        className
      )}
    >
      {icon && <div className="text-outline">{icon}</div>}
      <h3 className="text-headline-sm">{title}</h3>
      {description && <p className="max-w-sm text-body text-on-surface-variant">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
