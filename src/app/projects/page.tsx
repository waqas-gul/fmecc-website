import { routes } from "@/shared/config";
import { buildMetadata } from "@/shared/lib/seo";
import { Section } from "@/shared/ui";
import { conceptNotice, concepts } from "@/entities/concept";
import { projects } from "@/entities/project";
import { ProjectFilter } from "@/features/project-filter";
import { CtaBand } from "@/widgets/cta-band";
import { PageHero } from "@/widgets/page-hero";
import { PortfolioHero } from "@/widgets/portfolio-hero";
import { showcaseScenes } from "@/widgets/service-showcase";

import { checkPortfolio } from "./_lib/check-portfolio";

export const metadata = buildMetadata({
  title: "Projects",
  description:
    "FMECC project portfolio: building construction, telecom tower rollout, security systems and hydraulic parking bollards.",
  path: routes.projects,
});

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Portfolio listing (planning/MASTER_PLAN.md §6, DESIGN.md §9.3). Complete with zero projects: until
 * the first verified project exists, it opens on "Selected concepts" and presents the clearly
 * labelled illustrative concepts as editorial features instead.
 */
export default function ProjectsPage() {
  checkPortfolio(projects);
  const hasProjects = projects.length > 0;
  const showConcepts = !hasProjects && concepts.length > 0;
  const breadcrumbs = [{ label: "Home", href: routes.home }, { label: "Projects" }];

  if (showConcepts) {
    const disciplines = new Set(concepts.map((concept) => concept.service)).size;
    return (
      <>
        {/* The building render is project-owned 3D artwork, so the opening image is honest about being an illustration. */}
        <PortfolioHero
          eyebrow="Illustrative project concepts"
          title={["Selected", "concepts"]}
          lede="One hypothetical scope for each of our disciplines, from the first survey to handover. Verified case studies will be published here once their facts and imagery are confirmed."
          notice={conceptNotice}
          media={showcaseScenes.building.poster}
          caption="Illustrative 3D model"
          facts={[
            { label: "Concepts", value: pad(concepts.length) },
            { label: "Disciplines", value: pad(disciplines) },
            { label: "Case studies", value: "In preparation" },
          ]}
          breadcrumbs={breadcrumbs}
          scrollTo={{ href: "#concepts", label: "Scroll to explore", description: "the concepts" }}
        />
        {/* The same browser as real projects: filters by service, mirrored in ?service=. */}
        <Section id="concepts" container="wide">
          <ProjectFilter projects={[]} concepts={concepts} />
        </Section>
        <CtaBand />
      </>
    );
  }

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
        breadcrumbs={breadcrumbs}
      />
      <Section container={hasProjects ? "wide" : "content"}>
        <ProjectFilter projects={[...projects]} />
      </Section>
      <CtaBand />
    </>
  );
}
