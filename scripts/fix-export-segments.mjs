// Post-build step for `output: 'export'` (run by `npm run build`).
//
// The client router prefetches each route segment from a flat file next to the page, such as
// /services/<slug>/__next.services.$d$slug.__PAGE__.txt. Next 16.4.3 builds those names from
// `path.relative()`, so on Windows the separators are backslashes, the "/" → "." replacement misses
// them, and the export writes nested folders (__next.services/$d$slug/__PAGE__.txt) that no request
// matches: every link to a nested route logs a 404 prefetch. This moves each nested file to the flat
// name the client asks for. Builds on Linux or macOS already write flat names, so nothing changes.

import { readdir, rename, rm } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "out");

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const full = path.join(directory, entry.name);
      return entry.isDirectory() ? filesUnder(full) : [full];
    }),
  );
  return nested.flat();
}

async function flatten(directory) {
  let moved = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(directory, entry.name);
    if (!entry.name.startsWith("__next")) {
      moved += await flatten(full);
      continue;
    }
    for (const file of await filesUnder(full)) {
      const flatName = path.relative(directory, file).split(path.sep).join(".");
      await rename(file, path.join(directory, flatName));
      moved += 1;
    }
    await rm(full, { recursive: true });
  }
  return moved;
}

const moved = await flatten(OUT_DIR);
if (moved > 0) console.log(`Static export: flattened ${moved} segment prefetch file${moved === 1 ? "" : "s"}.`);
