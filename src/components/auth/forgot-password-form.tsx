"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { requestPasswordReset, resetPassword } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const address = String(form.get("email") ?? "");

    setPending(true);
    setError("");

    try {
      const result = await requestPasswordReset(address);
      setEmail(address);
      setNotice(result.message);
      setStep("confirm");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not send the reset.");
    } finally {
      setPending(false);
    }
  }

  async function handleConfirm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    setPending(true);
    setError("");

    try {
      const result = await resetPassword(
        email,
        String(form.get("token") ?? ""),
        String(form.get("password") ?? "")
      );

      if (!result.success) {
        setError(result.message);
        return;
      }

      router.push("/login");
    } catch (confirmError) {
      setError(confirmError instanceof Error ? confirmError.message : "Could not reset the password.");
    } finally {
      setPending(false);
    }
  }

  if (step === "request") {
    return (
      <form onSubmit={handleRequest} className="space-y-5" noValidate>
        <Field label="Email address" htmlFor="email" required>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
          />
        </Field>

        {error && (
          <p role="alert" className="rounded-xl bg-error-container px-4 py-3 text-body-sm text-error">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" loading={pending}>
          Send reset token
        </Button>

        <p className="text-center text-body-sm text-on-surface-variant">
          <Link href="/login" className="font-medium text-secondary hover:text-primary">
            Back to sign in
          </Link>
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={handleConfirm} className="space-y-5" noValidate>
      <p className="rounded-xl bg-surface-container-low px-4 py-3 text-body-sm text-on-surface-variant">
        {notice} In this local build the token is printed in the server console — copy it here.
      </p>

      <Field label="Reset token" htmlFor="token" required>
        <Input id="token" name="token" required autoComplete="one-time-code" placeholder="64-character token" />
      </Field>

      <Field label="New password" htmlFor="password" required hint="At least 8 characters.">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="••••••••"
        />
      </Field>

      {error && (
        <p role="alert" className="rounded-xl bg-error-container px-4 py-3 text-body-sm text-error">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" loading={pending}>
        Set new password
      </Button>
    </form>
  );
}
