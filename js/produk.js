/* ==========================================================================
   AURELLE — Halaman detail produk (produk.html?id=0..7)
   ========================================================================== */

"use strict";

const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id") || "0", 10);
const product = PRODUCTS[productId] || null;

let selectedSize = null;
let selectedColor = product ? product.colors[0].name : null;
let qty = 1;

/* ---------- Galeri multi-foto + zoom ---------- */
function galleryHTML() {
  if (!product) return "";

  /* Foto utama produk + 2 foto lain dari pool (URL terbukti muat) */
  const others = GALERI_POOL.filter((u) => u !== product.image);
  const shots = [
    product.image,
    others[productId % others.length],
    others[(productId + 1) % others.length],
  ];

  const toSrc = (u, w) => u.split("?")[0] + "?auto=format&fit=crop&w=" + w + "&q=85";
  const mainSrc = toSrc(shots[0], 1100);
  const thumbs = shots.map((u, i) => ({
    src: toSrc(u, 400),
    label: "Foto " + (i + 1),
  }));

  return `
    <div class="gallery-main">
      ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
      <img id="galleryMain" src="${mainSrc}" alt="${product.name}" />
    </div>
    <div class="detail-thumbs" id="detailThumbs">
      ${thumbs
        .map(
          (t, i) => `
        <button type="button" class="${i === 0 ? "active" : ""}" data-src="${t.src}" aria-label="${t.label}">
          <img src="${t.src}" alt="${t.label}" loading="lazy" />
        </button>`
        )
        .join("")}
    </div>`;
}

/* Zoom gambar utama (klik gambar -> tampil besar) */
function initZoom() {
  const main = document.getElementById("galleryMain");
  const modal = document.getElementById("zoomModal");
  const img = document.getElementById("zoomImg");
  if (!main || !modal || !img) return;

  main.addEventListener("click", () => {
    img.src = main.src.replace("w=1100", "w=1600");
    img.alt = main.alt;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  });

  const close = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };
  document.getElementById("zoomClose")?.addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) close();
  });
}

/* ---------- Info produk ---------- */
function infoHTML() {
  if (!product) return "";

  const filled = Math.round(product.rating);
  const stars = "★".repeat(filled) + "☆".repeat(5 - filled);
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  return `
    <p class="detail-cat">${product.category}</p>
    <h1 class="detail-name">${product.name}</h1>
    <div class="detail-rating">
      <span class="stars" aria-label="Rating ${product.rating} dari 5">${stars}</span>
      <span>${product.rating.toLocaleString("id-ID")} · Terjual ${formatSold(product.sold)} · ${getUlasanCount(productId).toLocaleString("id-ID")} ulasan</span>
    </div>
    <div class="detail-price">
      <strong>${formatRupiah(product.price)}</strong>
      ${product.oldPrice ? `<span class="old">${formatRupiah(product.oldPrice)}</span>` : ""}
      ${product.oldPrice ? `<span class="disc">HEMAT ${discount}%</span>` : ""}
    </div>
    <p class="detail-desc">${product.description}</p>

    <div class="option-group">
      <div class="option-head">
        <h4>Pilih Ukuran <span class="required">*</span></h4>
        <button type="button" class="size-guide-link" id="sizeGuideBtn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21.3 8.7 15.3 2.7a1 1 0 0 0-1.4 0L2.7 13.9a1 1 0 0 0 0 1.4l6 6a1 1 0 0 0 1.4 0l11.2-11.2a1 1 0 0 0 0-1.4Z" />
            <path d="m7.5 10.5 2 2M10.5 7.5l2 2M13.5 4.5l2 2" />
          </svg>
          Panduan Ukuran
        </button>
      </div>
      <div class="size-pills" id="sizePills">
        ${product.sizes.map((s) => `<button type="button" data-size="${s}">${s}</button>`).join("")}
      </div>
    </div>

    <div class="option-group">
      <h4>Pilih Warna</h4>
      <div class="swatches" id="swatches">
        ${product.colors
          .map(
            (c, i) => `
          <button
            type="button"
            class="swatch ${i === 0 ? "selected" : ""}"
            data-color="${c.name}"
            style="background:${c.hex}"
            aria-label="Warna ${c.name}"
            title="${c.name}"
          ></button>`
          )
          .join("")}
      </div>
    </div>

    <div class="qty-row">
      <div class="qty-stepper">
        <button type="button" id="qtyMinus" aria-label="Kurangi jumlah">−</button>
        <input id="qtyInput" type="number" value="1" min="1" max="10" readonly aria-label="Jumlah" />
        <button type="button" id="qtyPlus" aria-label="Tambah jumlah">+</button>
      </div>
      <span class="detail-note">Stok tersedia</span>
    </div>

    <div class="add-row">
      <button type="button" class="btn btn-dark" id="addToCartBtn">Tambahkan ke Keranjang</button>
      <button type="button" class="btn btn-ghost wishlist-detail" id="wishlistDetailBtn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="17" height="17">
          <path d="M19 14c1.5-1.5 2-3.2 2-4.8A4.7 4.7 0 0 0 12 6.6 4.7 4.7 0 0 0 3 9.2C3 10.8 3.5 12.5 5 14l7 7 7-7Z" />
        </svg>
        Wishlist
      </button>
      <button type="button" class="btn btn-ghost" id="shareBtn" title="Bagikan produk via WhatsApp">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="17" height="17">
          <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
          <path d="M12 3v13" />
          <path d="m7.5 8 4.5-4.5L16.5 8" />
        </svg>
        Bagikan
      </button>
    </div>

    <!-- Trust badges -->
    <div class="trust-badges">
      <span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 3 4 6v5c0 5 3.4 9.3 8 10 4.6-.7 8-5 8-10V6l-8-3Z" />
          <path d="m9 11.5 2.2 2.2 4-4.4" />
        </svg>
        100% Original
      </span>
      <span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        Retur 7 Hari
      </span>
      <span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M1 8h13v9H1z" />
          <path d="M14 11h4l4 3v3h-8z" />
          <circle cx="5.5" cy="18.5" r="2" />
          <circle cx="17.5" cy="18.5" r="2" />
        </svg>
        Kirim Cepat
      </span>
    </div>

    <div class="detail-blocks">
      <details open>
        <summary>Deskripsi Produk</summary>
        <p>${product.description}</p>
      </details>
      <details>
        <summary>Bahan &amp; Perawatan</summary>
        <p><strong>Bahan:</strong> ${product.bahan}<br /><strong>Perawatan:</strong> ${product.perawatan}</p>
      </details>
      <details>
        <summary>Pengiriman &amp; Retur</summary>
        <p>Pesanan diproses dalam 1–2 hari kerja. Gratis ongkir untuk pembelian min. Rp150.000. Retur atau tukar ukuran tersedia dalam 7 hari sejak barang diterima.</p>
      </details>
    </div>`;
}

/* ---------- Pesan produk tidak ditemukan ---------- */
function notFoundHTML() {
  return `
    <div class="not-found">
      <p class="eyebrow">Produk Tidak Ditemukan</p>
      <h1 class="detail-name">Halaman ini tidak tersedia</h1>
      <p>Produk yang kamu cari mungkin sudah tidak ada di katalog.</p>
      <a class="btn btn-dark" href="index.html">Kembali ke Beranda</a>
    </div>`;
}

/* ---------- Rekomendasi "Kamu Mungkin Suka" ---------- */
/* Kategori bisa berupa gabungan (mis. "Wanita · Pria"), jadi cocokkan per label */
function shareCategory(a, b) {
  const catsA = a.split("·").map((s) => s.trim());
  const catsB = b.split("·").map((s) => s.trim());
  return catsA.some((c) => catsB.includes(c));
}

function renderRecommendations() {
  const grid = document.getElementById("recommendGrid");
  if (!grid || !product) return;

  const others = PRODUCTS.map((p, i) => ({ p, i })).filter((x) => x.i !== productId);
  const byBestSeller = (a, b) => b.p.sold - a.p.sold;

  // Prioritas 1: produk sekategori (terlaris dulu), prioritas 2: sisanya
  const sameCategory = others.filter((x) => shareCategory(x.p.category, product.category)).sort(byBestSeller);
  const rest = others.filter((x) => !shareCategory(x.p.category, product.category)).sort(byBestSeller);
  const picks = [...sameCategory, ...rest].slice(0, 4);

  grid.innerHTML = picks.map((x) => productCardHTML(x.p, x.i, { quickAdd: true })).join("");
  initReveal();
}

/* ---------- Kontrol: galeri, ukuran, warna, jumlah, keranjang ---------- */
function initControls() {
  // Ganti gambar utama
  document.getElementById("detailThumbs")?.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    document.querySelectorAll("#detailThumbs button").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("galleryMain").src = btn.dataset.src;
  });

  // Pilih ukuran
  document.getElementById("sizePills")?.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    document.querySelectorAll("#sizePills button").forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedSize = btn.dataset.size;
  });

  // Pilih warna
  document.getElementById("swatches")?.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    document.querySelectorAll("#swatches button").forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedColor = btn.dataset.color;
  });

  // Jumlah
  const qtyInput = document.getElementById("qtyInput");
  const updateQty = (delta) => {
    qty = Math.min(10, Math.max(1, qty + delta));
    if (qtyInput) qtyInput.value = qty;
  };
  document.getElementById("qtyMinus")?.addEventListener("click", () => updateQty(-1));
  document.getElementById("qtyPlus")?.addEventListener("click", () => updateQty(1));

  // Tambah ke keranjang
  document.getElementById("addToCartBtn")?.addEventListener("click", () => {
    if (!selectedSize) {
      showToast("Pilih ukuran terlebih dahulu");
      return;
    }
    addToCart({
      id: productId,
      name: product.name,
      size: selectedSize,
      color: selectedColor,
      qty,
      price: product.price,
    });

    const btn = document.getElementById("addToCartBtn");
    btn.textContent = "Berhasil Ditambahkan";
    setTimeout(() => {
      btn.textContent = "Tambahkan ke Keranjang";
    }, 1600);
  });

  // Bagikan produk via WhatsApp (alur pesanan toko juga lewat WA)
  document.getElementById("shareBtn")?.addEventListener("click", () => {
    const msg =
      `Cek ${product.name} di AURELLE — ${formatRupiah(product.price)}` +
      "\n" + window.location.href;
    window.open("https://wa.me/?text=" + encodeURIComponent(msg), "_blank", "noopener");
  });

  // Wishlist halaman detail (tersimpan di localStorage)
  const wlBtn = document.getElementById("wishlistDetailBtn");
  if (wlBtn) {
    wlBtn.classList.toggle("active", isInWishlist(productId));
    wlBtn.addEventListener("click", () => {
      const added = toggleWishlist(productId);
      wlBtn.classList.toggle("active", added);
      showToast(added ? "Ditambahkan ke wishlist" : "Dihapus dari wishlist");
    });
  }
}

/* ---------- Render halaman ---------- */
function renderDetail() {
  const gallery = document.getElementById("gallery");
  const info = document.getElementById("detailInfo");
  const breadcrumbCurrent = document.getElementById("breadcrumbCurrent");
  const relatedSection = document.getElementById("recommendSection");

  if (!product) {
    document.title = "Produk tidak ditemukan — AURELLE";
    if (gallery) gallery.innerHTML = "";
    if (info) info.innerHTML = notFoundHTML();
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = "Tidak ditemukan";
    if (relatedSection) relatedSection.hidden = true;
    return;
  }

  document.title = product.name + " — AURELLE";
  if (gallery) gallery.innerHTML = galleryHTML();
  if (info) info.innerHTML = infoHTML();
  if (breadcrumbCurrent) breadcrumbCurrent.textContent = product.name;
}

/* ---------- Modal panduan ukuran ---------- */
function initSizeGuide() {
  const modal = document.getElementById("sizeGuideModal");
  const btn = document.getElementById("sizeGuideBtn");
  const close = document.getElementById("sizeGuideClose");
  if (!modal || !btn) return;

  // Produk One Size: sembunyikan tabel, tampilkan catatan
  if (product && product.sizes.length === 1) {
    const table = document.getElementById("sizeGuideTable");
    const note = document.getElementById("sizeGuideNote");
    if (table) table.hidden = true;
    if (note) note.hidden = false;
  }

  const open = () => {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    close?.focus();
  };

  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    btn.focus();
  };

  btn.addEventListener("click", open);
  close?.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });
}

/* ---------- Ulasan produk (seed + ulasan pengguna di localStorage) ---------- */
const ULASAN_KEY = "aurelle-ulasan";
const ULASAN_NAMA_KEY = "aurelle-ulasan-nama";

function getUserUlasan(id) {
  try {
    return JSON.parse(localStorage.getItem(ULASAN_KEY) || "{}")[id] || [];
  } catch (e) {
    return [];
  }
}

function saveUserUlasan(id, ulasan) {
  try {
    const all = JSON.parse(localStorage.getItem(ULASAN_KEY) || "{}");
    all[id] = [...(all[id] || []), ulasan];
    localStorage.setItem(ULASAN_KEY, JSON.stringify(all));
  } catch (e) {
    /* abaikan */
  }
}

/* Ulasan yang ditampilkan: punya pengguna (terbaru) + seed produk */
function getUlasan(id) {
  return getUserUlasan(id).concat(ULASAN_SEED.filter((u) => u.id === id));
}

/* Jumlah ulasan = angka awal produk + ulasan pengguna */
function getUlasanCount(id) {
  return (PRODUCTS[id]?.reviews || 0) + getUserUlasan(id).length;
}

/* Pernahkah pembeli ini membeli produk (pesanan Selesai di perangkat ini)? */
function hasBoughtProduct(id) {
  try {
    const orders = JSON.parse(localStorage.getItem("aurelle-orders") || "[]");
    return orders.some(
      (o) =>
        o.status === "Selesai" &&
        Array.isArray(o.items) &&
        o.items.some((it) => Number(it.id) === Number(id))
    );
  } catch (e) {
    return false;
  }
}

function formatUlasanWaktu(value) {
  const d = new Date(value);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ulasanHTML() {
  if (!product) return "";
  const all = getUlasan(productId);
  const avg = all.length ? all.reduce((s, u) => s + u.rating, 0) / all.length : 0;
  const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);
  let namaTersimpan = "";
  try {
    namaTersimpan = localStorage.getItem(ULASAN_NAMA_KEY) || "";
  } catch (e) {
    /* abaikan */
  }

  return `
    <section class="ulasan-section reveal">
      <div class="ulasan-head">
        <h3>Ulasan <em>Pembeli</em></h3>
        <div class="ulasan-score">
          <span class="stars" aria-hidden="true">${stars(Math.round(avg))}</span>
          <strong>${avg ? avg.toFixed(1) : "—"}</strong>
          <small>${getUlasanCount(productId).toLocaleString("id-ID")} ulasan</small>
        </div>
      </div>

      <div class="ulasan-list">
        ${all
          .map(
            (u) => `
        <article class="ulasan-item">
          <div class="ulasan-avatar" aria-hidden="true">${u.nama.charAt(0).toUpperCase()}</div>
          <div class="ulasan-body">
            <div class="ulasan-meta">
              <strong>${u.nama}</strong>
              ${u.verified ? `<span class="verified-badge">✓ Pembelian terverifikasi</span>` : ""}
              <span class="stars" aria-label="Rating ${u.rating} dari 5">${stars(u.rating)}</span>
            </div>
            <p>${u.komentar}</p>
            <small>${formatUlasanWaktu(u.waktu)}</small>
          </div>
        </article>`
          )
          .join("")}
      </div>

      <form class="ulasan-form" id="ulasanForm" novalidate>
        <h4>Tulis Ulasanmu</h4>
        <div class="star-picker" role="radiogroup" aria-label="Rating produk">
          ${[5, 4, 3, 2, 1]
            .map(
              (n) => `<label>
                <input type="radio" name="rating" value="${n}" ${n === 5 ? "checked" : ""} />
                <span class="star" aria-hidden="true">★</span>
              </label>`
            )
            .join("")}
        </div>
        <textarea id="ulasanKomentar" rows="3" placeholder="Ceritakan pengalamanmu memakai produk ini..." aria-label="Isi ulasan" required></textarea>
        <div class="ulasan-form-row">
          <input id="ulasanNama" type="text" placeholder="Nama kamu" value="${namaTersimpan}" aria-label="Nama kamu" required />
          <button type="submit" class="btn btn-dark">Kirim Ulasan</button>
        </div>
        <p class="form-status" id="ulasanStatus" role="status" aria-live="polite"></p>
      </form>
    </section>`;
}

function initUlasan() {
  const section = document.getElementById("ulasanSection");
  if (!section || !product) return;
  section.innerHTML = ulasanHTML();
  initReveal();

  document.getElementById("ulasanForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const rating = Number(document.querySelector('input[name="rating"]:checked')?.value || 0);
    const komentar = document.getElementById("ulasanKomentar")?.value.trim() || "";
    const nama = document.getElementById("ulasanNama")?.value.trim() || "";
    const status = document.getElementById("ulasanStatus");

    if (!rating) {
      if (status) status.textContent = "Pilih rating dulu ya.";
      return;
    }
    if (komentar.length < 10) {
      if (status) status.textContent = "Tulis komentar minimal 10 karakter.";
      return;
    }
    if (!nama) {
      if (status) status.textContent = "Isi nama kamu.";
      return;
    }

    saveUserUlasan(productId, {
      nama,
      rating,
      komentar,
      waktu: new Date().toISOString(),
      verified: hasBoughtProduct(productId),
    });
    try {
      localStorage.setItem(ULASAN_NAMA_KEY, nama);
    } catch (err) {
      /* abaikan */
    }

    showToast("Terima kasih! Ulasanmu sudah terkirim 💛");
    initUlasan();

    /* Sinkronkan angka ulasan di baris rating atas */
    const ratingLine = document.querySelector(".detail-rating span:last-child");
    if (ratingLine) {
      const parts = ratingLine.textContent.split(" · ");
      parts[2] = getUlasanCount(productId).toLocaleString("id-ID") + " ulasan";
      ratingLine.textContent = parts.join(" · ");
    }
  });
}

/* ---------- Sticky bar beli (mobile) ---------- */
function initStickyBar() {
  const bar = document.getElementById("stickyBar");
  const priceEl = document.getElementById("stickyPrice");
  if (!bar || !product) return;
  if (priceEl) priceEl.textContent = formatRupiah(product.price);

  const onScroll = () => {
    const addRow = document.getElementById("addToCartBtn");
    if (!addRow) return;
    const show = addRow.getBoundingClientRect().top < 0;
    bar.classList.toggle("show", show);
    bar.setAttribute("aria-hidden", String(!show));
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  const tambahKeKeranjang = () => {
    if (!selectedSize) {
      showToast("Pilih ukuran terlebih dahulu");
      return false;
    }
    addToCart({
      id: productId,
      name: product.name,
      size: selectedSize,
      color: selectedColor,
      qty,
      price: product.price,
    });
    return true;
  };

  document.getElementById("stickyAdd")?.addEventListener("click", () => {
    if (tambahKeKeranjang()) showToast("Ditambahkan ke keranjang 🛍️");
  });

  document.getElementById("stickyBuy")?.addEventListener("click", () => {
    if (tambahKeKeranjang()) window.location.href = "checkout.html";
  });
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderDetail();
  renderRecommendations();
  initControls();
  initSizeGuide();
  initStickyBar();
  initZoom();
  initUlasan();
});
