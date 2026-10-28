import { ClipboardCheck, DraftingCompass, HardHat, Workflow } from "lucide-react";

import type { CompanyContent } from "../model/types";

// TODO(content): FMECC supplies the company description, values and process wording
// (planning/MASTER_PLAN.md §13). The drafts below describe the four services and generic
// principles only; they contain no figures, clients, certifications or history. The process is
// also restated in the Home hero lede and in the Home and Services process introductions.
export const company: CompanyContent = {
  statement: "One partner for buildings, telecom sites, security systems and access control.",
  intro: [
    "Future Middle East Construction Company (FMECC) works across four disciplines: building construction, telecom tower rollout and site construction, security system installation and maintenance, and hydraulic parking bollard installation.",
  ],
  // Draft "Why FMECC" positioning, covered by the TODO above: each value describes an intended way
  // of working, not a certification, track record, statistic or guarantee.
  values: [
    {
      icon: HardHat,
      title: "Safety-focused approach",
      description: "Work is planned around safe access, supervision and site discipline, with risks reviewed before each stage starts.",
    },
    {
      icon: ClipboardCheck,
      title: "Quality-minded execution",
      description: "Each stage is inspected and recorded before the next begins, against the agreed drawings and specifications.",
    },
    {
      icon: Workflow,
      title: "Coordinated delivery",
      description: "Programme, trades and suppliers are planned together, and progress is reported openly against the schedule.",
    },
    {
      icon: DraftingCompass,
      title: "Engineering and infrastructure focus",
      description: "Buildings, telecom sites, security systems and access control: technical work handled by one contractor.",
    },
  ],
  process: [
    { title: "Consult", description: "Understand the site, the scope and the constraints." },
    { title: "Plan", description: "Agree the design, approvals, programme and resources." },
    { title: "Mobilise", description: "Prepare the site, the teams and the materials." },
    { title: "Build", description: "Deliver the works with inspections at every stage." },
    { title: "Hand over", description: "Commission, document and support after completion." },
  ],
  stats: [],
  leadership: [],
  registrations: [],
};
