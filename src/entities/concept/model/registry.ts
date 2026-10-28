import { conceptData } from "../data/concepts";
import type { ProjectConcept } from "./types";

/** Illustrative concepts in display order (one per service). */
export const concepts: readonly ProjectConcept[] = conceptData;

export const getConcept = (slug: string): ProjectConcept | undefined => concepts.find((concept) => concept.slug === slug);

/** 1-based position, shown as "Concept 01". */
export const conceptNumber = (slug: string): number => concepts.findIndex((concept) => concept.slug === slug) + 1;

/**
 * View-transition name shared by a concept card's media and the concept page hero, so navigating
 * between them morphs one into the other. Unique per concept: a page shows each concept once.
 */
export const conceptMediaTransition = (slug: string): string => `concept-media-${slug}`;
