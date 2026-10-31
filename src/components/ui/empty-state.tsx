import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonStyles } from "@/components/ui/button";

type EmptyStateAction = React.ReactNode | { label: string; href: string };

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
  action?: EmptyStateAction;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] border border-dashed border-outline-variant bg-surface-container-low/60 px-6 py-14 text-center",
        className
      )}
    >
      {icon &&
        (typeof icon === "string" ? (
          <span aria-hidden className="material-symbols-outlined text-[40px] text-outline">
            {icon}
          </span>
        ) : (
          <div className="text-outline">{icon}</div>
        ))}
      <h3 className="text-headline-sm">{title}</h3>
      {description && <p className="max-w-sm text-body text-on-surface-variant">{description}</p>}
      {action && (
        <div className="mt-2">
          {isActionLink(action) ? (
            <Link href={action.href} className={buttonStyles("primary", "md")}>
              {action.label}
            </Link>
          ) : (
            action
          )}
        </div>
      )}
    </div>
  );
}

function isActionLink(action: EmptyStateAction): action is { label: string; href: string } {
  return (
    typeof action === "object" &&
    action !== null &&
    "label" in action &&
    "href" in action
  );
}
