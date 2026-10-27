import { buildingConstruction } from "../data/building-construction";
import { hydraulicParkingBollards } from "../data/hydraulic-parking-bollards";
import { securitySystems } from "../data/security-systems";
import { telecomTowerRollout } from "../data/telecom-tower-rollout";

import type { Service } from "./types";

/** The four services, ordered by `index`. */
export const services: readonly Service[] = [
  buildingConstruction,
  telecomTowerRollout,
  securitySystems,
  hydraulicParkingBollards,
].sort((a, b) => a.index - b.index);

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
