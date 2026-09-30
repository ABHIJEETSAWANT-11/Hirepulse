// One-off script: make the HirePulse logo PNG backgrounds transparent.
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const files = [
  path.resolve("public/logos/hirepulse-wordmark.png"),
  path.resolve("public/logos/hirepulse-lockup.png"),
];

for (const file of files) {
  const img = sharp(file).ensureAlpha(); // guarantee 4 channels before raw
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

  // Flood-fill-like approach: any pixel that is "background-like" (bright and
  // connected to the border) becomes transparent. We do a simple BFS from the
  // border pixels so that bright pixels INSIDE letters (e.g. the counter of
  // 'e') are kept opaque.
  const { width, height, channels } = info; // channels is now 4
  if (channels !== 4) throw new Error(`expected 4 channels, got ${channels}`);
  const out = Buffer.from(data);
  const visited = new Uint8Array(width * height);
  const queue = [];

  const isLight = (i) => {
    const r = data[i * channels], g = data[i * channels + 1], b = data[i * channels + 2];
    return r > 235 && g > 235 && b > 235;
  };

  // seed queue with all border pixels that are light
  for (let x = 0; x < width; x++) {
    for (const y of [0, height - 1]) {
      const idx = y * width + x;
      if (!visited[idx] && isLight(idx)) { visited[idx] = 1; queue.push(idx); }
    }
  }
  for (let y = 0; y < height; y++) {
    for (const x of [0, width - 1]) {
      const idx = y * width + x;
      if (!visited[idx] && isLight(idx)) { visited[idx] = 1; queue.push(idx); }
    }
  }

  while (queue.length) {
    const idx = queue.pop();
    const x = idx % width, y = (idx / width) | 0;
    out[idx * channels + 3] = 0; // transparent
    for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const nIdx = ny * width + nx;
      if (!visited[nIdx] && isLight(nIdx)) { visited[nIdx] = 1; queue.push(nIdx); }
    }
  }

  await sharp(out, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(file + ".tmp.png");

  fs.renameSync(file + ".tmp.png", file);
  const mb = (fs.statSync(file).size / 1024).toFixed(0);
  console.log(`done: ${path.basename(file)} (${mb} KB)`);
}
