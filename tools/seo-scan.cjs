/* SEO scan: periksa meta tag wajib di semua halaman.
   - Halaman dengan noindex (admin.html) dikecualikan dari cek OG + analytics.
   - og:type "article" valid untuk halaman artikel.
   - og:url homepage boleh tanpa nama file (root URL). */
const fs = require("fs");

const files = fs.readdirSync(".").filter((f) => f.endsWith(".html"));

const BASE = "https://zaenal170125621.github.io/aurelle";

const og = [
  { name: "og:type", re: /<meta property="og:type" content="(website|article)"/ },
  { name: "og:site_name", re: /<meta property="og:site_name" content="AURELLE"/ },
  { name: "og:title", re: /<meta property="og:title" content="[^"]+"/ },
  { name: "og:description", re: /<meta property="og:description" content="[^"]+"/ },
  { name: "og:image", re: /<meta property="og:image" content="https:\/\// },
];

const shared = [
  { name: "lang=id", re: /<html lang="id">/ },
  { name: "meta description", re: /<meta name="description" content="[^"]+"/ },
  { name: "title", re: /<title>[^<]+<\/title>/ },
  { name: "viewport", re: /name="viewport"/ },
  { name: "favicon", re: /<link rel="icon" href="favicon\.svg"/ },
];

let bad = [];
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  const noindex = /<meta name="robots" content="noindex/.test(src);
  const isHome = f === "index.html";

  const missing = shared.filter((c) => !c.re.test(src)).map((c) => c.name);

  if (!noindex) {
    missing.push(...og.filter((c) => !c.re.test(src)).map((c) => c.name));

    // og:url: halaman lain wajib .html; homepage boleh root URL
    const okUrl = isHome
      ? src.includes(`<meta property="og:url" content="${BASE}/" />`)
      : src.includes(`<meta property="og:url" content="${BASE}/${f}" />`);
    if (!okUrl) missing.push("og:url");

    // analytics.js: semua halaman store wajib memuatnya
    if (!/js\/analytics\.js/.test(src)) missing.push("analytics.js");
  }

  if (missing.length) bad.push(`${f}: missing [${missing.join(", ")}]`);
}

console.log(`Scanned ${files.length} pages (${files.filter((f) => /<meta name="robots" content="noindex/.test(fs.readFileSync(f, "utf8"))).length} exempt)`);
if (bad.length) {
  console.log("ISSUES:");
  bad.forEach((b) => console.log(`  ${b}`));
  process.exitCode = 1;
} else {
  console.log("All SEO checks passed on every page");
}
