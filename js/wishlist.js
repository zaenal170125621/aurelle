/* ==========================================================================
   AURELLE — Halaman wishlist (wishlist.html)
   Daftar produk favorit yang tersimpan di localStorage.
   ========================================================================== */

"use strict";

function renderWishlist() {
  const grid = document.getElementById("wishlistGrid");
  const countEl = document.getElementById("wishlistCount");
  const emptyEl = document.getElementById("wishlistEmpty");
  const addAllBtn = document.getElementById("addAllBtn");
  if (!grid) return;

  // Buang id produk yang sudah tidak ada di katalog
  const ids = getWishlist().filter((id) => PRODUCTS[id]);

  if (!ids.length) {
    grid.innerHTML = "";
    if (countEl) countEl.textContent = "";
    if (emptyEl) emptyEl.hidden = false;
    if (addAllBtn) addAllBtn.hidden = true;
    return;
  }

  grid.innerHTML = ids.map((id) => productCardHTML(PRODUCTS[id], id)).join("");
  if (countEl) countEl.textContent = ids.length + " produk tersimpan";
  if (emptyEl) emptyEl.hidden = true;
  if (addAllBtn) addAllBtn.hidden = false;
  initReveal();
}

function addAllToCart() {
  const ids = getWishlist().filter((id) => PRODUCTS[id]);
  ids.forEach((id) => {
    const p = PRODUCTS[id];
    addToCart({
      id,
      name: p.name,
      size: p.sizes[0],
      color: p.colors[0].name,
      qty: 1,
      price: p.price,
    });
  });
  showToast(ids.length + " produk ditambahkan ke keranjang");
}

/* Dipanggil site.js setiap kali wishlist berubah di halaman ini */
function refreshWishlistPage() {
  renderWishlist();
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderWishlist();
  document.getElementById("addAllBtn")?.addEventListener("click", addAllToCart);
});
