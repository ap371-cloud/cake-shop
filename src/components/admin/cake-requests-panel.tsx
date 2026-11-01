"use client";

import { useState } from "react";
import type { CustomCakeRequest } from "@/types";
import { updateCakeRequestStatus } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";

const STATUSES: CustomCakeRequest["status"][] = [
  "new",
  "reviewing",
  "quoted",
  "accepted",
  "declined",
];

const tone: Record<CustomCakeRequest["status"], string> = {
  new: "bg-secondary-container text-on-secondary-container",
  reviewing: "bg-primary-fixed text-primary",
  quoted: "bg-surface-container text-on-surface-variant",
  accepted: "bg-sage/15 text-sage",
  declined: "bg-error-container text-error",
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function CakeRequestsPanel({
  requests,
  onChange,
}: {
  requests: CustomCakeRequest[];
  onChange: (request: CustomCakeRequest) => void;
}) {
  const [drafts, setDrafts] = useState<Record<string, CustomCakeRequest["status"]>>({});
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  async function applyStatus(request: CustomCakeRequest, status: CustomCakeRequest["status"]) {
    setBusyId(request.id);
    setError("");

    try {
      const updated = await updateCakeRequestStatus(request.id, status);
      onChange(updated);
      setDrafts((prev) => ({ ...prev, [request.id]: updated.status }));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Could not update the request.");
    } finally {
      setBusyId("");
    }
  }

  if (requests.length === 0) {
    return (
      <EmptyState
        icon="cake"
        title="No commissions yet"
        description="Custom cake briefs from the website land here, newest first."
      />
    );
  }

  return (
    <div>
      {error && (
        <p role="alert" className="mb-4 rounded-xl bg-error-container px-4 py-3 text-body-sm text-error">
          {error}
        </p>
      )}

      <div className="space-y-4">
        {requests.map((request) => {
          const nextStatus = drafts[request.id] ?? request.status;

          return (
            <article
              key={request.id}
              className="rounded-[var(--radius-card)] border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-level1"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-semibold text-primary">
                    {request.occasion} · {request.size}
                  </p>
                  <p className="text-label-md text-on-surface-variant">
                    Brief received {formatDate(request.createdAt)} · wanted by{" "}
                    {formatDate(request.preferredDate)}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-label-md capitalize ${tone[request.status]}`}>
                  {request.status}
                </span>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="text-body-sm text-on-surface-variant">
                  <p className="font-medium text-on-surface">{request.name}</p>
                  <p>
                    <a href={`tel:${request.phone}`} className="hover:text-primary">
                      {request.phone}
                    </a>
                    {" · "}
                    <a href={`mailto:${request.email}`} className="hover:text-primary">
                      {request.email}
                    </a>
                  </p>
                  <p className="mt-1">
                    {request.flavour} · {request.shape} · {request.budgetRange}
                  </p>
                  {request.referenceImageUrl && (
                    <a
                      href={request.referenceImageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-secondary hover:text-primary"
                    >
                      Reference image
                    </a>
                  )}
                </div>

                <p className="rounded-lg bg-surface-container-low p-3 text-body-sm text-on-surface-variant">
                  {request.designDescription}
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-2 border-t border-outline-variant/60 pt-4 sm:flex-row sm:items-center">
                <Select
                  aria-label={`Status for ${request.name}`}
                  value={nextStatus}
                  onChange={(event) =>
                    setDrafts((prev) => ({
                      ...prev,
                      [request.id]: event.target.value as CustomCakeRequest["status"],
                    }))
                  }
                  className="sm:max-w-44"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>

                <Button
                  onClick={() => applyStatus(request, nextStatus)}
                  loading={busyId === request.id}
                  disabled={nextStatus === request.status}
                >
                  Update
                </Button>

                <a
                  href={`mailto:${request.email}?subject=${encodeURIComponent(
                    `Your custom cake brief — ${request.occasion}`
                  )}`}
                  className="text-label-lg text-secondary hover:text-primary sm:ml-auto"
                >
                  Reply by email
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
