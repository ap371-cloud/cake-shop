"use client";

import { useState } from "react";
import { createCakeRequest } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Select, Textarea } from "@/components/ui/input";

const occasions = [
  "Birthday milestone",
  "Wedding celebration",
  "Anniversary",
  "Baby shower / gender reveal",
  "Graduation / achievement",
  "Corporate gala / launch",
  "Something else",
];

const flavours = [
  "Belgian dark chocolate truffle",
  "Madagascar vanilla & berry compote",
  "Red velvet with cream cheese",
  "Roasted hazelnut & butterscotch praline",
  "Classic black forest with cherries",
  "Custom flavour (described below)",
];

const sizes = [
  "0.5 kg — 4 to 6 guests",
  "1.0 kg — 8 to 10 guests",
  "2.0 kg tiered — 16 to 20 guests",
  "3+ kg grand — 25+ guests",
];

const shapes = ["Round", "Square", "Two-tier", "Sculpted / themed", "Not sure yet"];

const budgets = ["₹2,400 – ₹4,000", "₹4,000 – ₹8,000", "₹8,000 – ₹15,000", "₹15,000 and above"];

function earliestDate() {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return date.toISOString().slice(0, 10);
}

export function CustomCakeForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");

    try {
      await createCakeRequest({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        occasion: String(form.get("occasion") ?? ""),
        preferredDate: String(form.get("preferredDate") ?? ""),
        flavour: String(form.get("flavour") ?? ""),
        size: String(form.get("size") ?? ""),
        shape: String(form.get("shape") ?? ""),
        budgetRange: String(form.get("budgetRange") ?? ""),
        designDescription: String(form.get("designDescription") ?? ""),
      });
      setSent(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Could not send the request."
      );
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-[var(--radius-card)] border border-sage/30 bg-sage/5 p-8">
        <span aria-hidden className="material-symbols-outlined text-[36px] text-sage">
          check_circle
        </span>
        <h3 className="mt-3 font-display text-2xl font-semibold text-primary">
          Your commission is in
        </h3>
        <p className="mt-2 text-body text-on-surface-variant">
          The head patissier reviews every brief personally. Expect a call within a few hours to
          finalise flavour, weight and the design sketch.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <fieldset className="space-y-5">
        <legend className="flex items-center gap-3 text-title-lg text-primary">
          <span className="grid size-7 place-items-center rounded-full bg-primary text-label-md text-on-primary">
            1
          </span>
          Customer &amp; event details
        </legend>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="name" required>
            <Input id="name" name="name" autoComplete="name" required placeholder="Rhea Sharma" />
          </Field>
          <Field label="Phone number" htmlFor="phone" required>
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

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Occasion" htmlFor="occasion">
            <Select id="occasion" name="occasion" defaultValue={occasions[0]}>
              {occasions.map((occasion) => (
                <option key={occasion} value={occasion}>
                  {occasion}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="Preferred date"
            htmlFor="preferredDate"
            required
            hint="Custom cakes need at least 48 hours notice."
          >
            <Input
              id="preferredDate"
              name="preferredDate"
              type="date"
              required
              min={earliestDate()}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-5 border-t border-outline-variant/60 pt-8">
        <legend className="flex items-center gap-3 text-title-lg text-primary">
          <span className="grid size-7 place-items-center rounded-full bg-primary text-label-md text-on-primary">
            2
          </span>
          Cake specifications
        </legend>

        <Field label="Signature flavour pairing" htmlFor="flavour">
          <Select id="flavour" name="flavour" defaultValue={flavours[0]}>
            {flavours.map((flavour) => (
              <option key={flavour} value={flavour}>
                {flavour}
              </option>
            ))}
          </Select>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Size & servings" htmlFor="size">
            <Select id="size" name="size" defaultValue={sizes[1]}>
              {sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Shape" htmlFor="shape">
            <Select id="shape" name="shape" defaultValue={shapes[0]}>
              {shapes.map((shape) => (
                <option key={shape} value={shape}>
                  {shape}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Budget range" htmlFor="budgetRange">
          <Select id="budgetRange" name="budgetRange" defaultValue={budgets[1]}>
            {budgets.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Design brief"
          htmlFor="designDescription"
          required
          hint="Colours, piping style, toppers, inscription, dietary needs — the more the better."
        >
          <Textarea
            id="designDescription"
            name="designDescription"
            required
            rows={5}
            maxLength={1500}
            placeholder="A two-tier vintage lambeth cake in dusty rose, gold leaf edges, eggless, with 'Happy 30th, Ananya' piped on top."
          />
        </Field>
      </fieldset>

      {error && (
        <p role="alert" className="rounded-xl bg-error-container px-4 py-3 text-body-sm text-error">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" loading={pending}>
        Send design brief
      </Button>
    </form>
  );
}
