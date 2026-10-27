import { useSyncExternalStore } from "react";

import { getDeviceTier, type DeviceTier } from "@/shared/lib/utils";

const subscribe = () => () => {};

/** Device capability tier; prerendered HTML assumes `low` so nothing heavy is promised up front. */
export function useDeviceTier(): DeviceTier {
  return useSyncExternalStore(subscribe, getDeviceTier, () => "low");
}
