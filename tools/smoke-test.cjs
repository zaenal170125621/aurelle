/* Smoke test: serve folder, fetch semua halaman & asset inti, laporkan status. */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  const filePath = path.join(ROOT, urlPath === "/" ? "index.html" : urlPath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "text/plain" });
    res.end(data);
  });
});

server.listen(0, "127.0.0.1", async () => {
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;

  const pages = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));
  const assets = ["css/style.css", "js/data.js", "js/site.js", "js/main.js", "js/koleksi.js",
    "js/masuk.js", "favicon.svg", "robots.txt", "sitemap.xml"];

  const results = [];
  const fetchStatus = async (url) => {
    try {
      const r = await fetch(base + "/" + url);
      return { url, status: r.status };
    } catch (e) {
      return { url, status: "ERR" };
    }
  };

  for (const p of pages) results.push(await fetchStatus(p));
  for (const a of assets) results.push(await fetchStatus(a));

  const bad = results.filter((r) => r.status !== 200);
  console.log(`Tested ${results.length} URLs (${pages.length} pages + ${assets.length} assets)`);
  if (bad.length) {
    console.log("FAILED:");
    bad.forEach((b) => console.log(`  ${b.status} ${b.url}`));
    process.exitCode = 1;
  } else {
    console.log("All URLs returned 200 OK");
  }
  server.close();
});
