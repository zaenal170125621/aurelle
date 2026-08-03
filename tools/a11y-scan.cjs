/* Aksesibilitas scan: alt pada gambar, label pada input, nama aksesibel tombol. */
const fs = require("fs");

const files = fs.readdirSync(".").filter((f) => f.endsWith(".html"));
let bad = [];

for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  const issues = [];

  // 1. <img> wajib punya alt
  const imgs = [...src.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  imgs.forEach((img, i) => {
    if (!/\salt=/.test(img)) issues.push(`img #${i + 1} tanpa alt`);
  });

  // 2. <input> wajib punya label (label for=, label wrapping, aria-label, atau placeholder)
  const labelFor = new Set(
    [...src.matchAll(/<label\b[^>]*\bfor="([^"]+)"/g)].map((m) => m[1])
  );
  const inputs = [...src.matchAll(/<input\b[^>]*>/g)].map((m) => m[0]);
  inputs.forEach((inp, i) => {
    if (/type="(hidden|submit|button|checkbox|radio|file)"/.test(inp)) return;
    const id = inp.match(/\bid="([^"]+)"/)?.[1];
    const labeled =
      /\b(aria-label|aria-labelledby|placeholder)="/.test(inp) ||
      (id && labelFor.has(id)) ||
      /<label\b[^>]*>[^<]*<input/.test(src);
    if (!labeled) issues.push(`input #${i + 1} tanpa label: ${inp.slice(0, 80)}`);
  });

  // 3. <button> wajib punya nama (teks, aria-label, atau title)
  const buttons = [...src.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/g)].map((m) => m[0]);
  buttons.forEach((btn, i) => {
    const tag = btn.slice(0, btn.indexOf(">") + 1);
    const inner = btn.slice(btn.indexOf(">") + 1).replace(/<[^>]+>/g, "").trim();
    const named =
      /\b(aria-label|title)="/.test(tag) || inner.length > 0;
    if (!named) issues.push(`button #${i + 1} tanpa nama: ${tag.slice(0, 80)}`);
  });

  // 4. Link berisi SVG tanpa teks wajib punya aria-label/title/aria-labelledby
  const anchors = [...src.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)];
  anchors.forEach((m, i) => {
    const inner = m[1];
    const innerText = inner.replace(/<[^>]+>/g, "").trim();
    if (innerText) return; // punya teks, nama aksesibel otomatis
    if (!/<svg\b/.test(inner)) return; // bukan icon-only
    const tag = m[0].slice(0, m[0].indexOf(">") + 1);
    if (!/\b(aria-label|aria-labelledby|title)="/.test(tag)) {
      issues.push(`link-svg #${i + 1} tanpa aria-label: ${tag.slice(0, 80)}`);
    }
  });

  // 5. Panel dialog (element dgn class modal/zoom-modal/search-panel) wajib role=dialog
  [...src.matchAll(/class="([^"]+)"[^>]*>/g)].forEach((m) => {
    const classes = m[1].split(/\s+/);
    if (!classes.some((c) => c === "modal" || c === "zoom-modal" || c === "search-panel")) return;
    // overlay/backdrop boleh tanpa role karena panel di dalamnya yang jadi dialog
    if (classes.some((c) => c.endsWith("-overlay"))) return;
    if (/role="dialog"/.test(m[0])) return;
    issues.push(`panel dialog tanpa role=dialog: ${m[0].slice(0, 60)}`);
  });

  if (issues.length) bad.push(`${f}:\n    - ${issues.join("\n    - ")}`);
}

console.log(`Scanned ${files.length} pages`);
if (bad.length) {
  console.log("ISSUES:");
  bad.forEach((b) => console.log(`  ${b}`));
  process.exitCode = 1;
} else {
  console.log("All accessibility checks passed");
}
