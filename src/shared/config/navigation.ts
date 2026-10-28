import type { Route } from "next";
import { Building, Cctv, RadioTower, SquareParking, type LucideIcon } from "lucide-react";

import { routes, type ServiceSlug } from "./routes";

export interface NavItem {
  label: string;
  href: Route;
  children?: { label: string; href: Route; description: string; icon: LucideIcon }[];
}

/** Navigation labels for the four services, in the approved order (MASTER_PLAN.md §4). */
export const serviceNav: readonly { slug: ServiceSlug; label: string; description: string; icon: LucideIcon }[] = [
  // TODO(content): two one-liners repeat facts FMECC must confirm: the building segments and whether
  // FMECC supplies the bollards. Keep them in step with src/entities/service/data.
  {
    slug: "building-construction",
    label: "Building Construction",
    description: "Residential, commercial and industrial buildings.",
    icon: Building,
  },
  {
    slug: "telecom-tower-rollout",
    label: "Telecom Tower Rollout",
    description: "Tower erection and site construction for telecom networks.",
    icon: RadioTower,
  },
  {
    slug: "security-systems",
    label: "Security Systems",
    description: "Installation and maintenance of integrated security systems.",
    icon: Cctv,
  },
  {
    slug: "hydraulic-parking-bollards",
    label: "Hydraulic Parking Bollards",
    description: "Supply and installation of automatic hydraulic bollards.",
    icon: SquareParking,
  },
];

export const mainNav: NavItem[] = [
  {
    label: "Services",
    href: routes.services,
    children: serviceNav.map(({ slug, label, description, icon }) => ({
      label,
      href: routes.service(slug),
      description,
      icon,
    })),
  },
  { label: "Projects", href: routes.projects },
  { label: "About", href: routes.about },
  { label: "Contact", href: routes.contact },
];

export const footerNav: { heading: string; items: { label: string; href: Route }[] }[] = [
  { heading: "Services", items: serviceNav.map(({ slug, label }) => ({ label, href: routes.service(slug) })) },
  {
    heading: "Company",
    items: [
      { label: "About", href: routes.about },
      { label: "Projects", href: routes.projects },
      { label: "Contact", href: routes.contact },
    ],
  },
];
