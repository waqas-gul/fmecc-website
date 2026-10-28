import { Building, Cable, ClipboardCheck, FileCheck, HardHat, Layers, PaintRoller } from "lucide-react";

import type { Service } from "../model/types";

// TODO(content): draft copy for FMECC to confirm, trim or extend (planning/MASTER_PLAN.md §4.1).
// It describes the work in general terms only: no clients, projects, figures, brands,
// certifications or guarantees. "TODO(content): confirm" marks a specific capability claim FMECC
// must verify before launch. Hero and showcase are licensed stock photography, illustrative only
// and never presented as FMECC work (planning/MEDIA_PLAN.md). The gallery stays empty: it shows
// only for a service without a showcase, and the shots wanted are listed in MEDIA_PLAN.md §6.
export const buildingConstruction: Service = {
  slug: "building-construction",
  index: 1,
  name: "Building Construction",
  shortName: "Building Construction",
  // TODO(content): confirm the building segments FMECC works in (residential, commercial, industrial).
  tagline: "Residential, commercial and industrial buildings, delivered from foundations to handover.",
  // TODO(content): confirm FMECC acts as main contractor with its own site management team.
  summary:
    "FMECC takes building projects from foundations to handover as a single contractor: civil and structural works, coordinated MEP installation, and finishing and fit-out, with one site team responsible for programme, safety and quality.",
  icon: Building,
  hero: {
    src: "/images/services/building-construction/hero-concrete-frame-low-angle.webp",
    width: 1920,
    height: 1080,
    alt: "Concrete frame of a multi-storey building under construction, seen from below against a clear sky",
  },
  showcaseMedia: {
    src: "/images/services/building-construction/showcase-concrete-frame-portrait.webp",
    width: 1600,
    height: 2000,
    alt: "Reinforced-concrete frame of a building under construction against a cloudy sky",
  },
  audiences: [
    "Property developers and investors",
    "Private owners building villas and residential blocks",
    "Commercial, retail and office operators",
    "Industrial, warehouse and logistics facilities",
    "Consultants and project managers appointing a main contractor",
  ],
  scope: [
    {
      icon: Layers,
      title: "Civil and structural works",
      description:
        "Excavation, foundations, reinforced-concrete frames and masonry, built to the approved structural design.",
    },
    {
      icon: Cable,
      title: "MEP coordination",
      description:
        "Mechanical, electrical and plumbing works planned with the structure and finishes, so services go in the right sequence and are tested before they are closed in.",
    },
    {
      icon: PaintRoller,
      title: "Finishing and fit-out",
      description:
        "Internal and external finishes, doors, joinery and fit-out to the specified standard, with samples agreed before installation.",
    },
    {
      icon: HardHat,
      title: "Site management",
      description:
        "Supervision, subcontractor coordination, health and safety management, programme tracking and regular progress reporting.",
    },
    {
      icon: ClipboardCheck,
      title: "Quality assurance and control",
      description:
        "Inspection and test plans, material submittals and stage inspections, recorded so that every element can be traced.",
    },
    {
      icon: FileCheck,
      title: "Handover documentation",
      description:
        "As-built drawings, test and commissioning records, and operation and maintenance manuals compiled for handover.",
    },
  ],
  process: [
    {
      title: "Consult",
      description:
        "We review the brief, drawings, site and budget, and set out the scope, the risks and the information still needed.",
    },
    {
      title: "Design coordination",
      description:
        "We work with your architect and engineers on buildability, approvals and the construction programme before work starts.",
    },
    {
      title: "Mobilise",
      description:
        "The site is set up with hoarding, welfare facilities and safety controls, and the teams and long-lead materials are booked.",
    },
    {
      title: "Build",
      description:
        "Structure, envelope, MEP and finishes proceed to the programme, with inspections and progress reports at each stage.",
    },
    {
      title: "Commission",
      description: "Building services are tested and commissioned, and snag items are recorded and closed out.",
    },
    {
      title: "Hand over",
      description:
        "The completed building is handed over with as-built drawings, test records and operation and maintenance manuals.",
    },
  ],
  // TODO(content): confirm the documents FMECC provides as standard.
  deliverables: [
    "Construction programme and progress reports",
    "Method statements and risk assessments",
    "Inspection and test records",
    "As-built drawings",
    "Operation and maintenance manuals",
  ],
  faq: [
    {
      question: "How long does a building project take?",
      // TODO(content): confirm a programme is issued with the quotation.
      answer:
        "Duration depends on the size and complexity of the building, the status of the design, approvals and site conditions. We prepare a construction programme with the quotation and update it as the design is finalised, so the timeline is agreed before work starts.",
    },
    {
      question: "Who obtains the permits and approvals?",
      answer:
        "Responsibility for each permit and approval is set out in the contract. We coordinate with your consultant on the submissions and inspections that relate to our scope, and keep approval dates visible in the programme.",
    },
    {
      question: "How are subcontractors managed?",
      // TODO(content): confirm how FMECC manages specialist subcontractors.
      answer:
        "Specialist trades work under our site management, to the same programme, method statements and inspection plan as our own teams. Their work is inspected and recorded before it is accepted.",
    },
    {
      question: "How is safety managed on site?",
      // TODO(content): confirm FMECC's site safety arrangements.
      answer:
        "Each site has a safety plan covering access, working at height, lifting, excavations and housekeeping. Work starts with inductions and risk assessments, and the site team checks the controls as the work progresses.",
    },
    {
      question: "What do you need to prepare a quotation?",
      answer:
        "Drawings or a design brief, the site location, the scope you want us to cover and your target dates. If the design is still developing, we can start with a budget estimate and refine it as the drawings progress.",
    },
  ],
  gallery: [],
  showcase: "building",
  seo: {
    title: "Building Construction Services",
    description:
      "Building construction by FMECC: civil and structural works, MEP coordination, finishing and handover for residential, commercial and industrial projects.",
  },
};
