// Illustrative project concepts, kept apart from the real portfolio (entities/project) so that real
// projects replace them without touching either slice's API.
export { conceptNotice } from "./data/concepts";
export { conceptMediaTransition, conceptNumber, concepts, getConcept } from "./model/registry";
export type { ProjectConcept } from "./model/types";
export { ConceptCard } from "./ui/ConceptCard";
export { ConceptFeature } from "./ui/ConceptFeature";
