import { Info } from "lucide-react";

import { routes } from "@/shared/config";
import { buildMetadata } from "@/shared/lib/seo";
import { Section, SectionHeader } from "@/shared/ui";
import { conceptNotice, concepts } from "@/entities/concept";
import { projects } from "@/entities/project";
import { ProjectFilter } from "@/features/project-filter";
import { CtaBand } from "@/widgets/cta-band";
import { PageHero } from "@/widgets/page-hero";

import { checkPortfolio } from "./_lib/check-portfolio";

export const metadata = buildMetadata({
  title: "Projects",
  description:
    "FMECC project portfolio: building construction, telecom tower rollout, security systems and hydraulic parking bollards.",
  path: routes.projects,
});

/**
 * Portfolio listing (planning/MASTER_PLAN.md §6, DESIGN.md §9.3). Complete with zero projects: until
 * the first verified project exists, it shows the clearly labelled illustrative concepts instead.
 */
export default function ProjectsPage() {
  checkPortfolio(projects);
  const hasProjects = projects.length > 0;
  const showConcepts = !hasProjects && concepts.length > 0;

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Project portfolio"
        lede={
          hasProjects
            ? "Work across our four disciplines. Filter by service to find the projects closest to yours."
            : showConcepts
              ? "Verified case studies will be published here. Until then, four illustrative concepts show the kind of work each discipline covers."
              : "Verified work across building construction, telecom tower rollout, security systems and hydraulic parking bollards will be published here."
        }
        breadcrumbs={[{ label: "Home", href: routes.home }, { label: "Projects" }]}
      />
      {showConcepts ? (
        <Section container="wide">
          <SectionHeader
            eyebrow="Project concepts"
            title="Four illustrative project concepts."
            lede="One hypothetical scope per discipline. Open a concept for its overview, scope and imagery."
          />
          <p className="mt-8 flex max-w-[72ch] gap-3 rounded-md border border-line-strong bg-surface-muted p-4 text-body-sm text-ink">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-highlight" />
            {conceptNotice}
          </p>
          {/* The same browser as real projects: chips by service, mirrored in ?service=. */}
          <div className="mt-12 lg:mt-16">
            <ProjectFilter projects={[]} concepts={concepts} />
          </div>
        </Section>
      ) : (
        <Section container={hasProjects ? "wide" : "content"}>
          <ProjectFilter projects={[...projects]} />
        </Section>
      )}
      <CtaBand />
    </>
  );
}
