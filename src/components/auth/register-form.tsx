"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { registerUser } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function RegisterForm() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirmPassword") ?? "");

    setError("");

    if (password !== confirm) {
      setError("Both passwords must match.");
      return;
    }

    setPending(true);

    try {
      await registerUser({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        password,
      });
      await refresh();
      router.push("/account");
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Could not create the account."
      );
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Field label="Full name" htmlFor="name" required>
        <Input id="name" name="name" autoComplete="name" required placeholder="Rhea Sharma" />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
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
        <Field label="Phone number" htmlFor="phone" required hint="Used to confirm deliveries.">
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="98765 43210"
          />
        </Field>
      </div>

      <Field label="Password" htmlFor="password" required hint="At least 8 characters.">
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

      <Field label="Confirm password" htmlFor="confirmPassword" required>
        <Input
          id="confirmPassword"
          name="confirmPassword"
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
        Create account
      </Button>

      <p className="text-center text-body-sm text-on-surface-variant">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-secondary hover:text-primary">
          Sign in
        </Link>
      </p>
    </form>
  );
}
