import { BellRing, Cctv, KeyRound, MonitorCog, Siren, Wrench } from "lucide-react";

import { placeholderImage } from "@/shared/lib/media";

import type { Service } from "../model/types";

// TODO(content): draft copy for FMECC to confirm, trim or extend (planning/MASTER_PLAN.md §4.3).
// It describes the work in general terms only: no clients, equipment brands, response times,
// certifications or guarantees. "TODO(content): confirm" marks a specific capability claim FMECC
// must verify before launch. Every image is a placeholder; its alt text is the shot to supply.
export const securitySystems: Service = {
  slug: "security-systems",
  index: 3,
  name: "Security System Installation and Maintenance",
  shortName: "Security Systems",
  tagline: "Integrated security systems, designed, installed and maintained as one service.",
  // TODO(content): confirm the system types and site types FMECC covers.
  summary:
    "FMECC designs, installs and maintains integrated security systems for residential, commercial and institutional sites: CCTV, access control, intrusion detection and intercoms, with preventive maintenance that keeps them working after handover.",
  icon: Cctv,
  hero: placeholderImage("Security control room with live camera views, cool night-time grade", "16:9"),
  showcaseMedia: placeholderImage("Security camera mounted on a building facade at dusk", "4:5"),
  audiences: [
    "Facility and property managers",
    "Residential compounds and villa communities",
    "Commercial, retail and office buildings",
    "Industrial sites and warehouses",
    "Public-sector and institutional buildings",
  ],
  scope: [
    {
      icon: Cctv,
      title: "CCTV surveillance",
      description:
        "Camera layouts planned around coverage and image quality, with recording, storage and remote viewing configured to the needs of the site.",
    },
    {
      icon: KeyRound,
      title: "Access control",
      description:
        "Card, PIN or credential-based access for doors, gates and barriers, with user management and event logs.",
    },
    {
      icon: Siren,
      title: "Intrusion detection and perimeter protection",
      description:
        "Alarm panels, door and motion sensors, and perimeter detection, zoned so that every alert shows where it was raised.",
    },
    {
      icon: BellRing,
      title: "Intercom and gate systems",
      description: "Audio and video intercoms linked to gates, doors and barriers, so visitors are identified before entry.",
    },
    {
      icon: MonitorCog,
      title: "Integration and control rooms",
      // TODO(content): confirm FMECC delivers system integration and control-room fit-out.
      description:
        "Security subsystems brought together on a common platform, with monitoring workstations and control-room layouts where required.",
    },
    {
      icon: Wrench,
      title: "Preventive maintenance",
      description:
        "Scheduled inspections, cleaning, firmware updates and functional tests, with corrective repairs under a service contract.",
    },
  ],
  process: [
    {
      title: "Assessment",
      description:
        "We review the site, the risks and any existing equipment, and agree what the system needs to protect and record.",
    },
    {
      title: "Design",
      description:
        "Device layouts, cable routes, storage and integration are specified, with drawings and an equipment schedule for approval.",
    },
    {
      title: "Installation",
      description:
        "Cabling, devices and control equipment are installed and labelled, with work sequenced around the site's operations.",
    },
    {
      title: "Commissioning",
      description:
        "Every device is tested and configured, operators are shown how to use the system, and as-built records are handed over.",
    },
    {
      title: "Maintenance plan",
      description:
        "A preventive maintenance schedule and support arrangements are agreed, so the system keeps performing after handover.",
    },
  ],
  // TODO(content): confirm the documents FMECC provides as standard.
  deliverables: [
    "Device layout drawings and equipment schedule",
    "Configuration and test records",
    "As-built drawings and cable schedules",
    "User guides and operator handover",
    "Preventive maintenance schedule",
  ],
  // TODO(content): confirm FMECC also maintains systems installed by others.
  maintenance:
    "Maintenance can be contracted for systems we install and, after a site survey, for existing systems. Visit frequency, response arrangements and reporting are agreed with you and written into the service contract.",
  faq: [
    {
      question: "What does a maintenance contract include?",
      answer:
        "A typical contract covers scheduled preventive visits, functional testing, cleaning and adjustment of devices, and corrective repairs. Visit frequency, response times and reporting are agreed with you and written into the contract.",
    },
    {
      question: "Can you integrate with our existing security systems?",
      answer:
        "It depends on the make, model and age of the existing equipment. We survey it first and confirm what can be connected, what needs upgrading and what should be replaced.",
    },
    {
      question: "Do the installations meet local regulations?",
      // TODO(content): confirm how FMECC handles regulatory and authority requirements.
      answer:
        "Systems are designed and installed to the applicable regulations, the authority requirements for the type of site and your own standards. Any approvals the system needs are identified at the design stage.",
    },
    {
      question: "Will installation disrupt our operations?",
      // TODO(content): confirm FMECC can phase work or work outside normal hours.
      answer:
        "Work is planned around your operations. In occupied buildings, installation can be phased by area or scheduled outside working hours, and existing systems stay live until the new ones are commissioned.",
    },
    {
      question: "What do you need to prepare a quotation?",
      answer:
        "The site location and type, floor plans or a site layout if available, the areas to cover and any existing equipment. A site survey is usually needed before a final price.",
    },
  ],
  gallery: [
    placeholderImage("Dome camera installed above a building entrance", "3:2"),
    placeholderImage("Technician testing an access-control reader beside a door", "3:2"),
    placeholderImage("Video intercom panel at a gated vehicle entrance", "3:2"),
  ],
  showcase: "coverage",
  seo: {
    title: "Security System Installation and Maintenance",
    description:
      "Security system installation and maintenance by FMECC: CCTV, access control, intrusion detection, intercoms and preventive maintenance contracts.",
  },
};
