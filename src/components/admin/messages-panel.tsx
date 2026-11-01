"use client";

import type { ContactMessage } from "@/types";
import { EmptyState } from "@/components/ui/empty-state";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function MessagesPanel({ messages }: { messages: ContactMessage[] }) {
  if (messages.length === 0) {
    return (
      <EmptyState
        icon="mail"
        title="Inbox is empty"
        description="Notes sent through the contact form appear here."
      />
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <article
          key={message.id}
          className="rounded-[var(--radius-card)] border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-level1"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-display text-lg font-semibold text-primary">{message.name}</p>
            <p className="text-label-md text-on-surface-variant">{formatDate(message.createdAt)}</p>
          </div>

          <p className="mt-1 text-body-sm text-on-surface-variant">
            <a href={`mailto:${message.email}`} className="hover:text-primary">
              {message.email}
            </a>
            {message.phone ? (
              <>
                {" · "}
                <a href={`tel:${message.phone}`} className="hover:text-primary">
                  {message.phone}
                </a>
              </>
            ) : null}
          </p>

          <p className="mt-3 whitespace-pre-line text-body text-on-surface">{message.message}</p>

          <a
            href={`mailto:${message.email}?subject=${encodeURIComponent("Re: your note to Crumble & Co.")}`}
            className="mt-4 inline-block text-label-lg text-secondary hover:text-primary"
          >
            Reply
          </a>
        </article>
      ))}
    </div>
  );
}
