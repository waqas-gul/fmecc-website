import { routes, site } from "@/shared/config";
import { placeholderImage } from "@/shared/lib/media";
import { buildMetadata } from "@/shared/lib/seo";
import { company } from "@/entities/company";
import { getFeaturedProjects } from "@/entities/project";
import { CtaBand } from "@/widgets/cta-band";
import { FeaturedProjects } from "@/widgets/featured-projects";
import { HomeHero } from "@/widgets/home-hero";
import { HomeIntro } from "@/widgets/home-intro";
import { ProcessSection } from "@/widgets/process-section";
import { ServicesShowcase } from "@/widgets/services-showcase";
import { ValuesSection } from "@/widgets/values-section";

export const metadata = buildMetadata({ title: site.legalName, description: site.description, path: routes.home });

// Still image for the process visual and the tower scene's poster fallback. FMECC/WS-5 supply the
// real render; until then it is a flagged placeholder panel (planning/DESIGN.md §12.4).
const towerPoster = placeholderImage("Lattice telecom tower assembled section by section", "4:5");

/** Home (planning/MASTER_PLAN.md §5): hero, introduction, services, process, proof, principles, CTA. */
export default function HomePage() {
  // Only real projects: sample entries never stand in for delivered work on Home (MASTER_PLAN.md §6).
  const featured = getFeaturedProjects(6).filter((project) => !project.placeholder);

  return (
    <>
      <HomeHero />
      <HomeIntro />
      <ServicesShowcase variant="home" />
      {/* WS-5 owns the tower scene. Once it exports a SceneLoader, pass it here as `scene`;
          until then the section shows the poster, the same fallback LazyScene uses. */}
      <ProcessSection steps={company.process} poster={towerPoster} />
      <FeaturedProjects projects={featured} />
      <ValuesSection values={company.values} />
      <CtaBand />
    </>
  );
}
