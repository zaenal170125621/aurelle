/* Screenshot generator: server statis + Edge/Chrome headless.
   Menghasilkan preview halaman ke screenshots/*.png
   Jalankan: node tools/screenshots.cjs */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const os = require("os");

const OUT_DIR = path.join(process.cwd(), "screenshots");
fs.mkdirSync(OUT_DIR, { recursive: true });

const PAGES = [
  { url: "http://127.0.0.1:8123/index.html", out: "beranda.png", size: "1440,2000" },
  { url: "http://127.0.0.1:8123/koleksi.html", out: "koleksi.png", size: "1440,1400" },
  { url: "http://127.0.0.1:8123/produk.html?id=1", out: "produk.png", size: "1440,1400" },
  // keranjang: lewat halaman seed supaya localStorage terisi dulu
  { url: "http://127.0.0.1:8123/_seed-cart.html", out: "keranjang.png", size: "1440,1200" },
];

// Halaman sementara untuk mengisi keranjang sebelum screenshot
const SEED_FILE = "_seed-cart.html";
const CART_SEED = JSON.stringify([
  { id: 0, name: "Kaos Oversize Basic", size: "M", color: "Putih", qty: 2, price: 89000 },
  { id: 1, name: "Dress Puff Sleeve", size: "S", color: "Krem", qty: 1, price: 249000 },
]);

fs.writeFileSync(
  path.join(process.cwd(), SEED_FILE),
  '<!DOCTYPE html><script>localStorage.setItem("aurelle-cart", ' +
    JSON.stringify(CART_SEED) +
    '); location.replace("http://127.0.0.1:8123/keranjang.html");</script>'
);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".json": "application/json",
};

const CANDIDATES = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
];
const browser = CANDIDATES.find((p) => fs.existsSync(p));
if (!browser) {
  console.error("Browser headless tidak ditemukan (Edge/Chrome).");
  process.exit(1);
}

const server = http.createServer((req, res) => {
  let p;
  try {
    p = decodeURIComponent(req.url.split("?")[0]);
  } catch {
    p = "/";
  }
  if (p === "/") p = "/index.html";
  const file = path.join(process.cwd(), p);
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
    });
    res.end(data);
  });
});

function shoot(page) {
  return new Promise((resolve) => {
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), "aurelle-shot-"));
    const args = [
      "--headless",
      "--disable-gpu",
      "--hide-scrollbars",
      "--no-first-run",
      "--no-default-browser-check",
      `--user-data-dir=${profile}`,
      `--window-size=${page.size}`,
      "--virtual-time-budget=6000",
      "--screenshot=" + path.join(OUT_DIR, page.out).replace(/\\/g, "/"),
      page.url,
    ];
    const child = spawn(browser, args, { windowsHide: true });
    const killer = setTimeout(() => {
      console.error(`  timeout ${page.out}, dipaksa mati`);
      child.kill("SIGKILL");
    }, 25000);
    child.on("exit", () => {
      clearTimeout(killer);
      fs.rmSync(profile, { recursive: true, force: true });
      resolve();
    });
    child.on("error", (e) => {
      clearTimeout(killer);
      console.error(`  gagal jalankan browser: ${e.message}`);
      resolve();
    });
  });
}

server.listen(8123, async () => {
  console.log(`Menggunakan ${path.basename(browser)}`);
  for (const page of PAGES) {
    process.stdout.write(`  ${page.out} ... `);
    await shoot(page);
    const size = fs.existsSync(path.join(OUT_DIR, page.out))
      ? fs.statSync(path.join(OUT_DIR, page.out)).size
      : 0;
    console.log(size > 1000 ? "OK" : "GAGAL");
  }
  server.close();
  fs.unlinkSync(path.join(process.cwd(), SEED_FILE));
  console.log(`Selesai -> ${path.relative(process.cwd(), OUT_DIR)}/`);
  process.exit(0);
});
