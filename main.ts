// SPDX-License-Identifier: MIT
// ERRANTA — travel poster entry for make.fun bounty
// the-poster-for-a-place-that-i-2-20261121-0539
//
// Copies the poster image (entry.png, 1024x1024) to /output/entry.png.
// Node 22, standard library only. No network access. Deterministic:
// the output is a byte-for-byte copy of the source image.

import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1_048_576;

const repoRoot = dirname(fileURLToPath(import.meta.url));
const source = join(repoRoot, "entry.png");
const destination = "/output/entry.png";

if (!existsSync(source)) {
  console.error(`error: source image not found: ${source}`);
  process.exit(1);
}

mkdirSync(dirname(destination), { recursive: true });
copyFileSync(source, destination);

// Post-copy checks: the output must be a byte-for-byte copy of the
// source and must stay within the bounty size limit.
const sourceSize = statSync(source).size;
const size = statSync(destination).size;
if (size !== sourceSize) {
  console.error(
    `error: copied size ${size} does not match source size ${sourceSize}`,
  );
  process.exit(1);
}
if (size > MAX_BYTES) {
  console.error(
    `error: output is ${size} bytes, over the ${MAX_BYTES} byte limit`,
  );
  process.exit(1);
}
console.log(`wrote ${destination} (${size} bytes)`);
