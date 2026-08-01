/* ==========================================================================
   AURELLE — Utilitas bersama (dipakai seluruh halaman)
   Tema gelap/terang, keranjang, menu mobile, navbar, toast, wishlist,
   kartu produk, pencarian (modal), newsletter, announcement, back-to-top,
   dan animasi reveal.
   ========================================================================== */

"use strict";

/* ---------- Toast notifikasi ---------- */
function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toast.setAttribute("role", "status");
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("show"));

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}

/* ---------- Scroll reveal ---------- */
let revealObserver;

function initReveal() {
  const items = document.querySelectorAll(".reveal:not(.visible)");
  if (!items.length) return;

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
  }

  items.forEach((el) => revealObserver.observe(el));
}

/* ---------- Tema gelap / terang ---------- */
function initTheme() {
  const btn = document.getElementById("themeBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const root = document.documentElement;
    const isDark = root.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";

    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("aurelle-theme", next);
    } catch (e) {
      /* localStorage tidak tersedia — abaikan */
    }
    showToast(next === "dark" ? "Mode gelap aktif" : "Mode terang aktif");
  });
}

/* ---------- Keranjang (localStorage) ---------- */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("aurelle-cart") || "[]");
  } catch (e) {
    return [];
  }
}

function syncCartBadge() {
  const badge = document.querySelector(".cart-badge");
  if (!badge) return;
  const count = getCart().length;
  badge.textContent = count;
  badge.hidden = count === 0;
}

function addToCart(item) {
  const cart = getCart();

  // Gabungkan item yang sama (id + ukuran + warna) agar tidak jadi baris ganda
  const existing = cart.find(
    (i) => i.id === item.id && i.size === item.size && i.color === item.color
  );
  if (existing) {
    existing.qty = Math.min(10, existing.qty + item.qty);
  } else {
    cart.push(item);
  }

  try {
    localStorage.setItem("aurelle-cart", JSON.stringify(cart));
  } catch (e) {
    /* abaikan */
  }
  syncCartBadge();
  showToast("Ditambahkan ke keranjang");
}

function initCartButton() {
  const btn = document.querySelector(".cart-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    window.location.href = "keranjang.html";
  });
}

/* ---------- Wishlist (localStorage) ---------- */
function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem("aurelle-wishlist") || "[]");
  } catch (e) {
    return [];
  }
}

function saveWishlist(list) {
  try {
    localStorage.setItem("aurelle-wishlist", JSON.stringify(list));
  } catch (e) {
    /* abaikan */
  }
}

function isInWishlist(productId) {
  return getWishlist().includes(productId);
}

function toggleWishlist(productId) {
  const list = getWishlist();
  const index = list.indexOf(productId);
  const added = index === -1;

  if (added) list.push(productId);
  else list.splice(index, 1);

  saveWishlist(list);
  syncWishlistBadge();
  return added;
}

function syncWishlistBadge() {
  const badge = document.querySelector(".wishlist-badge");
  if (!badge) return;
  const count = getWishlist().length;
  badge.textContent = count;
  badge.hidden = count === 0;
}

function initWishlistNav() {
  document.querySelectorAll(".wishlist-nav").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.href = "wishlist.html";
    });
  });
}

/* ---------- Animasi scroll kustom (garansi halus di semua browser) ---------- */
function animatedScrollTo(targetY) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  if (Math.abs(diff) < 1) return;

  // Matikan CSS scroll-behavior sementara agar tidak bertabrakan
  const root = document.documentElement;
  const prevBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";

  // Durasi menyesuaikan jarak agar terasa natural (350–900 ms)
  const duration = Math.min(900, 350 + Math.abs(diff) * 0.3);
  const start = performance.now();
  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function step(now) {
    const t = Math.min(1, (now - start) / duration);
    window.scrollTo(0, startY + diff * easeInOutCubic(t));
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      root.style.scrollBehavior = prevBehavior;
    }
  }
  requestAnimationFrame(step);
}

/* ---------- Animasi scroll kustom (garansi halus di semua browser) ---------- */
/* ---------- Scroll halus antar bagian di halaman yang sama ---------- */
const NAV_OFFSET = 90;

function initSmoothScroll() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const hash = link.getAttribute("href");

    // Tautan mati (href="#") — beri umpan balik, jangan lompat ke atas halaman
    if (hash === "#") {
      e.preventDefault();
      showToast("Fitur ini segera hadir");
      return;
    }

    const target = document.querySelector(hash);
    if (!target) return;

    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    animatedScrollTo(top);
    history.replaceState(null, "", hash);
  });
}

/* ---------- Scrollspy: tandai link nav sesuai bagian yang terlihat ---------- */
function initScrollSpy() {
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!links.length) return;

  const map = {};
  links.forEach((link) => {
    const id = link.getAttribute("href").slice(1);
    if (id) map[id] = link;
  });

  const sections = Object.keys(map)
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => l.classList.remove("active"));
        map[entry.target.id].classList.add("active");
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );
  sections.forEach((section) => observer.observe(section));
}

/* ---------- Menu mobile ---------- */
function initMenu() {
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");
  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.setAttribute("aria-label", isOpen ? "Tutup menu" : "Buka menu");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- Navbar sticky ---------- */
function initNavbar() {
  const nav = document.getElementById("navbar");
  if (!nav) return;

  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Ikon keranjang & wishlist aktif sesuai halaman ---------- */
function initActiveNav() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  if (page === "keranjang.html" || page === "checkout.html") {
    document.querySelector(".cart-btn")?.classList.add("active");
  }
  if (page === "wishlist.html") {
    document.querySelector(".wishlist-nav")?.classList.add("active");
  }
}

/* ---------- Pencarian produk (modal live search) ---------- */
const SEARCH_HISTORY_KEY = "aurelle-search-history";
const POPULAR_KEYWORDS = ["kaos", "dress", "jeans", "linen", "cardigan", "tote bag"];

function getSearchHistory() {
  try {
    return JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function saveSearchHistory(q) {
  const query = q.trim().toLowerCase();
  if (!query) return;
  const list = getSearchHistory().filter((k) => k !== query);
  list.unshift(query);
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(list.slice(0, 6)));
}

function clearSearchHistory() {
  localStorage.removeItem(SEARCH_HISTORY_KEY);
}

function searchProducts(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const found = [];
  for (let i = 0; i < PRODUCTS.length && found.length < 6; i++) {
    const p = PRODUCTS[i];
    if (p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) {
      found.push({ index: i, product: p });
    }
  }
  return found;
}

function initSearch() {
  const btn = document.getElementById("searchBtn");
  if (!btn || typeof PRODUCTS === "undefined") return;

  const overlay = document.createElement("div");
  overlay.className = "search-overlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <div class="search-panel" role="dialog" aria-modal="true" aria-label="Cari produk">
      <div class="search-head">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input type="search" id="searchInput" placeholder="Cari produk atau kategori..." autocomplete="off" aria-label="Kata kunci pencarian" />
        <button type="button" class="modal-close" id="searchClose" aria-label="Tutup pencarian">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="search-results" id="searchResults" aria-live="polite"></div>
    </div>`;
  document.body.appendChild(overlay);

  const input = overlay.querySelector("#searchInput");
  const results = overlay.querySelector("#searchResults");
  const closeBtn = overlay.querySelector("#searchClose");

  const itemHTML = (p, index) => `
    <a class="search-item" href="produk.html?id=${index}">
      <img src="${p.image}" alt="" loading="lazy" />
      <span class="search-item-info">
        <strong>${p.name}</strong>
        <small>${p.category} · ${formatRupiah(p.price)}</small>
      </span>
    </a>`;

  /* Chip kata kunci (riwayat / populer) */
  const chipHTML = (label) =>
    `<button type="button" class="search-chip" data-query="${String(label).replace(/"/g, "&quot;")}">${label}</button>`;

  const popularHTML = () =>
    `<p class="search-label">Kata kunci populer</p>` +
    `<div class="search-chips">${POPULAR_KEYWORDS.map(chipHTML).join("")}</div>`;

  const historyHTML = () => {
    const history = getSearchHistory();
    if (!history.length) return "";
    return (
      `<p class="search-label">Riwayat pencarian ` +
      `<button type="button" class="search-clear" id="clearHistory">Hapus</button></p>` +
      `<div class="search-chips">${history.map(chipHTML).join("")}</div>`
    );
  };

  const render = () => {
    if (!input.value.trim()) {
      results.innerHTML =
        historyHTML() +
        popularHTML() +
        `<p class="search-label">Produk populer</p>` +
        PRODUCTS.slice(0, 4).map((p, i) => itemHTML(p, i)).join("");
      return;
    }

    const found = searchProducts(input.value);
    results.innerHTML = found.length
      ? found.map(({ index, product }) => itemHTML(product, index)).join("")
      : '<p class="search-empty">Tidak ada produk yang cocok. Coba kata kunci lain.</p>';
  };

  /* Klik chip riwayat/populer, hapus riwayat, atau item hasil */
  results.addEventListener("click", (e) => {
    const chip = e.target.closest(".search-chip");
    if (chip) {
      const q = chip.dataset.query;
      input.value = q;
      saveSearchHistory(q);
      render();
      return;
    }
    if (e.target.closest("#clearHistory")) {
      clearSearchHistory();
      render();
      return;
    }
    if (e.target.closest(".search-item") && input.value.trim()) {
      saveSearchHistory(input.value);
    }
  });

  const open = () => {
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    input.value = "";
    render();
    input.focus();
  };

  const close = () => {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    btn.focus();
  };

  btn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  input.addEventListener("input", render);
  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    if (input.value.trim()) saveSearchHistory(input.value);
    const first = results.querySelector(".search-item");
    if (first) {
      e.preventDefault();
      window.location.href = first.getAttribute("href");
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) close();
  });
}

/* ---------- Newsletter (beranda) ---------- */
function initNewsletter() {
  const form = document.getElementById("newsletterForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const status = document.getElementById("formStatus");
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!valid) {
      if (status) {
        status.textContent = "Masukkan alamat email yang valid.";
        status.classList.add("invalid");
      }
      form.email.focus();
      return;
    }

    const subs = JSON.parse(localStorage.getItem("aurelle-subscribers") || "[]");
    if (!subs.includes(email)) {
      subs.push(email);
      localStorage.setItem("aurelle-subscribers", JSON.stringify(subs));
    }

    form.reset();
    if (status) {
      status.textContent = "Terima kasih! Cek emailmu untuk diskon 10%.";
      status.classList.remove("invalid");
    }
    showToast("Berhasil berlangganan newsletter");
  });
}

/* ---------- Announcement bar (bisa ditutup) ---------- */
function initAnnouncement() {
  const bar = document.querySelector(".announcement");
  if (!bar) return;

  if (localStorage.getItem("aurelle-announcement-closed") === "1") {
    bar.remove();
    return;
  }

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "announcement-close";
  closeBtn.setAttribute("aria-label", "Tutup pengumuman");
  closeBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>`;
  bar.appendChild(closeBtn);

  closeBtn.addEventListener("click", () => {
    localStorage.setItem("aurelle-announcement-closed", "1");
    bar.classList.add("closing");
    setTimeout(() => bar.remove(), 320);
  });
}

/* ---------- Tombol kembali ke atas ---------- */
function initBackToTop() {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "back-to-top";
  btn.setAttribute("aria-label", "Kembali ke atas");
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>`;
  document.body.appendChild(btn);

  const onScroll = () => btn.classList.toggle("show", window.scrollY > 600);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- Init bersama ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMenu();
  initNavbar();
  initActiveNav();
  initAnnouncement();
  initSearch();
  initCartButton();
  initWishlistNav();
  initWishlist();
  syncCartBadge();
  syncWishlistBadge();
  initSmoothScroll();
  initScrollSpy();
  initQuickAdd();
  initNewsletter();
  initBackToTop();
  initReveal();
});

/* ---------- Wishlist (event delegation) ---------- */
function initWishlist() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".wishlist-btn");
    if (!btn) return;

    e.preventDefault();

    const index = parseInt(btn.dataset.index, 10);
    if (isNaN(index)) return;

    const added = toggleWishlist(index);
    btn.classList.toggle("active", added);
    showToast(added ? "Ditambahkan ke wishlist" : "Dihapus dari wishlist");

    // Di halaman wishlist, render ulang agar item yang dihapus langsung hilang
    if (typeof refreshWishlistPage === "function") refreshWishlistPage();
  });
}

/* ---------- Tambah cepat dari kartu produk (ukuran & warna default) ---------- */
function initQuickAdd() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".quick-add");
    if (!btn) return;

    const index = parseInt(btn.dataset.index, 10);
    const item = PRODUCTS[index];
    if (!item) return;

    e.preventDefault();
    addToCart({
      id: index,
      name: item.name,
      size: item.sizes[0],
      color: item.colors[0].name,
      qty: 1,
      price: item.price,
    });

    // Umpan balik singkat pada tombol
    btn.classList.add("added");
    const label = btn.querySelector("span");
    if (label) label.textContent = "Ditambahkan";
    setTimeout(() => {
      btn.classList.remove("added");
      if (label) label.textContent = "Tambah";
    }, 1600);
  });
}

/* ---------- Kartu produk (markup bersama) ---------- */
function productCardHTML(product, index, opts = {}) {
  const wished = isInWishlist(index);
  const stars = "★".repeat(Math.round(product.rating)) + "☆".repeat(5 - Math.round(product.rating));
  const disc = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  const quickAdd = opts.quickAdd
    ? `
      <button
        type="button"
        class="quick-add"
        data-index="${index}"
        aria-label="Tambahkan ${product.name} ke keranjang (ukuran ${product.sizes[0]})"
        title="Tambah ke keranjang — ukuran ${product.sizes[0]}"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15" aria-hidden="true">
          <path d="M6 7h12l-1.2 12.2a1.5 1.5 0 0 1-1.5 1.3H8.7a1.5 1.5 0 0 1-1.5-1.3L6 7Z" />
          <path d="M9 10V6a3 3 0 0 1 6 0v4" />
        </svg>
        <span>Tambah</span>
      </button>`
    : "";
  return `
  <article class="product-card reveal">
    <div class="product-media-wrap">
      <a class="product-link" href="produk.html?id=${index}" aria-label="Lihat detail ${product.name}">
        <div class="product-media">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
          ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
        </div>
      </a>
      <button class="wishlist-btn${wished ? " active" : ""}" data-index="${index}" aria-label="Tambah ${product.name} ke wishlist">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="17" height="17">
          <path d="M19 14c1.5-1.5 2-3.2 2-4.8A4.7 4.7 0 0 0 12 6.6 4.7 4.7 0 0 0 3 9.2C3 10.8 3.5 12.5 5 14l7 7 7-7Z" />
        </svg>
      </button>
      ${quickAdd}
    </div>
    <div class="product-info">
      <p class="product-cat">${product.category}</p>
      <a class="product-name" href="produk.html?id=${index}">${product.name}</a>
      <div class="product-rating" aria-label="Rating ${product.rating} dari 5, ${product.sold} terjual">
        <span class="stars" aria-hidden="true">${stars}</span>
        <span>${product.rating.toLocaleString("id-ID")} · Terjual ${formatSold(product.sold)}</span>
      </div>
      <div class="product-price">
        <strong>${formatRupiah(product.price)}</strong>
        ${product.oldPrice ? `<span class="old">${formatRupiah(product.oldPrice)}</span>` : ""}
        ${disc > 0 && !(product.badge && product.badge.includes("%")) ? `<span class="disc">-${disc}%</span>` : ""}
      </div>
    </div>
  </article>`;
}


