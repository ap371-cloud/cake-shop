import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function Field({ label, htmlFor, error, hint, required, className, children }: FieldProps) {
  const describedBy = error ? `${htmlFor}-error` : hint ? `${htmlFor}-hint` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-label-lg text-primary">
        {label}
        {required && (
          <span aria-hidden className="ml-1 text-error">
            *
          </span>
        )}
      </label>

      <div aria-describedby={describedBy}>{children}</div>

      {hint && !error && (
        <p id={`${htmlFor}-hint`} className="text-label-sm text-on-surface-variant">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-label-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
