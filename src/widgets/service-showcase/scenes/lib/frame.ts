/**
 * Soft edge fade for the transparent canvas, so the floor's light pool and grid never end in a
 * hard line at the frame edge. The posters are captured through the same mask, so a poster and
 * its live scene match in any container.
 */
export const SCENE_FRAME_MASK =
  "[mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent),linear-gradient(to_bottom,#000_78%,transparent)] [mask-composite:intersect]";
