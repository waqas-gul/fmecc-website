import { Cctv } from "lucide-react";

import { placeholderImage } from "@/shared/lib/media";

import type { Service } from "../model/types";

// WS-0 STUB so the registry compiles. WS-2 owns this file and replaces the content
// (planning/MASTER_PLAN.md §4.3). TODO(content): every string and list below is a draft or empty.
export const securitySystems: Service = {
  slug: "security-systems",
  index: 3,
  name: "Security System Installation and Maintenance",
  shortName: "Security Systems",
  tagline: "Security systems installed and maintained.",
  summary: "Design, installation and maintenance of integrated security systems.",
  icon: Cctv,
  hero: placeholderImage("Security camera installation", "16:9"),
  showcaseMedia: placeholderImage("Security control room", "4:5"),
  audiences: [],
  scope: [],
  process: [],
  faq: [],
  gallery: [],
  showcase: "coverage",
  seo: {
    title: "Security System Installation and Maintenance",
    description: "Design, installation and maintenance of integrated security systems by FMECC.",
  },
};
