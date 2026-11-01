"use client";

import { useState } from "react";
import type { StoreSettings } from "@/types";
import { updateStoreSettings } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function SettingsPanel({
  settings,
  onChange,
}: {
  settings: StoreSettings;
  onChange: (settings: StoreSettings) => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    setPending(true);
    setError("");
    setSaved(false);

    try {
      const updated = await updateStoreSettings({
        deliveryFee: Number(form.get("deliveryFee")),
        freeDeliveryThreshold: Number(form.get("freeDeliveryThreshold")),
        phone: String(form.get("phone") ?? ""),
        email: String(form.get("email") ?? ""),
        address: String(form.get("address") ?? ""),
        openingHours: String(form.get("openingHours") ?? ""),
        bakeDropTimes: String(form.get("bakeDropTimes") ?? ""),
      });

      onChange(updated);
      setSaved(true);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save the settings.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl rounded-[var(--radius-card)] border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-level1"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Delivery fee" htmlFor="deliveryFee" hint="Charged below the free-delivery threshold.">
          <Input
            id="deliveryFee"
            name="deliveryFee"
            type="number"
            min={0}
            step={1}
            defaultValue={settings.deliveryFee}
            required
          />
        </Field>

        <Field label="Free delivery above" htmlFor="freeDeliveryThreshold">
          <Input
            id="freeDeliveryThreshold"
            name="freeDeliveryThreshold"
            type="number"
            min={0}
            step={1}
            defaultValue={settings.freeDeliveryThreshold}
            required
          />
        </Field>

        <Field label="Phone" htmlFor="phone">
          <Input id="phone" name="phone" defaultValue={settings.phone} required />
        </Field>

        <Field label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" defaultValue={settings.email} required />
        </Field>
      </div>

      <Field label="Address" htmlFor="address" className="mt-5">
        <Input id="address" name="address" defaultValue={settings.address} required />
      </Field>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field label="Opening hours" htmlFor="openingHours">
          <Input id="openingHours" name="openingHours" defaultValue={settings.openingHours} required />
        </Field>

        <Field label="Bake drop times" htmlFor="bakeDropTimes">
          <Input id="bakeDropTimes" name="bakeDropTimes" defaultValue={settings.bakeDropTimes} required />
        </Field>
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-xl bg-error-container px-4 py-3 text-body-sm text-error">
          {error}
        </p>
      )}
      {saved && (
        <p className="mt-5 rounded-xl bg-sage/15 px-4 py-3 text-body-sm text-sage">
          Settings saved. The storefront picks them up on the next page load.
        </p>
      )}

      <Button type="submit" className="mt-6" loading={pending}>
        Save settings
      </Button>
    </form>
  );
}
