import { ArrowRight } from "lucide-react";

import type { Service } from "@/entities/service";
import { routes } from "@/shared/config";
import { Accordion, LinkButton, Section, SectionHeader } from "@/shared/ui";

/** Service page section 7 (planning/DESIGN.md §9.1): FAQ accordion with the first answer open. */
export function ServiceFaq({ service }: { service: Service }) {
  if (service.faq.length === 0) return null;
  const items = service.faq.map((item, index) => ({
    id: `question-${index + 1}`,
    title: item.question,
    content: <p>{item.answer}</p>,
  }));

  return (
    <Section id="faq" scheme="light">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col items-start gap-8 lg:col-span-4">
          <SectionHeader eyebrow="FAQ" title="Common questions" />
          <LinkButton href={routes.contact} variant="link" icon={<ArrowRight />} className="min-h-11">
            Ask us a question
          </LinkButton>
        </div>
        <Accordion items={items} defaultOpenId={items[0].id} className="lg:col-span-8" />
      </div>
    </Section>
  );
}
