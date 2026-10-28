// Image pipeline (planning/ARCHITECTURE.md §11, DESIGN.md §12). Run with `npm run images`.
//
// 1. media-src/<section>/<name>.(jpg|jpeg|png|webp|tif|tiff)
//      → public/images/<section>/<name>.webp (largest width)
//      → public/images/<section>/<name>-<w>.webp for every width next/image can request.
//    Widths larger than the original are written at the original size (no enlargement), so every
//    srcset entry exists. Unchanged originals are skipped.
// 2. public/images/brand/logo.png, used exactly as supplied (only scaled or cropped, never redrawn)
//      → public/images/brand/logo-96.webp, transparency kept (header, menu and footer: 2× the
//        largest 48 px display height)
//      → src/app/icon.png (192 px), src/app/apple-icon.png (180 px): the diamond mark alone, cropped
//        from the lockup, because the wordmarks are unreadable at icon sizes; the full lockup if the
//        artwork is not laid out as mark above wordmarks
//      → src/app/opengraph-image.png (+ .alt.txt): the full lockup
//      → src/shared/config/brand-assets.json, read by the BrandLogo component.
//
// `npm run images` runs both steps; `npm run images -- --media` or `-- --brand` runs one of them.

import { existsSync } from "node:fs";
import { mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const root = process.cwd();
const SOURCE_DIR = path.join(root, "media-src");
const OUTPUT_DIR = path.join(root, "public", "images");
const WIDTHS = [320, 480, 640, 960, 1280, 1600, 1920]; // images.imageSizes + images.deviceSizes in next.config.ts
const QUALITY = 75;
const SOURCE_PATTERN = /\.(jpe?g|png|webp|tiff?)$/i;

const LOGO = path.join(root, "public", "images", "brand", "logo.png");
const LOGO_HEIGHT = 96;
const LOGO_OUTPUT = path.join(root, "public", "images", "brand", `logo-${LOGO_HEIGHT}.webp`);
const APP_DIR = path.join(root, "src", "app");
const BRAND_MANIFEST = path.join(root, "src", "shared", "config", "brand-assets.json");
const BRAND_NAME = "Future Middle East Construction Company";

async function* walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (SOURCE_PATTERN.test(entry.name)) yield full;
  }
}

async function isFresh(outputs, sourceTime) {
  for (const output of outputs) {
    if (!existsSync(output) || (await stat(output)).mtimeMs < sourceTime) return false;
  }
  return true;
}

async function optimizeMedia() {
  if (!existsSync(SOURCE_DIR)) {
    console.log("media-src/ not found: no content images to process.");
    return;
  }

  let written = 0;
  let skipped = 0;
  for await (const file of walk(SOURCE_DIR)) {
    const relative = path.relative(SOURCE_DIR, file);
    const { dir, name } = path.parse(relative);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) console.warn(`  ! ${relative}: use kebab-case file names`);

    const base = path.join(OUTPUT_DIR, dir, name);
    const outputs = [`${base}.webp`, ...WIDTHS.map((width) => `${base}-${width}.webp`)];
    if (await isFresh(outputs, (await stat(file)).mtimeMs)) {
      skipped += 1;
      continue;
    }

    await mkdir(path.dirname(base), { recursive: true });
    const meta = await sharp(file).metadata();
    const rotated = (meta.orientation ?? 1) >= 5;
    const sourceWidth = rotated ? meta.height : meta.width;

    for (const width of WIDTHS) {
      await sharp(file)
        .rotate()
        .resize({ width: Math.min(width, sourceWidth) })
        .webp({ quality: QUALITY, effort: 5 })
        .toFile(`${base}-${width}.webp`);
    }
    const largest = await sharp(file)
      .rotate()
      .resize({ width: Math.min(WIDTHS.at(-1), sourceWidth) })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(`${base}.webp`);

    const src = `/images/${[dir, name].filter(Boolean).join("/").replaceAll("\\", "/")}.webp`;
    console.log(`  ✓ ${relative} → ${src} (width: ${largest.width}, height: ${largest.height})`);
    written += 1;
  }
  console.log(`Content images: ${written} processed, ${skipped} unchanged.`);
}

const spectrumBar = (width, height) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
      `<defs><linearGradient id="s"><stop offset="0" stop-color="#8B25E8"/><stop offset=".5" stop-color="#1246D8"/>` +
      `<stop offset="1" stop-color="#13C9D7"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#s)"/></svg>`,
  );

/**
 * Bounds of the diamond mark in the lockup: the first block of artwork rows, which must be followed
 * by a blank band and then further artwork (the English and Arabic wordmarks) and must be the tallest
 * part of it. Returns null when the artwork is laid out differently, so no wrong crop is ever made.
 */
async function markRegion() {
  // Flattened on white, so a transparent logo reads the same as one supplied on white.
  const { data, info } = await sharp(LOGO).flatten({ background: "#ffffff" }).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const runs = []; // consecutive rows that contain artwork (a pixel whose darkest channel is below 225)
  for (let y = 0; y < height; y++) {
    let minX = width;
    let maxX = -1;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      if (Math.min(data[i], data[i + 1], data[i + 2]) < 225) {
        minX = Math.min(minX, x);
        maxX = x;
      }
    }
    const last = runs.at(-1);
    if (maxX < 0) continue;
    if (last && last.bottom === y - 1) Object.assign(last, { bottom: y, minX: Math.min(last.minX, minX), maxX: Math.max(last.maxX, maxX) });
    else runs.push({ top: y, bottom: y, minX, maxX });
  }
  const [mark, ...rest] = runs;
  const tallest = Math.max(...runs.map((run) => run.bottom - run.top));
  if (!mark || rest.length === 0 || mark.bottom - mark.top !== tallest) return null;
  // A few pixels of margin around the artwork keep its anti-aliased edges.
  const pad = 4;
  const left = Math.max(0, mark.minX - pad);
  const top = Math.max(0, mark.top - pad);
  return { left, top, width: Math.min(width, mark.maxX + pad + 1) - left, height: Math.min(height, mark.bottom + pad + 1) - top };
}

async function logoOnWhite(width, height, maxWidth, maxHeight, extra = [], region = null) {
  const logo = await (region ? sharp(LOGO).extract(region) : sharp(LOGO))
    .resize({ width: maxWidth, height: maxHeight, fit: "inside", withoutEnlargement: true })
    .png()
    .toBuffer();
  // Palette PNGs are a third of the size of truecolour ones for this flat artwork.
  return sharp({ create: { width, height, channels: 3, background: "#ffffff" } })
    .composite([{ input: logo, gravity: "center" }, ...extra])
    .png({ palette: true, compressionLevel: 9 });
}

async function buildBrandAssets() {
  const generated = [
    LOGO_OUTPUT,
    path.join(APP_DIR, "icon.png"),
    path.join(APP_DIR, "apple-icon.png"),
    path.join(APP_DIR, "opengraph-image.png"),
    path.join(APP_DIR, "opengraph-image.alt.txt"),
  ];

  if (!existsSync(LOGO)) {
    await Promise.all(generated.map((file) => rm(file, { force: true })));
    await writeFile(BRAND_MANIFEST, `${JSON.stringify({ logo: null }, null, 2)}\n`);
    console.warn("Brand: public/images/brand/logo.png is missing. The site shows the temporary text logo.");
    return;
  }

  const logo = await sharp(LOGO)
    .resize({ height: LOGO_HEIGHT, withoutEnlargement: true })
    .webp({ nearLossless: true, quality: 60 })
    .toFile(LOGO_OUTPUT);
  const mark = await markRegion();
  if (!mark) console.warn("Brand: the mark could not be separated from the wordmarks; icons use the full lockup.");
  await (await logoOnWhite(192, 192, 172, 172, [], mark)).toFile(path.join(APP_DIR, "icon.png"));
  await (await logoOnWhite(180, 180, 152, 152, [], mark)).toFile(path.join(APP_DIR, "apple-icon.png"));
  await (
    await logoOnWhite(1200, 630, 960, 440, [{ input: spectrumBar(1200, 8), top: 622, left: 0 }])
  ).toFile(path.join(APP_DIR, "opengraph-image.png"));
  await writeFile(path.join(APP_DIR, "opengraph-image.alt.txt"), BRAND_NAME);

  const manifest = { logo: { src: `/images/brand/logo-${LOGO_HEIGHT}.webp`, width: logo.width, height: logo.height } };
  await writeFile(BRAND_MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(
    `Brand: logo, icons and Open Graph image generated (logo ${logo.width}×${logo.height}; ` +
      `icons from ${mark ? `the mark, ${mark.width}×${mark.height} at ${mark.left},${mark.top}` : "the full lockup"}).`,
  );
}

const steps = process.argv.slice(2);
const runAll = !steps.includes("--media") && !steps.includes("--brand");
if (runAll || steps.includes("--media")) await optimizeMedia();
if (runAll || steps.includes("--brand")) await buildBrandAssets();
