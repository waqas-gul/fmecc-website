// Concept drawing for the Home comparison slider (src/widgets/concept-comparison). Run with
// `node scripts/concept-drawing.mjs`, then `npm run images -- --media`.
//
// media-src/showcase/building-scene.png (the building scene's poster, a project-owned 3D render)
//   → media-src/showcase/building-concept.png: the same picture traced as cyan linework on a drafting
//     grid, pixel-aligned with the render, so the slider compares two views of one illustrative model.
// Repeat whenever the building poster is regenerated (media-src/showcase/README.md).

import path from "node:path";

import sharp from "sharp";

const root = process.cwd();
const SOURCE = path.join(root, "media-src", "showcase", "building-scene.png");
const OUTPUT = path.join(root, "media-src", "showcase", "building-concept.png");

// DESIGN.md §2.2 tokens: cyan-300 linework on navy-900, white grid lines at low opacity.
const LINE = "#7fe3ec";
const PAPER = "#0b1220";
const GRID = 40;
const MAJOR = 200;

const source = sharp(SOURCE).greyscale().blur(0.6);
const { width, height } = await sharp(SOURCE).metadata();

// Sobel gradients in both directions of both axes (convolution clamps negatives at 0), combined by
// their maximum, give every edge of the render once.
const kernels = [
  [-1, 0, 1, -2, 0, 2, -1, 0, 1],
  [1, 0, -1, 2, 0, -2, 1, 0, -1],
  [-1, -2, -1, 0, 0, 0, 1, 2, 1],
  [1, 2, 1, 0, 0, 0, -1, -2, -1],
];
const gradients = await Promise.all(
  kernels.map((kernel) => source.clone().convolve({ width: 3, height: 3, kernel }).raw().toBuffer({ resolveWithObject: true })),
);
const { channels } = gradients[0].info;
const edges = Buffer.alloc(width * height);
for (let i = 0; i < edges.length; i++) {
  let strongest = 0;
  for (const { data } of gradients) strongest = Math.max(strongest, data[i * channels]);
  // Soft threshold: faint glass gradients drop out, structural edges stay.
  edges[i] = Math.max(0, Math.min(255, (strongest - 14) * 3.2));
}

const alpha = await sharp(edges, { raw: { width, height, channels: 1 } }).png().toBuffer();
const linework = await sharp({ create: { width, height, channels: 3, background: LINE } }).joinChannel(alpha).png().toBuffer();

const rule = (x1, y1, x2, y2, major) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#fff" stroke-opacity="${major ? 0.07 : 0.035}"/>`;
const lines = [];
for (let x = 0; x <= width; x += GRID) lines.push(rule(x + 0.5, 0, x + 0.5, height, x % MAJOR === 0));
for (let y = 0; y <= height; y += GRID) lines.push(rule(0, y + 0.5, width, y + 0.5, y % MAJOR === 0));
const grid = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${lines.join("")}</svg>`);

await sharp({ create: { width, height, channels: 3, background: PAPER } })
  .composite([{ input: grid }, { input: linework }])
  .png()
  .toFile(OUTPUT);

console.log(`Wrote ${path.relative(root, OUTPUT)} (${width} × ${height}).`);
