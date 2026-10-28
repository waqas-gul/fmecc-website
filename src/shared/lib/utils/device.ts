export type DeviceTier = "low" | "mid" | "high";

interface NavigatorHints {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
}

/**
 * Coarse capability tier for gating video and 3D (planning/DESIGN.md §11).
 * `low`: ≤ 4 logical cores, ≤ 4 GB memory, Save-Data or a 2G/3G connection.
 */
export function getDeviceTier(): DeviceTier {
  if (typeof navigator === "undefined") return "low";
  const nav = navigator as Navigator & NavigatorHints;
  const cores = nav.hardwareConcurrency || 4;
  const memory = nav.deviceMemory ?? 8;
  const slowNetwork = /(^|-)2g$|^3g$/.test(nav.connection?.effectiveType ?? "");
  if (nav.connection?.saveData || slowNetwork || cores <= 4 || memory <= 4) return "low";
  return cores >= 8 && memory >= 8 ? "high" : "mid";
}

/** True when the visitor has asked to save data (Save-Data). Call only in the browser. */
export function savesData(): boolean {
  return (navigator as Navigator & NavigatorHints).connection?.saveData === true;
}

/** True when the browser can create a WebGL context. Call only in the browser. */
export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}
