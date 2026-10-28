import {
  ArrowUpFromLine,
  ScanSearch,
  Shovel,
  SlidersHorizontal,
  SquareParking,
  TriangleAlert,
  Wrench,
} from "lucide-react";

import { placeholderImage } from "@/shared/lib/media";

import type { Service } from "../model/types";

// TODO(content): draft copy for FMECC to confirm, trim or extend (planning/MASTER_PLAN.md §4.4).
// It describes the work in general terms only: no clients, product brands, cycle times,
// certifications or guarantees. "TODO(content): confirm" marks a specific capability claim FMECC
// must verify before launch. Name a product brand only once FMECC confirms its sources.
// Hero and showcase are placeholders whose alt text is the shot to supply (planning/MEDIA_PLAN.md §9).
// The gallery stays empty: it shows only for a service without a showcase.
export const hydraulicParkingBollards: Service = {
  slug: "hydraulic-parking-bollards",
  index: 4,
  name: "Hydraulic Parking Bollard Installation",
  shortName: "Hydraulic Parking Bollards",
  tagline: "Automatic hydraulic bollards for controlled vehicle access, from site assessment to after-care.",
  // TODO(content): confirm FMECC supplies the bollards as well as installing them.
  summary:
    "FMECC supplies and installs automatic hydraulic bollards for villas, residential compounds, commercial entrances and secure sites: civil works, hydraulic units, controls and safety features, with commissioning and maintenance after handover.",
  icon: SquareParking,
  hero: placeholderImage("Automatic bollards controlling a vehicle entrance, cool highlights", "16:9"),
  showcaseMedia: placeholderImage("Hydraulic bollard in the raised position, close detail", "4:5"),
  audiences: [
    "Villas and private residences",
    "Residential compounds",
    "Commercial and office entrances",
    "Hotels and car parks",
    "Government and institutional sites",
  ],
  scope: [
    {
      icon: ScanSearch,
      title: "Site assessment",
      description:
        "Traffic flow, ground conditions, drainage and existing services are checked to choose the bollard positions and type.",
    },
    {
      icon: Shovel,
      title: "Civil works",
      description:
        "Excavation, foundation housings, drainage and ducts for power and control cables, finished to match the surrounding paving.",
    },
    {
      icon: ArrowUpFromLine,
      title: "Bollards and hydraulic units",
      description:
        "Supply and installation of automatic bollards and their hydraulic power units, set to the agreed height and level.",
    },
    {
      icon: SlidersHorizontal,
      title: "Controls and access methods",
      // TODO(content): confirm the access methods FMECC supplies and integrates.
      description:
        "Control panels and access methods such as push buttons, remote controls, card readers or a link to an existing access-control system.",
    },
    {
      icon: TriangleAlert,
      title: "Safety features",
      // TODO(content): confirm the safety options available with the products FMECC supplies.
      description:
        "Options such as vehicle detection loops, warning lights and signage, so a bollard stays down while a vehicle is over it and is visible to drivers.",
    },
    {
      icon: Wrench,
      title: "Commissioning and maintenance",
      description:
        "Testing of every cycle and safety function, handover to the users, and scheduled maintenance of the hydraulic and control systems.",
    },
  ],
  process: [
    {
      title: "Assessment",
      description:
        "We visit the site, review vehicle access and ground conditions, and agree how the entrance should be controlled.",
    },
    {
      title: "Specification",
      description:
        "The bollard type, number, height, control method and safety features are specified and confirmed with you.",
    },
    {
      title: "Civil works",
      description: "Foundation housings, drainage and cable ducts are installed, and the surface is reinstated.",
    },
    {
      title: "Installation",
      description: "Bollards, hydraulic units and controls are installed, connected and set level with the finished surface.",
    },
    {
      title: "Commissioning",
      description:
        "Rise and lower cycles, safety functions and access methods are tested, and users are shown how to operate the system.",
    },
    {
      title: "Maintenance",
      description:
        "Scheduled maintenance keeps the hydraulics, seals and controls in working order, with repairs when needed.",
    },
  ],
  // TODO(content): confirm the documents FMECC provides as standard.
  deliverables: [
    "Layout drawing and product specification",
    "Commissioning and test records",
    "Operating instructions",
    "Maintenance schedule",
  ],
  // TODO(content): confirm FMECC's maintenance offer for bollards.
  maintenance:
    "Hydraulic bollards need regular attention to hydraulic fluid, seals, drainage and control equipment. Visits follow the manufacturer's recommended intervals and the way the site is used, and their frequency is agreed in a service contract.",
  faq: [
    {
      question: "What is a hydraulic parking bollard?",
      answer:
        "A hydraulic bollard is a steel post set in a housing below the road surface. A hydraulic power unit raises it to block a lane and lowers it flush with the surface, so authorised vehicles can drive over it. Bollards are usually installed in a row across an entrance and operated from a control system, on their own or together with gates and barriers.",
    },
    {
      question: "How fast do the bollards rise and lower?",
      answer:
        "Rise and lower times depend on the model, its height and the hydraulic unit. The proposal gives the manufacturer's figures for the specified product, so you can match the speed to your traffic flow.",
    },
    {
      question: "What happens during a power failure?",
      // TODO(content): confirm the power-failure options of the products FMECC supplies.
      answer:
        "That depends on the product and how it is specified. Options typically include a manual lowering release and backup power for the controls. Whether the bollards should stay up or go down is agreed at the specification stage.",
    },
    {
      question: "How often do hydraulic bollards need maintenance?",
      answer:
        "Intervals depend on the product, the number of daily cycles and site conditions such as dust and drainage. We follow the manufacturer's recommendations and agree a visit frequency in the service contract.",
    },
    {
      question: "Is my site suitable for hydraulic bollards?",
      answer:
        "Suitability depends on ground conditions, drainage, underground services and traffic patterns. A site assessment confirms whether bollards suit the entrance and which civil works are needed, before you commit.",
    },
    {
      question: "What do you need to prepare a quotation?",
      answer:
        "The site location, the number of lanes or entrances to control, photographs of the entrance, how users should gain access and any security requirements. A site assessment confirms the final scope.",
    },
  ],
  gallery: [],
  showcase: "bollard",
  seo: {
    title: "Hydraulic Parking Bollard Installation",
    description:
      "Supply and installation of automatic hydraulic parking bollards by FMECC: site assessment, civil works, controls, safety features and maintenance.",
  },
};
