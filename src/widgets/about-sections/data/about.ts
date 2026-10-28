import { ClipboardCheck, HardHat } from "lucide-react";

// TODO(content): About-page drafts for FMECC to confirm, rewrite or remove before launch. They describe
// ways of working in general terms only: no history, figures, clients, people or certifications
// (planning/MASTER_PLAN.md §3). The company description, values and process come from
// src/entities/company (shown on About by the shared ValuesSection and ProcessSection widgets);
// leadership and registrations render only once supplied there.
export const aboutContent = {
  story: {
    eyebrow: "Who we are",
    paragraphs: [
      "Every project follows the same way of working, whatever the discipline: understand the site and the requirement, plan the works and the approvals, build with inspections at each stage, and hand over with the documentation the client needs.",
    ],
    statsLabel: "FMECC in figures",
    missionLabel: "Our mission",
    mission:
      "To deliver buildings, telecom sites, security systems and access control that are safe, built to specification and handed over on programme.",
  },
  services: {
    eyebrow: "What we do",
    title: "Four service areas.",
    lede: "Each service has its own scope and process. All four are planned, built and handed over to the same standards of safety, quality and documentation.",
  },
  standards: {
    eyebrow: "Quality and safety",
    title: "How we protect quality and safety.",
    lede: "Principles that apply on every site, from a single bollard installation to a multi-storey building.",
    groups: [
      {
        icon: ClipboardCheck,
        title: "Quality",
        items: [
          {
            title: "Agreed before work starts",
            description: "Specifications, methods and acceptance criteria are confirmed with the client before work begins.",
          },
          {
            title: "Checked at every stage",
            description: "Work is inspected against the agreed specification before the next stage is built on top of it.",
          },
          {
            title: "Tested before handover",
            description: "Systems and equipment are tested and commissioned before they are handed over, not after.",
          },
          {
            title: "Documented handover",
            description: "Handover includes the records, test results and maintenance guidance needed to operate what was delivered.",
          },
        ],
      },
      {
        icon: HardHat,
        title: "Safety",
        items: [
          {
            title: "Planned before it starts",
            description: "Each activity is assessed for risk, and its controls are agreed before work begins.",
          },
          {
            title: "Supervised teams",
            description: "Work is carried out by trained teams under competent site supervision.",
          },
          {
            title: "Height, lifting and access",
            description: "Tower erection, structural work and lifting follow controlled procedures with inspected equipment.",
          },
          {
            title: "Authority to stop",
            description: "Anyone on site can stop work that looks unsafe.",
          },
        ],
      },
    ],
  },
  team: { eyebrow: "Leadership", title: "The people accountable for delivery." },
  registrations: { eyebrow: "Registrations", title: "Registrations and certifications." },
} as const;
