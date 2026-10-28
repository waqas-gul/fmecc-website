import type { ImageAsset } from "@/shared/types/media";

// Section copy. Both views come from one procedural 3D model built for this website (the building
// scene in widgets/service-showcase), so the comparison is an illustration of how a concept drawing
// relates to a construction stage. It shows no real site, no before/after photography and no
// FMECC project.
export const comparisonContent = {
  eyebrow: "From concept to construction",
  title: "See a concept take shape.",
  lede: "Drag the divider to compare a concept drawing with an illustrative construction stage of the same building.",
  beforeLabel: "Concept",
  afterLabel: "Illustrative construction stage",
  points: [
    {
      title: "Concept",
      text: "The design intent as linework: the structural grid, floor plates, façade modules and the crane position.",
    },
    {
      title: "Illustrative construction stage",
      text: "The same massing rendered with its concrete frame and glazed façade, with the tower crane still on site.",
    },
  ],
  sliderLabel: "Comparison divider between the concept drawing and the construction stage",
  hint: "Drag the divider, or focus it and use the arrow keys.",
  notice:
    "Illustration only: both views come from one procedural 3D model drawn for this website. It is not a real site, and not a completed FMECC project.",
} as const;

/**
 * The building scene's poster traced as linework (scripts/concept-drawing.mjs), pixel-aligned with
 * the render it is compared against.
 */
export const conceptDrawing: ImageAsset = {
  src: "/images/showcase/building-concept.webp",
  width: 1600,
  height: 2000,
  alt: "Concept drawing: cyan linework of a mid-rise building with a two-storey podium, a glazed eight-storey tower and a tower crane, on a drafting grid.",
};
