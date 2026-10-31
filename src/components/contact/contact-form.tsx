"use client";

import { useState } from "react";
import { createContactMessage } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Select, Textarea } from "@/components/ui/input";

const inquiryTypes = [
  "General inquiry",
  "Custom cake consultation",
  "Bulk / corporate gifting",
  "Delivery feedback",
  "Something else",
];

export function ContactForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");

    try {
      await createContactMessage({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        message: `[${form.get("inquiry")}] ${form.get("message")}`,
      });
      setSent(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not send the message.");
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-[var(--radius-card)] border border-sage/30 bg-sage/5 p-8 text-center">
        <span aria-hidden className="material-symbols-outlined text-[36px] text-sage">
          check_circle
        </span>
        <h3 className="mt-3 font-display text-2xl font-semibold text-primary">
          Thank you for your note
        </h3>
        <p className="mt-2 text-body text-on-surface-variant">
          Our Freeganj atelier has your dispatch. A pastry chef replies within two business hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="name" required>
          <Input id="name" name="name" autoComplete="name" required placeholder="Rhea Sharma" />
        </Field>
        <Field label="Phone number" htmlFor="phone" hint="Only if you'd prefer a call back.">
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="98765 43210"
          />
        </Field>
      </div>

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

      <Field label="What is this about?" htmlFor="inquiry">
        <Select id="inquiry" name="inquiry" defaultValue={inquiryTypes[0]}>
          {inquiryTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Message & event details" htmlFor="message" required>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Flavour ideas, tier count, date, and anything else we should know."
        />
      </Field>

      {error && (
        <p role="alert" className="rounded-xl bg-error-container px-4 py-3 text-body-sm text-error">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" loading={pending}>
          Send message
        </Button>
        <p className="text-label-md text-on-surface-variant">
          Pastry chefs reply within two business hours.
        </p>
      </div>
    </form>
  );
}
