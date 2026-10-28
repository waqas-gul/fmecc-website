import { ClipboardCheck, PlugZap, RadioTower, ScanSearch, Shovel, Zap } from "lucide-react";

import { placeholderImage } from "@/shared/lib/media";

import type { Service } from "../model/types";

// TODO(content): draft copy for FMECC to confirm, trim or extend (planning/MASTER_PLAN.md §4.2).
// It describes the work in general terms only: no clients, operators, site counts, brands,
// certifications or guarantees. "TODO(content): confirm" marks a specific capability claim FMECC
// must verify before launch. Hero and showcase are licensed stock photography, illustrative only
// and never presented as FMECC work (planning/MEDIA_PLAN.md); gallery images are placeholders
// whose alt text is the shot to supply.
export const telecomTowerRollout: Service = {
  slug: "telecom-tower-rollout",
  index: 2,
  name: "Telecom Tower Rollout and Site Construction",
  shortName: "Telecom Tower Rollout",
  tagline: "Turnkey telecom site construction, from survey and foundations to tower erection and acceptance.",
  // TODO(content): confirm FMECC builds both greenfield and rooftop sites.
  summary:
    "FMECC builds greenfield and rooftop telecom sites for network operators, tower companies and rollout contractors: surveys, civil foundations, tower erection, power and earthing, with installation support through to site acceptance.",
  icon: RadioTower,
  hero: {
    src: "/images/services/telecom-tower-rollout/hero-tower-from-base.webp",
    width: 1920,
    height: 1080,
    alt: "Lattice telecom tower with panel antennas and a microwave dish, seen from the base against a blue sky",
  },
  showcaseMedia: {
    src: "/images/services/telecom-tower-rollout/showcase-crew-on-tower.webp",
    width: 1600,
    height: 2000,
    alt: "Two technicians in helmets and harnesses working among the antennas of a lattice telecom tower",
  },
  audiences: [
    "Mobile network operators",
    "Tower companies and infrastructure owners",
    "Equipment vendors and turnkey rollout contractors",
    "Consultants managing network deployment programmes",
  ],
  scope: [
    {
      icon: ScanSearch,
      title: "Site survey",
      description:
        "Site walks, measurements, photographs and access checks that feed the design, the permit application and the build plan.",
    },
    {
      icon: Shovel,
      title: "Civil foundations",
      description:
        "Excavation, reinforcement and concrete for tower foundations, equipment plinths and cable trenches, with fencing and site access.",
    },
    {
      icon: RadioTower,
      title: "Tower erection",
      // TODO(content): confirm the structure types FMECC erects (lattice, monopole, rooftop).
      description:
        "Assembly and erection of lattice towers and monopoles, and installation of rooftop support structures, to the approved design.",
    },
    {
      icon: PlugZap,
      title: "Shelters and power",
      description: "Equipment shelters or outdoor cabinet bases, power supply connections, cable trays and cable ladders.",
    },
    {
      icon: Zap,
      title: "Earthing and lightning protection",
      description: "Earthing systems, lightning protection and equipment bonding, tested and recorded for acceptance.",
    },
    {
      icon: ClipboardCheck,
      title: "Installation support and acceptance",
      // TODO(content): confirm the extent of FMECC's equipment installation support.
      description:
        "Support for antenna and equipment installation, punch-list closure, acceptance testing and as-built documentation.",
    },
  ],
  process: [
    {
      title: "Survey",
      description:
        "We survey the site and record dimensions, access, power availability and constraints for the design team.",
    },
    {
      title: "Design and approvals",
      description:
        "Drawings are prepared or checked against the survey, and permits and landlord consents are obtained with the client.",
    },
    {
      title: "Civil works",
      description: "Foundations, plinths, trenches and fencing are built and inspected before the steel arrives on site.",
    },
    {
      title: "Erection",
      // TODO(content): confirm FMECC's lifting and rescue planning for tower erection.
      description:
        "The tower or rooftop structure is assembled and erected by a rigging team working to a lifting and rescue plan.",
    },
    {
      title: "Installation",
      description:
        "Power, earthing, cable routes and shelters or cabinets are installed, and equipment installation is supported.",
    },
    {
      title: "Acceptance",
      description: "The site is tested, punch items are closed and the acceptance documentation is handed to the client.",
    },
  ],
  // TODO(content): confirm the documents FMECC provides as standard.
  deliverables: [
    "Site survey report and photographs",
    "Inspection and test records",
    "Earthing test results",
    "As-built drawings",
    "Acceptance documentation",
  ],
  faq: [
    {
      question: "How many sites can you build at the same time?",
      answer:
        "Capacity depends on the site types, the locations and the rollout programme. We agree the number of parallel teams and the targets with you when the rollout plan is set, and confirm them in the proposal.",
    },
    {
      question: "Which HSE standards do your teams follow?",
      // TODO(content): confirm FMECC's HSE arrangements; name a standard only if FMECC holds it.
      answer:
        "Work follows the applicable local regulations and the HSE requirements of the operator or tower company. Each site has a risk assessment and method statement, and work starts only after a site induction.",
    },
    {
      question: "How is working at height managed?",
      // TODO(content): confirm FMECC's working-at-height procedures.
      answer:
        "Climbing and rigging are planned in advance, with inspected fall-protection equipment, a rescue plan and a supervisor on site. Work at height stops when weather conditions such as high wind make it unsafe.",
    },
    {
      question: "Can you deliver a multi-site programme?",
      // TODO(content): confirm FMECC delivers multi-site rollouts.
      answer:
        "Multi-site rollouts are planned and tracked site by site, with regular status reporting against the rollout plan, so the progress of every site from survey to acceptance is visible.",
    },
    {
      question: "What do you need to prepare a quotation?",
      answer:
        "The site list or locations, the tower or structure types, the status of the design and the scope you want us to cover, from civil works only to a turnkey build.",
    },
  ],
  gallery: [
    placeholderImage("Rigging crew in fall-protection harnesses erecting a tower section", "3:2"),
    placeholderImage("Telecom tower foundation with reinforcement before the concrete pour", "3:2"),
    placeholderImage("Completed telecom site with equipment cabinets and perimeter fencing", "3:2"),
  ],
  showcase: "tower",
  seo: {
    title: "Telecom Tower Rollout and Site Construction",
    description:
      "Telecom tower rollout and site construction by FMECC: surveys, civil foundations, tower erection, power, earthing and acceptance for network operators.",
  },
};
