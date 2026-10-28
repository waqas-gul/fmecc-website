// Image pipeline (planning/ARCHITECTURE.md §11, DESIGN.md §12). Run with `npm run images`.
//
// 1. media-src/<section>/<name>.(jpg|jpeg|png|webp|tif|tiff)
//      → public/images/<section>/<name>.webp (largest width)
//      → public/images/<section>/<name>-<w>.webp for every width next/image can request.
//    Widths larger than the original are written at the original size (no enlargement), so every
//    srcset entry exists. Unchanged originals are skipped.
// 2. public/images/brand/logo.png, used exactly as supplied (only scaled, never redrawn)
//      → public/images/brand/logo-96.webp (header and footer: 2× the largest 48 px display height)
//      → src/app/icon.png (192 px), src/app/apple-icon.png (180 px), src/app/opengraph-image.png (+ .alt.txt)
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

async function logoOnWhite(width, height, maxWidth, maxHeight, extra = []) {
  const logo = await sharp(LOGO)
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
  await (await logoOnWhite(192, 192, 166, 166)).toFile(path.join(APP_DIR, "icon.png"));
  await (await logoOnWhite(180, 180, 156, 156)).toFile(path.join(APP_DIR, "apple-icon.png"));
  await (
    await logoOnWhite(1200, 630, 960, 440, [{ input: spectrumBar(1200, 8), top: 622, left: 0 }])
  ).toFile(path.join(APP_DIR, "opengraph-image.png"));
  await writeFile(path.join(APP_DIR, "opengraph-image.alt.txt"), BRAND_NAME);

  const manifest = { logo: { src: `/images/brand/logo-${LOGO_HEIGHT}.webp`, width: logo.width, height: logo.height } };
  await writeFile(BRAND_MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Brand: logo, icons and Open Graph image generated (logo ${logo.width}×${logo.height}).`);
}

const steps = process.argv.slice(2);
const runAll = !steps.includes("--media") && !steps.includes("--brand");
if (runAll || steps.includes("--media")) await optimizeMedia();
if (runAll || steps.includes("--brand")) await buildBrandAssets();
