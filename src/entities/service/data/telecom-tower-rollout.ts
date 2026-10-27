import { RadioTower } from "lucide-react";

import { placeholderImage } from "@/shared/lib/media";

import type { Service } from "../model/types";

// WS-0 STUB so the registry compiles. WS-2 owns this file and replaces the content
// (planning/MASTER_PLAN.md §4.2). TODO(content): every string and list below is a draft or empty.
export const telecomTowerRollout: Service = {
  slug: "telecom-tower-rollout",
  index: 2,
  name: "Telecom Tower Rollout and Site Construction",
  shortName: "Telecom Tower Rollout",
  tagline: "Tower erection and site construction for telecom networks.",
  summary: "Site construction for telecom networks, from civil foundations to tower erection.",
  icon: RadioTower,
  hero: placeholderImage("Telecom tower against the sky", "16:9"),
  showcaseMedia: placeholderImage("Telecom tower erection", "4:5"),
  audiences: [],
  scope: [],
  process: [],
  faq: [],
  gallery: [],
  showcase: "tower",
  seo: {
    title: "Telecom Tower Rollout and Site Construction",
    description: "Telecom tower rollout and site construction by FMECC, from civil foundations to tower erection.",
  },
};
