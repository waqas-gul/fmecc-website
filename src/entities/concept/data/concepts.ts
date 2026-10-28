import type { ImageAsset } from "@/shared/types/media";

import type { ProjectConcept } from "../model/types";

// TODO(content): ILLUSTRATIVE concepts for client preview, not FMECC projects. Each describes a
// hypothetical scope for one service, with no client, location, date or outcome; the scopes follow
// the draft service copy that FMECC still has to confirm (src/entities/service/data). Images are
// the licensed stock photography and 3D renders already used on the service pages (planning/
// MEDIA_PLAN.md) and are always labelled as illustrations. Home and /projects/ show them only while
// src/entities/project/data/projects.ts is empty. To retire them, delete src/app/projects/concepts/
// and src/entities/concept/, then the `concepts` uses in src/app/page.tsx and src/app/projects/page.tsx
// (static export fails if the concept route stays with an empty list).

/** Shown wherever concepts appear, so none of them can be read as a completed FMECC project. */
export const conceptNotice =
  "Illustrative concepts: hypothetical scopes shown with licensed stock photography and 3D illustrations. They are not completed FMECC projects.";

const image = (src: ImageAsset["src"], width: number, height: number, alt: string): ImageAsset => ({ src, width, height, alt });

const buildingHero = image(
  "/images/services/building-construction/hero-concrete-frame-low-angle.webp",
  1920,
  1080,
  "Concrete frame of a multi-storey building under construction, seen from below against a clear sky",
);
const telecomHero = image(
  "/images/services/telecom-tower-rollout/hero-tower-from-base.webp",
  1920,
  1080,
  "Lattice telecom tower with panel antennas and a microwave dish, seen from the base against a blue sky",
);
const securityHero = image(
  "/images/services/security-systems/hero-cameras-on-pole-at-night.webp",
  1920,
  1080,
  "Two CCTV cameras mounted on a pole against a dark night sky",
);
const bollardHero = image(
  "/images/services/hydraulic-parking-bollards/hero-bollard-cutaway-illustration.webp",
  1600,
  900,
  "Illustration of three raised hydraulic bollards in paving, cut away to show their below-ground housings and hydraulic rams",
);

export const conceptData: ProjectConcept[] = [
  {
    slug: "commercial-building-development",
    title: "Commercial Building Development",
    service: "building-construction",
    summary: "A mid-rise commercial building taken from foundations to handover under one contractor.",
    overview: [
      "This concept outlines a typical commercial building scope: a reinforced-concrete frame, the building envelope, coordinated mechanical, electrical and plumbing services, and finishes, delivered to one programme from mobilisation to handover.",
      "Inspections at each stage and a complete handover file are part of the scope, so the owner receives the records needed to operate and maintain the building.",
    ],
    scope: [
      "Excavation, foundations and reinforced-concrete frame",
      "Blockwork, façade and roofing",
      "Coordinated mechanical, electrical and plumbing works",
      "Internal finishes and fit-out",
      "Stage inspections and test records",
      "As-built drawings and handover documentation",
    ],
    hero: buildingHero,
    gallery: [
      image(
        "/images/services/building-construction/showcase-concrete-frame-portrait.webp",
        1600,
        2000,
        "Reinforced-concrete frame of a building under construction against a cloudy sky",
      ),
      image(
        "/images/showcase/building-scene.webp",
        1600,
        2000,
        "Illustration of a mid-rise building with a two-storey podium and a glazed eight-storey tower, beside a tower crane.",
      ),
    ],
  },
  {
    slug: "telecom-tower-site-rollout",
    title: "Telecom Tower Site Rollout",
    service: "telecom-tower-rollout",
    summary: "A lattice-tower site built from survey and foundations to erection and acceptance.",
    overview: [
      "This concept follows one telecom site through a typical build sequence: survey, civil foundations, tower erection, power and earthing, then acceptance testing and documentation.",
      "Work at height is planned with fall protection and a rescue plan, and each stage is inspected before the next begins, so the site is ready for equipment installation and handover.",
    ],
    scope: [
      "Site survey, measurements and access checks",
      "Tower foundations, equipment plinths and cable trenches",
      "Lattice tower assembly and erection",
      "Power connection, earthing and lightning protection",
      "Support for antenna and equipment installation",
      "Acceptance testing and as-built records",
    ],
    hero: telecomHero,
    gallery: [
      image(
        "/images/services/telecom-tower-rollout/showcase-crew-on-tower.webp",
        1600,
        2000,
        "Two technicians in helmets and harnesses working among the antennas of a lattice telecom tower",
      ),
      image(
        "/images/showcase/tower-scene.webp",
        1600,
        2000,
        "Illustration of a four-legged lattice telecom tower inside a fenced compound, with an equipment shelter, panel antennas on a top platform and two microwave dishes.",
      ),
    ],
  },
  {
    slug: "commercial-cctv-access-control",
    title: "Commercial CCTV & Access Control",
    service: "security-systems",
    summary: "Surveillance and access control for a commercial building, from coverage design to commissioning.",
    overview: [
      "This concept shows how CCTV and access control could be planned together for an office or retail building: camera positions chosen for coverage, controlled doors and barriers, and monitoring from one point.",
      "Commissioning, operator handover and a preventive maintenance plan complete the scope, so the system keeps performing after handover.",
    ],
    scope: [
      "Site risk review and camera coverage design",
      "CCTV cameras, recording and remote viewing",
      "Card access for doors, gates and barriers",
      "Monitoring from a single control point",
      "Testing, commissioning and operator handover",
      "Preventive maintenance schedule",
    ],
    hero: securityHero,
    gallery: [
      image(
        "/images/services/security-systems/showcase-camera-outside-glass-building.webp",
        1600,
        2000,
        "CCTV camera on a pole in front of a dark glass office building",
      ),
    ],
  },
  {
    slug: "smart-hydraulic-bollard-installation",
    title: "Smart Hydraulic Bollard Installation",
    service: "hydraulic-parking-bollards",
    summary: "Automatic hydraulic bollards controlling a vehicle entrance, linked to access control.",
    overview: [
      "This concept shows a row of automatic hydraulic bollards at a vehicle entrance. The bollards rise to block the lane and lower flush with the paving for authorised vehicles, operated through the site's access control.",
      "Vehicle detection and warning lights keep a bollard down while a vehicle is over it and make the row visible to drivers; commissioning and scheduled maintenance follow installation.",
    ],
    scope: [
      "Site assessment of traffic, ground and drainage",
      "Civil works: housings, drainage and cable ducts",
      "Automatic hydraulic bollards and power units",
      "Control panel linked to access control",
      "Vehicle detection loops and warning lights",
      "Commissioning, user training and maintenance plan",
    ],
    hero: bollardHero,
    // The only bollard visual is the 3D render already used as the hero; the service page has the interactive model.
    gallery: [],
  },
];
