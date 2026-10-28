"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { ServiceSlug } from "@/shared/config";
import type { Project } from "@/entities/project";

import { parseService, SERVICE_PARAM, type ServiceOption } from "../lib/filter";
import { ProjectFilterView } from "./ProjectFilterView";

/**
 * The active service lives in `?service=`, so deep links from service pages restore it. Writes go
 * through history.replaceState, which Next syncs into useSearchParams without a server round trip
 * and without adding a history entry per click.
 */
export function ProjectFilterClient({ projects, options }: { projects: Project[]; options: ServiceOption[] }) {
  const searchParams = useSearchParams();
  const active = parseService(searchParams.get(SERVICE_PARAM));
  const [animate, setAnimate] = useState(false);
  const allChipRef = useRef<HTMLButtonElement>(null);

  const select = (service: ServiceSlug | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (service) params.set(SERVICE_PARAM, service);
    else params.delete(SERVICE_PARAM);
    const query = params.toString();
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
    setAnimate(true);
  };

  // The empty state holding focus unmounts, so focus moves to the chip that is now pressed.
  const showAll = () => {
    select(null);
    allChipRef.current?.focus();
  };

  return (
    <ProjectFilterView
      projects={projects}
      options={options}
      active={active}
      animate={animate}
      onSelect={select}
      onShowAll={showAll}
      allChipRef={allChipRef}
    />
  );
}
