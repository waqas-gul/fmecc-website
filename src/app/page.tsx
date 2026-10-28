import { routes, site } from "@/shared/config";
import { buildMetadata } from "@/shared/lib/seo";
import { company } from "@/entities/company";
import { getFeaturedProjects } from "@/entities/project";
import { CtaBand } from "@/widgets/cta-band";
import { FeaturedProjects } from "@/widgets/featured-projects";
import { HomeHero } from "@/widgets/home-hero";
import { HomeIntro } from "@/widgets/home-intro";
import { ProcessSection } from "@/widgets/process-section";
import { showcaseScenes } from "@/widgets/service-showcase";
import { ServicesShowcase } from "@/widgets/services-showcase";
import { ValuesSection } from "@/widgets/values-section";

export const metadata = buildMetadata({ title: site.legalName, description: site.description, path: routes.home });

/** Home (planning/MASTER_PLAN.md §5): hero, introduction, services, process, proof, principles, CTA. */
export default function HomePage() {
  // Only real projects: sample entries never stand in for delivered work on Home (MASTER_PLAN.md §6).
  const featured = getFeaturedProjects(6).filter((project) => !project.placeholder);
  // Home's one 3D canvas (planning/MASTER_PLAN.md §9): the tower assembles with the delivery steps.
  const tower = showcaseScenes.tower;

  return (
    <>
      <HomeHero />
      <HomeIntro />
      <ServicesShowcase />
      <ProcessSection steps={company.process} scene={tower.load} poster={tower.poster} />
      <FeaturedProjects projects={featured} />
      <ValuesSection values={company.values} />
      <CtaBand />
    </>
  );
}
