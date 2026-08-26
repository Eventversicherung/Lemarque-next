#!/usr/bin/env node
// Generates small, dependency-free PNG placeholder images for the MALUM demo
// collection (see lib/collections.ts / lib/products.ts).
//
// These are intentionally plain, minimal placeholder graphics (a vertical
// gradient) - not real product photography. They exist purely so the new
// "Shop the Collection" experience can be demoed and tested end-to-end
// before the real MALUM photography is dropped into
// public/collections/malum/.
//
// Run with: node scripts/generate-placeholder-images.mjs

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync, crc32 } from "node:zlib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "public", "collections", "malum");

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBuf, data]);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body) >>> 0, 0);
  return Buffer.concat([len, body, crc]);
}

/**
 * Builds a minimal valid PNG (8-bit RGB, no filtering) containing a soft
 * vertical gradient between `topColor` and `bottomColor`.
 */
function makeGradientPng(width, height, topColor, bottomColor) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type: RGB
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = chunk("IHDR", ihdrData);

  const stride = width * 3;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    const t = height === 1 ? 0 : y / (height - 1);
    const r = Math.round(topColor[0] + (bottomColor[0] - topColor[0]) * t);
    const g = Math.round(topColor[1] + (bottomColor[1] - topColor[1]) * t);
    const b = Math.round(topColor[2] + (bottomColor[2] - topColor[2]) * t);
    const rowStart = y * (stride + 1);
    raw[rowStart] = 0; // filter type: none
    for (let x = 0; x < width; x++) {
      const p = rowStart + 1 + x * 3;
      raw[p] = r;
      raw[p + 1] = g;
      raw[p + 2] = b;
    }
  }

  const idat = chunk("IDAT", deflateSync(raw, { level: 9 }));
  const iend = chunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

mkdirSync(join(ROOT, "pieces"), { recursive: true });

// Moody, editorial dark tones for full outfit / "look" photography.
const lookTones = [
  { top: [26, 24, 22], bottom: [10, 9, 8] },
  { top: [30, 27, 23], bottom: [12, 11, 10] },
  { top: [24, 23, 26], bottom: [9, 9, 11] },
];

// Cleaner, lighter neutral tones for isolated product/piece shots.
const pieceTones = [
  { top: [214, 210, 203], bottom: [188, 183, 174] },
  { top: [220, 217, 212], bottom: [196, 192, 185] },
  { top: [208, 205, 200], bottom: [182, 178, 172] },
];

const files = [];

files.push([
  "hero.png",
  makeGradientPng(1600, 1067, lookTones[0].top, lookTones[0].bottom),
]);

lookTones.forEach((tone, i) => {
  files.push([
    `look-${i + 1}.png`,
    makeGradientPng(1600, 1067, tone.top, tone.bottom),
  ]);
});

for (let look = 1; look <= 3; look++) {
  for (let piece = 1; piece <= 3; piece++) {
    const tone = pieceTones[(piece - 1) % pieceTones.length];
    files.push([
      `pieces/malum-look-${look}-piece-${piece}.png`,
      makeGradientPng(1200, 1500, tone.top, tone.bottom),
    ]);
  }
}

for (const [name, buffer] of files) {
  writeFileSync(join(ROOT, name), buffer);
  console.log(`wrote public/collections/malum/${name} (${buffer.length} bytes)`);
}
