/**
 * Audit EN/VI locale files and public UI for mixed language.
 * Usage: node scripts/audit-i18n.js
 */
const fs = require("fs");
const path = require("path");

const VI_RE = /[àáạảãăằắặẳẵâầấậẩẫèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃĂẰẮẶẲẴÂẦẤẬẨẪÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/;
const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "public", "docs", "scripts"]);
const PUBLIC_DIRS = ["app", "components"];
const SKIP_PATH_PARTS = ["admin", "api"];

function flatten(obj, prefix = "", out = {}) {
  if (obj === null || obj === undefined) return out;
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => flatten(item, `${prefix}[${i}]`, out));
    return out;
  }
  if (typeof obj === "object") {
    for (const [key, value] of Object.entries(obj)) {
      flatten(value, prefix ? `${prefix}.${key}` : key, out);
    }
    return out;
  }
  out[prefix] = obj;
  return out;
}

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) acc.push(full);
    }
  return acc;
}

function isPublicUiFile(file) {
  const rel = file.replace(/\\/g, "/");
  return !SKIP_PATH_PARTS.some((part) => rel.includes(`/${part}/`) || rel.includes(`\\${part}\\`));
}

const en = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "locales", "en.json"), "utf8"));
const vi = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "locales", "vi.json"), "utf8"));
const flatEn = flatten(en);
const flatVi = flatten(vi);

const missingInEn = Object.keys(flatVi).filter((k) => !(k in flatEn));
const missingInVi = Object.keys(flatEn).filter((k) => !(k in flatVi));
const viInsideEn = Object.entries(flatEn)
  .filter(([, value]) => typeof value === "string" && VI_RE.test(value))
  .map(([key, value]) => ({ key, value: value.slice(0, 120) }));
const sameAsVi = Object.keys(flatEn).filter((k) => {
  const a = flatEn[k];
  const b = flatVi[k];
  return typeof a === "string" && typeof b === "string" && a === b && VI_RE.test(a);
});

const hardcodedVi = [];
for (const dir of PUBLIC_DIRS) {
  for (const file of walk(path.join(__dirname, "..", dir))) {
    if (!isPublicUiFile(file)) continue;
    const src = fs.readFileSync(file, "utf8");
    const lines = src.split(/\r?\n/);
    lines.forEach((line, i) => {
      if (!VI_RE.test(line)) return;
      if (line.trim().startsWith("//") || line.trim().startsWith("*")) return;
      hardcodedVi.push({
        file: path.relative(path.join(__dirname, ".."), file),
        line: i + 1,
        text: line.trim().slice(0, 140),
      });
    });
  }
}

const report = {
  missingInEn: missingInEn.length,
  missingInVi: missingInVi.length,
  vietnameseInsideEnJson: viInsideEn.length,
  enEqualsViWithAccents: sameAsVi.length,
  hardcodedVietnameseInPublicUi: hardcodedVi.length,
  samples: {
    missingInEn: missingInEn.slice(0, 30),
    missingInVi: missingInVi.slice(0, 30),
    vietnameseInsideEnJson: viInsideEn.slice(0, 40),
    enEqualsViWithAccents: sameAsVi.slice(0, 20),
    hardcodedVietnameseInPublicUi: hardcodedVi.slice(0, 40),
  },
};

console.log(JSON.stringify(report, null, 2));
console.log("\nRun again after locale fixes. Goal: vietnameseInsideEnJson = 0, missingInEn = 0.");
