import { CalendarCheck, ClipboardCheck, HardHat, ShieldCheck } from "lucide-react";

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
  values: [
    { icon: HardHat, title: "Safety", description: "Work is planned around safe access, supervision and site discipline." },
    { icon: ClipboardCheck, title: "Quality", description: "Each stage is inspected and documented before the next begins." },
    { icon: CalendarCheck, title: "Schedule", description: "Programmes are planned, tracked and reported openly." },
    { icon: ShieldCheck, title: "Compliance", description: "Work follows the applicable codes, permits and client standards." },
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
