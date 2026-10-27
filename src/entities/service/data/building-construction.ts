import { Building } from "lucide-react";

import { placeholderImage } from "@/shared/lib/media";

import type { Service } from "../model/types";

// WS-0 STUB so the registry compiles. WS-2 owns this file and replaces the content
// (planning/MASTER_PLAN.md §4.1). TODO(content): every string and list below is a draft or empty.
export const buildingConstruction: Service = {
  slug: "building-construction",
  index: 1,
  name: "Building Construction",
  shortName: "Building Construction",
  tagline: "Buildings delivered from foundations to handover.",
  summary: "Construction delivery for residential, commercial and industrial buildings.",
  icon: Building,
  hero: placeholderImage("Building construction site", "16:9"),
  showcaseMedia: placeholderImage("Building under construction", "4:5"),
  audiences: [],
  scope: [],
  process: [],
  faq: [],
  gallery: [],
  showcase: "building",
  seo: {
    title: "Building Construction",
    description: "Construction delivery for residential, commercial and industrial buildings by FMECC.",
  },
};
