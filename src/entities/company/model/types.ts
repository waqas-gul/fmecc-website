import type { LucideIcon } from "lucide-react";

import type { ImageAsset } from "@/shared/types/media";

/** Company-level content shared by Home and About (planning/ARCHITECTURE.md §7). */
export interface CompanyContent {
  intro: string[];
  statement: string;
  values: { icon: LucideIcon; title: string; description: string }[];
  /** Shared delivery process shown on Home and About. */
  process: { title: string; description: string }[];
  /** Empty until FMECC supplies verified figures; the UI hides empty blocks. */
  stats: { value: string; label: string; note?: string }[];
  leadership: { name: string; role: string; photo?: ImageAsset }[];
  registrations: { title: string; issuer?: string }[];
}
