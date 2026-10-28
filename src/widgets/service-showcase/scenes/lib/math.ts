export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** Local progress of `progress` inside the window [start, end], clamped to 0–1. */
export const span = (progress: number, start: number, end: number) => clamp01((progress - start) / (end - start));

/** Smoothstep easing: soft start and stop, the way hydraulic and crane motions read. */
export const ease = (t: number) => t * t * (3 - 2 * t);

export const easeOut = (t: number) => 1 - (1 - t) ** 3;

export const lerp = (from: number, to: number, t: number) => from + (to - from) * t;
