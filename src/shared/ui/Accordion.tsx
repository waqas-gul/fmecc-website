"use client";

import { useId, useState } from "react";
import { LazyMotion, MotionConfig, domAnimation, m, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";

import { motionTokens } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/utils";

/**
 * Disclosure list for FAQs (planning/DESIGN.md §7.4). Collapsed answers stay in the HTML
 * (inert and zero height) so they are indexable and need no extra request.
 */
export function Accordion({
  items,
  defaultOpenId,
  className,
}: {
  items: { id: string; title: string; content: React.ReactNode }[];
  defaultOpenId?: string;
  className?: string;
}) {
  const baseId = useId();
  const reducedMotion = useReducedMotion();
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(() => new Set(defaultOpenId ? [defaultOpenId] : []));

  const toggle = (id: string) =>
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div className={cn("border-t border-line", className)}>
          {items.map((item, index) => {
            const open = openIds.has(item.id);
            const buttonId = `${baseId}-${item.id}-button`;
            const panelId = `${baseId}-${item.id}-panel`;

            return (
              <div key={item.id} className="border-b border-line">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => toggle(item.id)}
                    className="group flex w-full items-start gap-5 py-6 text-left"
                  >
                    <span className="type-label pt-1.5 text-highlight tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-display text-heading-sm font-semibold text-ink transition-colors duration-150 group-hover:text-accent-text">
                      {item.title}
                    </span>
                    <Plus
                      aria-hidden
                      className={cn(
                        "mt-0.5 size-5 shrink-0 text-ink-muted transition-transform duration-250 ease-out-expo",
                        open && "rotate-45",
                      )}
                    />
                  </button>
                </h3>
                <m.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  inert={!open}
                  initial={false}
                  animate={open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                  transition={{
                    duration: reducedMotion ? motionTokens.duration.micro : motionTokens.duration.ui,
                    ease: motionTokens.bezier.standard,
                  }}
                  className="overflow-hidden"
                >
                  <div className="max-w-[65ch] pb-7 pl-11 text-body text-ink-muted">{item.content}</div>
                </m.div>
              </div>
            );
          })}
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
