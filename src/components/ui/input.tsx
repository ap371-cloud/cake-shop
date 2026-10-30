import { cn } from "@/lib/utils";

const base =
  "w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-body text-on-surface " +
  "placeholder:text-on-surface-variant/60 transition-colors duration-200 " +
  "focus:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container/20 " +
  "disabled:cursor-not-allowed disabled:bg-surface-container-low disabled:text-on-surface-variant " +
  "aria-[invalid=true]:border-error aria-[invalid=true]:ring-error/20";

export function Input({ className, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(base, "h-11 py-0", className)} {...rest} />;
}

export function Textarea({ className, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(base, "min-h-28 resize-y", className)} {...rest} />;
}

export function Select({ className, children, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(base, "h-11 cursor-pointer py-0 pr-10", className)} {...rest}>
      {children}
    </select>
  );
}
