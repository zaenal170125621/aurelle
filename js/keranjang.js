/* ==========================================================================
   AURELLE — Halaman keranjang (keranjang.html)
   Lihat item, ubah jumlah, hapus item, hitung total & gratis ongkir.
   ========================================================================== */

"use strict";

function saveCart(cart) {
  try {
    localStorage.setItem("aurelle-cart", JSON.stringify(cart));
  } catch (e) {
    /* localStorage tidak tersedia — abaikan */
  }
}

/* ---------- Status keranjang kosong ---------- */
function emptyCartHTML() {
  return `
    <div class="cart-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 7h12l-1.2 12.2a1.5 1.5 0 0 1-1.5 1.3H8.7a1.5 1.5 0 0 1-1.5-1.3L6 7Z" />
        <path d="M9 10V6a3 3 0 0 1 6 0v4" />
      </svg>
      <h2>Keranjangmu masih kosong</h2>
      <p>Belum ada produk di keranjang. Yuk, mulai pilih pakaian estetik favoritmu.</p>
      <a href="index.html#koleksi" class="btn btn-dark">Mulai Belanja</a>
    </div>`;
}

/* ---------- Info gratis ongkir ---------- */
function shippingProgressHTML(freeShipping, remaining, progress) {
  return `
    <div class="shipping-progress">
      ${freeShipping
        ? "<p>Selamat, kamu mendapatkan <strong>gratis ongkir</strong> untuk pesanan ini.</p>"
        : "<p>Belanja <strong>" + formatRupiah(remaining) + "</strong> lagi untuk gratis ongkir.</p>"}
      <div class="shipping-bar"><span style="width:${progress}%"></span></div>
    </div>`;
}

/* ---------- Render isi keranjang ---------- */
function renderCart() {
  const content = document.getElementById("cartContent");
  if (!content) return;

  // Buang item yang produknya sudah tidak ada di katalog
  const cart = getCart().filter((item) => PRODUCTS[item.id]);
  if (!cart.length) {
    content.innerHTML = emptyCartHTML();
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const freeShipping = subtotal >= FREE_ONGKIR_MIN;
  const ongkir = freeShipping ? 0 : ONGKIR_FLAT;
  const total = subtotal + ongkir;
  const remaining = FREE_ONGKIR_MIN - subtotal;
  const progress = Math.min(100, Math.round((subtotal / FREE_ONGKIR_MIN) * 100));

  const itemsHTML = cart
    .map((item, index) => {
      const product = PRODUCTS[item.id];
      return `
      <div class="cart-item">
        <a class="cart-item-img" href="produk.html?id=${item.id}">
          <img src="${product.image}" alt="${product.name}" />
        </a>
        <div class="cart-item-info">
          <a class="cart-item-name" href="produk.html?id=${item.id}">${product.name}</a>
          <p class="cart-item-meta">Ukuran ${item.size}${item.color ? " · Warna " + item.color : ""}</p>
          <p class="cart-item-price">${formatRupiah(item.price)}</p>
          <div class="cart-item-controls">
            <div class="qty-stepper small">
              <button type="button" data-cart-action="minus" data-index="${index}" aria-label="Kurangi jumlah">−</button>
              <input value="${item.qty}" readonly aria-label="Jumlah" />
              <button type="button" data-cart-action="plus" data-index="${index}" aria-label="Tambah jumlah">+</button>
            </div>
            <button type="button" class="cart-remove" data-cart-action="remove" data-index="${index}">Hapus</button>
          </div>
        </div>
        <div class="cart-item-subtotal">${formatRupiah(item.price * item.qty)}</div>
      </div>`;
    })
    .join("");

  content.innerHTML = `
    ${shippingProgressHTML(freeShipping, remaining, progress)}
    <div class="cart-layout">
      <div class="cart-items">
        <div class="cart-items-head">
          <h2>Daftar Belanja (${cart.length})</h2>
          <button type="button" class="link-btn" data-cart-action="clear">Hapus Semua</button>
        </div>
        ${itemsHTML}
      </div>
      <aside class="cart-summary">
        <h3>Ringkasan Pesanan</h3>
        <div class="summary-row">
          <span>Subtotal (${cart.length} item)</span>
          <strong>${formatRupiah(subtotal)}</strong>
        </div>
        <div class="summary-row">
          <span>Ongkir</span>
          <strong>${freeShipping ? "Gratis" : formatRupiah(ongkir)}</strong>
        </div>
        <div class="summary-row total">
          <span>Total</span>
          <strong>${formatRupiah(total)}</strong>
        </div>
        <button type="button" class="btn btn-dark" data-cart-action="checkout">Lanjut ke Checkout</button>
        <a href="index.html#koleksi" class="btn btn-ghost">Lanjut Belanja</a>
      </aside>
    </div>`;
}

/* ---------- Aksi: ubah jumlah, hapus, kosongkan, checkout ---------- */
function initCartActions() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cart-action]");
    if (!btn) return;

    const action = btn.dataset.cartAction;
    const cart = getCart().filter((item) => PRODUCTS[item.id]);

    if (action === "checkout") {
      window.location.href = "checkout.html";
      return;
    }

    if (action === "clear") {
      saveCart([]);
      syncCartBadge();
      renderCart();
      showToast("Keranjang dikosongkan");
      return;
    }

    const index = parseInt(btn.dataset.index, 10);
    if (isNaN(index) || !cart[index]) return;

    if (action === "minus" && cart[index].qty > 1) cart[index].qty -= 1;
    if (action === "plus" && cart[index].qty < 10) cart[index].qty += 1;
    if (action === "remove") {
      cart.splice(index, 1);
      showToast("Item dihapus dari keranjang");
    }

    saveCart(cart);
    syncCartBadge();
    renderCart();
  });
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  initCartActions();
});
