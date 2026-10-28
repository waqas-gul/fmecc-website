import { ArrowUpRight, Mail, MessageCircle, Phone, type LucideIcon } from "lucide-react";

import { contactLinks, type ContactLink } from "@/shared/config";
import { cn } from "@/shared/lib/utils";
import { LinkButton } from "@/shared/ui";

const icons: Record<ContactLink["kind"], LucideIcon> = { phone: Phone, whatsapp: MessageCircle, email: Mail };

// TODO(content): FMECC to confirm the greeting that pre-fills a WhatsApp chat.
const WHATSAPP_GREETING = "Hello FMECC, I would like to discuss a project.";

/** WhatsApp opens in a new tab with a greeting filled in (planning/MASTER_PLAN.md §7); phone and email open as-is. */
const channelHref = (link: ContactLink): ContactLink["href"] =>
  link.kind === "whatsapp" ? `${link.href}?text=${encodeURIComponent(WHATSAPP_GREETING)}` : link.href;

function ExternalNote({ link }: { link: ContactLink }) {
  return link.kind === "whatsapp" ? <span className="sr-only"> (opens in a new tab)</span> : null;
}

const externalProps = (link: ContactLink) =>
  link.kind === "whatsapp" ? { target: "_blank", rel: "noopener noreferrer" } : undefined;

/**
 * Phone, WhatsApp and email links from `site.contact`. Channels FMECC has not supplied are omitted,
 * and nothing renders when none exist. `inline` is a row of buttons, `stack` a ruled list with values,
 * `grid` a set of cards.
 */
export function ContactChannels({ layout, className }: { layout: "inline" | "stack" | "grid"; className?: string }) {
  if (contactLinks.length === 0) return null;

  if (layout === "inline") {
    return (
      <ul className={cn("flex flex-wrap gap-3", className)}>
        {contactLinks.map((link) => {
          const Icon = icons[link.kind];
          return (
            <li key={link.kind}>
              <LinkButton
                href={channelHref(link)}
                external={link.kind === "whatsapp"}
                variant="outline"
                size="lg"
                icon={<Icon />}
                iconPosition="start"
              >
                {link.label}
                <span className="sr-only"> {link.value}</span>
              </LinkButton>
            </li>
          );
        })}
      </ul>
    );
  }

  if (layout === "grid") {
    return (
      <ul className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
        {contactLinks.map((link) => {
          const Icon = icons[link.kind];
          return (
            <li key={link.kind}>
              <a
                href={channelHref(link)}
                {...externalProps(link)}
                className="group flex h-full flex-col gap-6 rounded-md border border-line bg-surface-raised p-6 transition-[border-color] duration-250 hover:border-line-strong lg:p-8"
              >
                <span aria-hidden className="inline-flex size-10 items-center justify-center rounded-sm border border-line text-highlight">
                  <Icon className="size-[18px]" />
                </span>
                <span className="flex flex-col gap-2">
                  <span className="type-label text-ink-subtle">{link.label}</span>
                  <span className="text-body font-medium text-ink [overflow-wrap:anywhere] transition-colors duration-150 group-hover:text-accent-text">
                    {link.value}
                  </span>
                </span>
                <ExternalNote link={link} />
              </a>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className={cn("border-t border-line", className)}>
      {contactLinks.map((link) => {
        const Icon = icons[link.kind];
        return (
          <li key={link.kind} className="border-b border-line">
            <a href={channelHref(link)} {...externalProps(link)} className="group flex min-h-11 items-center gap-4 rounded-sm py-4">
              <span aria-hidden className="inline-flex size-10 shrink-0 items-center justify-center rounded-sm border border-line text-highlight">
                <Icon className="size-[18px]" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="type-label text-ink-subtle">{link.label}</span>
                <span className="text-body font-medium text-ink [overflow-wrap:anywhere] transition-colors duration-150 group-hover:text-accent-text">
                  {link.value}
                </span>
              </span>
              <ArrowUpRight
                aria-hidden
                className="size-4 shrink-0 text-ink-subtle transition-transform duration-150 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
              />
              <ExternalNote link={link} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
