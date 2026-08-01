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

/* ---------- Galeri ---------- */
function galleryHTML() {
  if (!product) return "";

  const base = product.image.split("?")[0];
  const mainSrc = base + "?auto=format&fit=crop&w=1100&q=85";
  const thumbs = [
    { src: base + "?auto=format&fit=crop&w=400&h=400&q=80", label: "Tampilan utama" },
    { src: base + "?auto=format&fit=crop&w=400&h=400&q=80&crop=top", label: "Detail bagian atas" },
    { src: base + "?auto=format&fit=crop&w=400&h=400&q=80&crop=bottom", label: "Detail bagian bawah" },
  ];

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
      <span>${product.rating.toLocaleString("id-ID")} · ${product.sold.toLocaleString("id-ID")} terjual</span>
    </div>
    <div class="detail-price">
      <strong>${formatRupiah(product.price)}</strong>
      ${product.oldPrice ? `<span class="old">${formatRupiah(product.oldPrice)}</span>` : ""}
      ${product.oldPrice ? `<span class="disc">HEMAT ${discount}%</span>` : ""}
    </div>
    <p class="detail-desc">${product.description}</p>

    <div class="option-group">
      <h4>Pilih Ukuran <span class="required">*</span></h4>
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

/* ---------- Produk terkait ---------- */
function renderRelated() {
  const grid = document.getElementById("relatedGrid");
  if (!grid || !product) return;

  const others = PRODUCTS.map((p, i) => ({ p, i })).filter((x) => x.i !== productId);
  const sameCategory = others.filter((x) => x.p.category === product.category);
  const rest = others.filter((x) => x.p.category !== product.category);
  const related = [...sameCategory, ...rest].slice(0, 4);

  grid.innerHTML = related.map((x) => productCardHTML(x.p, x.i)).join("");
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
  const relatedSection = document.getElementById("relatedSection");

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

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderDetail();
  renderRelated();
  initControls();
});
