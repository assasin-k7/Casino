const fs = require("fs");
const path = require("path");

const root = __dirname;
const outName = "all-files.json";
const outPath = path.join(root, outName);
const skipDirs = new Set(["node_modules"]);

function isBinary(buf) {
  const n = Math.min(buf.length, 8000);
  for (let i = 0; i < n; i++) {
    if (buf[i] === 0) return true;
  }
  return false;
}

function walk(dir, files) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) continue;
      walk(full, files);
      continue;
    }
    if (!entry.isFile()) continue;

    const rel = path.relative(root, full).split(path.sep).join("/");
    if (rel === outName) continue;

    const buf = fs.readFileSync(full);
    files[rel] = isBinary(buf)
      ? { encoding: "base64", data: buf.toString("base64") }
      : buf.toString("utf8");
  }
}

const files = {};
walk(root, files);

const keys = Object.keys(files).sort((a, b) => a.localeCompare(b));
const ordered = {};
for (const key of keys) ordered[key] = files[key];

const payload = {
  generatedAt: new Date().toISOString(),
  fileCount: keys.length,
  files: ordered,
};

fs.writeFileSync(outPath, JSON.stringify(payload));
console.log(`${outPath}`);
console.log(`${payload.fileCount} files`);
