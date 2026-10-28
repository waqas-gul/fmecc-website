import { routes } from "@/shared/config";
import { buildMetadata } from "@/shared/lib/seo";
import { Section } from "@/shared/ui";
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

/** Portfolio listing (planning/MASTER_PLAN.md §6, DESIGN.md §9.3). Complete with zero projects. */
export default function ProjectsPage() {
  checkPortfolio(projects);
  const hasProjects = projects.length > 0;

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Project portfolio"
        lede={
          hasProjects
            ? "Work across our four disciplines. Filter by service to find the projects closest to yours."
            : "Verified work across building construction, telecom tower rollout, security systems and hydraulic parking bollards will be published here."
        }
        breadcrumbs={[{ label: "Home", href: routes.home }, { label: "Projects" }]}
      />
      <Section container={hasProjects ? "wide" : "content"}>
        <ProjectFilter projects={[...projects]} />
      </Section>
      <CtaBand />
    </>
  );
}
