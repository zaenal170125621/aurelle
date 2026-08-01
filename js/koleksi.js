/* ==========================================================================
   AURELLE — Halaman katalog (koleksi.html)
   Semua produk + filter kategori + pencarian + urutan.
   Mendukung deep link: koleksi.html?kategori=Wanita&q=kaos&sort=termurah
   ========================================================================== */

"use strict";

const params = new URLSearchParams(window.location.search);

const SORT_OPTIONS = ["terlaris", "termurah", "termahal", "rating"];

let activeCategory = KATEGORI.includes(params.get("kategori"))
  ? params.get("kategori")
  : "Semua";
let searchQuery = (params.get("q") || "").toLowerCase();
let sortBy = SORT_OPTIONS.includes(params.get("sort")) ? params.get("sort") : "terlaris";

/* ---------- Logika filter ---------- */
function matchCategory(product, category) {
  if (category === "Semua") return true;
  if (category === "Aksesoris") return product.category === "Aksesoris";
  return product.category.includes(category);
}

function getFiltered() {
  const items = PRODUCTS.map((p, i) => ({ p, i }))
    .filter(({ p }) => matchCategory(p, activeCategory))
    .filter(({ p }) => !searchQuery || p.name.toLowerCase().includes(searchQuery));

  switch (sortBy) {
    case "termurah":
      items.sort((a, b) => a.p.price - b.p.price);
      break;
    case "termahal":
      items.sort((a, b) => b.p.price - a.p.price);
      break;
    case "rating":
      items.sort((a, b) => b.p.rating - a.p.rating);
      break;
    default:
      items.sort((a, b) => b.p.sold - a.p.sold);
  }
  return items;
}

/* ---------- Sinkronkan URL agar bisa dibagikan ---------- */
function updateUrl() {
  const url = new URL(window.location.href);
  if (activeCategory !== "Semua") url.searchParams.set("kategori", activeCategory);
  else url.searchParams.delete("kategori");
  if (searchQuery) url.searchParams.set("q", searchQuery);
  else url.searchParams.delete("q");
  url.searchParams.set("sort", sortBy);
  history.replaceState(null, "", url);
}

/* ---------- Render pill kategori ---------- */
function renderPills() {
  const bar = document.getElementById("categoryPills");
  if (!bar) return;

  bar.innerHTML = KATEGORI.map((k) => {
    const count = PRODUCTS.filter((p) => matchCategory(p, k)).length;
    const active = k === activeCategory ? " active" : "";
    return `
      <button type="button" class="pill${active}" data-kategori="${k}">
        ${k} <span>${count}</span>
      </button>`;
  }).join("");
}

/* ---------- Render hasil ---------- */
function render() {
  const grid = document.getElementById("catalogGrid");
  const countEl = document.getElementById("catalogCount");
  const emptyEl = document.getElementById("catalogEmpty");
  const searchInput = document.getElementById("searchInput");
  const searchClear = document.getElementById("searchClear");
  const sortSelect = document.getElementById("sortSelect");
  if (!grid) return;

  // Sinkronkan kontrol dengan state
  if (searchInput) searchInput.value = searchQuery;
  if (searchClear) searchClear.hidden = !searchQuery;
  if (sortSelect) sortSelect.value = sortBy;

  const items = getFiltered();
  const total = PRODUCTS.length;

  if (!items.length) {
    grid.innerHTML = "";
    if (countEl) countEl.textContent = "";
    if (emptyEl) {
      emptyEl.hidden = false;
      emptyEl.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
          <path d="M8 11h6" />
        </svg>
        <h2>Produk tidak ditemukan</h2>
        <p>Coba kata kunci lain atau pilih kategori yang berbeda.</p>
        <button type="button" class="btn btn-dark" id="resetFilters">Reset Filter</button>`;
    }
    return;
  }

  grid.innerHTML = items.map(({ p, i }) => productCardHTML(p, i)).join("");
  if (countEl) {
    countEl.textContent = searchQuery
      ? items.length + " produk ditemukan untuk \u201C" + searchQuery + "\u201D"
      : "Menampilkan " + items.length + " dari " + total + " produk";
  }
  if (emptyEl) emptyEl.hidden = true;

  initReveal();
}

/* ---------- Kontrol: pill, pencarian, reset, urutan ---------- */
function initControls() {
  // Filter kategori
  document.getElementById("categoryPills")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".pill");
    if (!btn) return;

    activeCategory = btn.dataset.kategori;
    renderPills();
    render();
    updateUrl();
  });

  // Pencarian live (debounce)
  const searchInput = document.getElementById("searchInput");
  let debounce;
  searchInput?.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      searchQuery = searchInput.value.trim().toLowerCase();
      render();
      updateUrl();
    }, 150);
  });

  // Tombol bersihkan pencarian
  document.getElementById("searchClear")?.addEventListener("click", () => {
    searchQuery = "";
    render();
    updateUrl();
    searchInput?.focus();
  });

  // Reset filter (dari state kosong)
  document.getElementById("catalogEmpty")?.addEventListener("click", (e) => {
    if (!e.target.closest("#resetFilters")) return;
    activeCategory = "Semua";
    searchQuery = "";
    sortBy = "terlaris";
    renderPills();
    render();
    updateUrl();
    searchInput?.focus();
  });

  // Urutan
  document.getElementById("sortSelect")?.addEventListener("change", (e) => {
    sortBy = e.target.value;
    render();
    updateUrl();
  });
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderPills();
  render();
  initControls();
});
