import { SquareParking } from "lucide-react";

import { placeholderImage } from "@/shared/lib/media";

import type { Service } from "../model/types";

// WS-0 STUB so the registry compiles. WS-2 owns this file and replaces the content
// (planning/MASTER_PLAN.md §4.4). TODO(content): every string and list below is a draft or empty.
export const hydraulicParkingBollards: Service = {
  slug: "hydraulic-parking-bollards",
  index: 4,
  name: "Hydraulic Parking Bollard Installation",
  shortName: "Hydraulic Parking Bollards",
  tagline: "Automatic bollards for controlled vehicle access.",
  summary: "Supply and installation of automatic hydraulic bollards for access control.",
  icon: SquareParking,
  hero: placeholderImage("Hydraulic bollards at an entrance", "16:9"),
  showcaseMedia: placeholderImage("Hydraulic bollard detail", "4:5"),
  audiences: [],
  scope: [],
  process: [],
  faq: [],
  gallery: [],
  showcase: "bollard",
  seo: {
    title: "Hydraulic Parking Bollard Installation",
    description: "Supply and installation of automatic hydraulic parking bollards for access control by FMECC.",
  },
};
