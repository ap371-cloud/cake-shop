import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your Crumble & Co. account password.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6 lg:py-24">
      <p className="text-label-md uppercase tracking-[0.18em] text-secondary">Account recovery</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-primary">Reset your password</h1>
      <p className="mt-2 text-body text-on-surface-variant">
        Enter the email on your account and we will issue a single-use reset token.
      </p>

      <div className="mt-8 rounded-[var(--radius-card)] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-level1">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
