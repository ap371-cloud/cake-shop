"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { loginUser } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { refresh } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const next = params.get("next") ?? "/account";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");

    try {
      await loginUser({
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
      });
      await refresh();
      router.push(next);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not sign you in.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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

      <Field label="Password" htmlFor="password" required>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
      </Field>

      <div className="flex justify-end">
        <Link href="/forgot-password" className="text-label-lg text-secondary hover:text-primary">
          Forgot password?
        </Link>
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-error-container px-4 py-3 text-body-sm text-error">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" loading={pending}>
        Sign in
      </Button>

      <p className="text-center text-body-sm text-on-surface-variant">
        New to the atelier?{" "}
        <Link href="/register" className="font-medium text-secondary hover:text-primary">
          Create an account
        </Link>
      </p>
    </form>
  );
}
