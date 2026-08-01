/* ==========================================================================
   AURELLE — Panel admin (admin.html) — versi compact
   Data produk dari js/data.js; pesanan & pelanggan contoh (tanpa backend).
   ========================================================================== */

"use strict";

/* ---------- Data contoh pelanggan (tanpa backend) ---------- */
/* Data pesanan (ORDERS) diambil dari js/data.js agar konsisten dengan halaman cek pesanan */
const CUSTOMERS = [
  { nama: "Siti Rahma", email: "siti.rahma@gmail.com", kota: "Jakarta", pesanan: 6, belanja: 2140000, status: "Aktif" },
  { nama: "Budi Santoso", email: "budi.s@gmail.com", kota: "Bandung", pesanan: 3, belanja: 890000, status: "Aktif" },
  { nama: "Dewi Lestari", email: "dewi.lestari@yahoo.com", kota: "Surabaya", pesanan: 4, belanja: 1560000, status: "Aktif" },
  { nama: "Rizky Pratama", email: "rizky.p@outlook.com", kota: "Semarang", pesanan: 2, belanja: 1040000, status: "Baru" },
  { nama: "Maya Anggraini", email: "maya.a@gmail.com", kota: "Yogyakarta", pesanan: 5, belanja: 1870000, status: "Aktif" },
  { nama: "Fajar Nugroho", email: "fajar.n@gmail.com", kota: "Medan", pesanan: 1, belanja: 229000, status: "Baru" },
  { nama: "Putri Ayu", email: "putri.ayu@gmail.com", kota: "Bali", pesanan: 2, belanja: 910000, status: "Nonaktif" },
  { nama: "Andi Wijaya", email: "andi.w@yahoo.com", kota: "Makassar", pesanan: 3, belanja: 1220000, status: "Aktif" },
];

/* Salinan katalog agar hapus/ubah hanya berlaku di sesi ini */
let products = PRODUCTS.map((p, i) => ({ ...p, index: i }));

const STATUS_BADGE = {
  Menunggu: "badge-muted",
  Diproses: "badge-terracotta",
  Dikirim: "badge-ink",
  Selesai: "badge-sage",
  Aktif: "badge-success",
  Baru: "badge-terracotta",
  Nonaktif: "badge-muted",
};

/* ---------- Utilitas ---------- */
function badgeHTML(status) {
  return `<span class="admin-badge ${STATUS_BADGE[status] || "badge-muted"}">${status}</span>`;
}

function formatDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatNum(value) {
  return value.toLocaleString("id-ID");
}

/* ---------- Pindah tab ---------- */
function initTabs() {
  document.querySelectorAll(".admin-nav-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".admin-nav-link").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".admin-tab").forEach((s) => (s.hidden = true));
      document.getElementById("tab-" + btn.dataset.tab).hidden = false;
    });
  });

  // Tombol "Lihat semua" di panel dashboard
  document.querySelectorAll("[data-goto]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.goto;
      document.querySelectorAll(".admin-nav-link").forEach((b) =>
        b.classList.toggle("active", b.dataset.tab === tab)
      );
      document.querySelectorAll(".admin-tab").forEach((s) => (s.hidden = s.id !== "tab-" + tab));
    });
  });
}

/* ---------- Dashboard ---------- */
function renderStats() {
  const revenue = products.reduce((sum, p) => sum + p.price * p.sold, 0);
  const sold = products.reduce((sum, p) => sum + p.sold, 0);

  document.getElementById("statRevenue").textContent = formatRupiah(revenue);
  document.getElementById("statSold").textContent = formatNum(sold) + " item";
  document.getElementById("statProducts").textContent = products.length + " produk";
  document.getElementById("statWishlist").textContent = getWishlist().length + " item";

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  document.getElementById("adminDate").textContent = today;
}

function topRowHTML(p) {
  return `
    <tr>
      <td>
        <div class="admin-prod">
          <img class="admin-thumb" src="${p.image}" alt="" loading="lazy" />
          <div>
            <div class="admin-prod-name">${p.name}</div>
            <div class="admin-prod-sub">${p.category}</div>
          </div>
        </div>
      </td>
      <td>${formatRupiah(p.price)}</td>
      <td>${formatNum(p.sold)}</td>
      <td>★ ${p.rating.toLocaleString("id-ID")}</td>
    </tr>`;
}

function renderTopProducts() {
  const body = document.getElementById("topProducts");
  if (!body) return;
  const top = [...products].sort((a, b) => b.sold - a.sold).slice(0, 4);
  body.innerHTML = top.map(topRowHTML).join("");
}

function renderRecentOrders() {
  const body = document.getElementById("recentOrders");
  if (!body) return;
  body.innerHTML = ORDERS.slice(0, 5)
    .map(
      (o) => `
    <tr>
      <td><span class="admin-prod-name">${o.id}</span></td>
      <td>${o.nama}</td>
      <td>${formatRupiah(o.total)}</td>
      <td>${badgeHTML(o.status)}</td>
    </tr>`
    )
    .join("");
}

/* ---------- Tabel produk ---------- */
const adminState = { q: "", kategori: "Semua", sort: "terlaris" };

function getFilteredProducts() {
  const items = products.filter((p) => {
    const matchCat =
      adminState.kategori === "Semua"
        ? true
        : adminState.kategori === "Aksesoris"
          ? p.category === "Aksesoris"
          : p.category.includes(adminState.kategori);
    const matchQ = !adminState.q || p.name.toLowerCase().includes(adminState.q);
    return matchCat && matchQ;
  });

  switch (adminState.sort) {
    case "termurah":
      items.sort((a, b) => a.price - b.price);
      break;
    case "termahal":
      items.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      items.sort((a, b) => b.rating - a.rating);
      break;
    default:
      items.sort((a, b) => b.sold - a.sold);
  }
  return items;
}

function productRowHTML(p) {
  return `
    <tr>
      <td>
        <div class="admin-prod">
          <img class="admin-thumb" src="${p.image}" alt="" loading="lazy" />
          <div>
            <div class="admin-prod-name">${p.name}</div>
            <div class="admin-prod-sub">#${p.index}</div>
          </div>
        </div>
      </td>
      <td>${p.category}</td>
      <td>${p.badge ? `<span class="admin-badge badge-terracotta">${p.badge}</span>` : "—"}</td>
      <td>
        <strong>${formatRupiah(p.price)}</strong>
        ${p.oldPrice ? `<span class="admin-prod-sub"> ${formatRupiah(p.oldPrice)}</span>` : ""}
      </td>
      <td>${formatNum(p.sold)}</td>
      <td>★ ${p.rating.toLocaleString("id-ID")}</td>
      <td class="ta-r">
        <a class="admin-btn admin-btn-sm" href="produk.html?id=${p.index}">Lihat</a>
        <button type="button" class="admin-btn admin-btn-sm js-edit" data-index="${p.index}">Edit</button>
        <button type="button" class="admin-btn admin-btn-sm admin-btn-danger js-delete" data-index="${p.index}">Hapus</button>
      </td>
    </tr>`;
}

function renderProducts() {
  const body = document.getElementById("productBody");
  const empty = document.getElementById("adminEmpty");
  const count = document.getElementById("adminCount");
  if (!body) return;

  const items = getFilteredProducts();
  body.innerHTML = items.map(productRowHTML).join("");
  if (empty) empty.hidden = items.length > 0;
  if (count) {
    count.textContent = items.length + " dari " + products.length + " produk";
  }
}

function initProductControls() {
  // Pilihan kategori
  const catSelect = document.getElementById("adminCategory");
  if (catSelect) {
    catSelect.innerHTML =
      `<option value="Semua">Semua Kategori</option>` +
      KATEGORI.filter((k) => k !== "Semua")
        .map((k) => `<option value="${k}">${k}</option>`)
        .join("");
    catSelect.addEventListener("change", () => {
      adminState.kategori = catSelect.value;
      renderProducts();
    });
  }

  // Pencarian live (debounce)
  const search = document.getElementById("adminSearch");
  let debounce;
  search?.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      adminState.q = search.value.trim().toLowerCase();
      renderProducts();
    }, 150);
  });

  // Urutan
  document.getElementById("adminSort")?.addEventListener("change", (e) => {
    adminState.sort = e.target.value;
    renderProducts();
  });

  // Tambah produk
  document.getElementById("addProductBtn")?.addEventListener("click", () => {
    showToast("Fitur tambah produk segera hadir");
  });

  // Aksi baris: edit & hapus (delegasi)
  document.getElementById("productBody")?.addEventListener("click", (e) => {
    const edit = e.target.closest(".js-edit");
    const del = e.target.closest(".js-delete");
    if (edit) {
      showToast("Fitur edit produk segera hadir");
      return;
    }
    if (!del) return;

    const index = parseInt(del.dataset.index, 10);
    products = products.filter((p) => p.index !== index);
    renderProducts();
    renderStats();
    renderTopProducts();
    showToast("Produk dihapus (hanya di sesi ini)");
  });
}

/* ---------- Tabel pesanan ---------- */
function renderOrders() {
  const body = document.getElementById("orderBody");
  const empty = document.getElementById("orderEmpty");
  if (!body) return;

  const filter = document.getElementById("orderStatus")?.value || "Semua";
  const items = ORDERS.filter((o) => filter === "Semua" || o.status === filter);

  body.innerHTML = items
    .map(
      (o) => `
    <tr>
      <td><span class="admin-prod-name">${o.id}</span></td>
      <td>${o.nama}</td>
      <td>${formatDate(o.tanggal)}</td>
      <td>${o.item} item</td>
      <td>${formatRupiah(o.total)}</td>
      <td>${badgeHTML(o.status)}</td>
      <td class="ta-r">
        <button type="button" class="admin-btn admin-btn-sm js-order-detail" data-id="${o.id}">Detail</button>
      </td>
    </tr>`
    )
    .join("");

  if (empty) empty.hidden = items.length > 0;
}

function initOrderDetail() {
  document.getElementById("orderBody")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".js-order-detail");
    if (!btn) return;
    showToast("Detail pesanan " + btn.dataset.id + " segera hadir");
  });
}

/* ---------- Tabel pelanggan ---------- */
function renderCustomers() {
  const body = document.getElementById("customerBody");
  if (!body) return;

  body.innerHTML = CUSTOMERS.map(
    (c) => `
    <tr>
      <td>
        <div class="admin-prod">
          <div class="admin-avatar" aria-hidden="true">${c.nama.charAt(0)}</div>
          <div>
            <div class="admin-prod-name">${c.nama}</div>
            <div class="admin-prod-sub">${c.email}</div>
          </div>
        </div>
      </td>
      <td>${c.kota}</td>
      <td>${c.pesanan}</td>
      <td>${formatRupiah(c.belanja)}</td>
      <td>${badgeHTML(c.status)}</td>
    </tr>`
  ).join("");
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  renderStats();
  renderTopProducts();
  renderRecentOrders();
  renderProducts();
  initProductControls();
  renderOrders();
  initOrderDetail();
  renderCustomers();
  document.getElementById("orderStatus")?.addEventListener("change", renderOrders);
});
