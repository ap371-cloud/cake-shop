"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { question: string; answer: string };

export function Accordion({ items, className }: { items: Item[]; className?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className={cn("divide-y divide-outline-variant/70 border-y border-outline-variant/70", className)}>
      {items.map((item, index) => {
        const open = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left font-body text-title-lg text-primary transition-colors hover:text-primary-container"
              >
                <span className="font-body text-base font-medium">{item.question}</span>
                <ChevronDown
                  aria-hidden
                  className={cn(
                    "size-5 shrink-0 transition-transform duration-300 ease-[var(--ease-soft)]",
                    open && "rotate-180"
                  )}
                />
              </button>
            </h3>

            {/* grid-rows trick animates height without measuring the DOM */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-300 ease-[var(--ease-soft)]",
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="pb-5 pr-10 text-body leading-relaxed text-on-surface-variant">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
