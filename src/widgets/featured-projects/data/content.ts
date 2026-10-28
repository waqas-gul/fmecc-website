// Section copy. Projects come from entities/project and are shown only when FMECC has supplied real ones.
export const featuredContent = {
  eyebrow: "Featured projects",
  title: "Selected work.",
  allProjects: "All projects",
  galleryLabel: "Featured projects gallery",
} as const;

// Shown instead while there are no real projects: illustrative concepts from entities/concept.
export const conceptContent = {
  eyebrow: "Project concepts",
  title: "Featured concepts.",
  allProjects: "All concepts",
  galleryLabel: "Illustrative project concepts",
} as const;
