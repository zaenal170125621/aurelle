/* ==========================================================================
   AURELLE — Halaman checkout (checkout.html)
   Form alamat + ringkasan pesanan + validasi + pesan sukses.
   ========================================================================== */

"use strict";

function getCartItems() {
  return getCart().filter((item) => PRODUCTS[item.id]);
}

function calcTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const ongkir = subtotal >= FREE_ONGKIR_MIN ? 0 : ONGKIR_FLAT;
  return { subtotal, ongkir, total: subtotal + ongkir };
}

function clearCart() {
  try {
    localStorage.removeItem("aurelle-cart");
  } catch (e) {
    /* abaikan */
  }
}

/* ---------- Render ringkasan pesanan ---------- */
function renderSummary() {
  const items = getCartItems();
  const container = document.getElementById("summaryItems");
  const subtotalEl = document.getElementById("sSubtotal");
  const ongkirEl = document.getElementById("sOngkir");
  const totalEl = document.getElementById("sTotal");
  if (!container) return;

  const { subtotal, ongkir, total } = calcTotals(items);

  container.innerHTML = items
    .map((item) => {
      const product = PRODUCTS[item.id];
      return `
      <div class="summary-item">
        <img src="${product.image}" alt="${product.name}" />
        <div>
          <p class="si-name">${product.name}</p>
          <p class="si-meta">${item.size} · ${item.color} × ${item.qty}</p>
        </div>
        <span class="si-price">${formatRupiah(item.price * item.qty)}</span>
      </div>`;
    })
    .join("");

  if (subtotalEl) subtotalEl.textContent = formatRupiah(subtotal);
  if (ongkirEl) ongkirEl.textContent = ongkir === 0 ? "Gratis" : formatRupiah(ongkir);
  if (totalEl) totalEl.textContent = formatRupiah(total);
}

/* ---------- Tampilkan/hilangkan keranjang kosong ---------- */
function render() {
  const main = document.getElementById("checkoutMain");
  const emptyEl = document.getElementById("checkoutEmpty");
  if (!main || !emptyEl) return;

  const hasItems = getCartItems().length > 0;
  main.hidden = !hasItems;
  emptyEl.hidden = hasItems;
  if (hasItems) renderSummary();
}

/* ---------- Validasi form ---------- */
function setFieldError(id, message) {
  const field = document.getElementById(id);
  const err = document.getElementById("err-" + id);
  if (err) err.textContent = message || "";
  field?.classList.toggle("invalid", !!message);
}

function validate() {
  let ok = true;
  const value = (id) => (document.getElementById(id)?.value || "").trim();

  const nama = value("nama");
  const hp = value("hp");
  const email = value("email");
  const kodepos = value("kodepos");
  const alamat = value("alamat");
  const kota = value("kota");
  const provinsi = value("provinsi");

  if (!nama) {
    setFieldError("nama", "Nama wajib diisi");
    ok = false;
  } else {
    setFieldError("nama", "");
  }

  if (!hp) {
    setFieldError("hp", "Nomor HP wajib diisi");
    ok = false;
  } else if (!/^[0-9+\-\s]{9,20}$/.test(hp)) {
    setFieldError("hp", "Nomor HP tidak valid");
    ok = false;
  } else {
    setFieldError("hp", "");
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFieldError("email", "Format email tidak valid");
    ok = false;
  } else {
    setFieldError("email", "");
  }

  if (!/^\d{5}$/.test(kodepos)) {
    setFieldError("kodepos", "Kode pos harus 5 digit angka");
    ok = false;
  } else {
    setFieldError("kodepos", "");
  }

  if (alamat.length < 10) {
    setFieldError("alamat", "Tulis alamat lengkap (min. 10 karakter)");
    ok = false;
  } else {
    setFieldError("alamat", "");
  }

  if (!kota) {
    setFieldError("kota", "Kota wajib diisi");
    ok = false;
  } else {
    setFieldError("kota", "");
  }

  if (!provinsi) {
    setFieldError("provinsi", "Provinsi wajib diisi");
    ok = false;
  } else {
    setFieldError("provinsi", "");
  }

  return ok;
}

/* ---------- Submit: tampilkan pesan sukses & kosongkan keranjang ---------- */
function handleSubmit(e) {
  e.preventDefault();
  if (!validate()) {
    showToast("Lengkapi data yang bertanda *");
    return;
  }

  const payment =
    document.querySelector('input[name="payment"]:checked')?.value || "Transfer Bank";
  const kota = (document.getElementById("kota")?.value || "").trim();
  const provinsi = (document.getElementById("provinsi")?.value || "").trim();
  const { total } = calcTotals(getCartItems());
  const orderNo = "AU-" + Date.now().toString().slice(-8);

  const orderNoEl = document.getElementById("orderNo");
  const orderInfoEl = document.getElementById("orderInfo");
  if (orderNoEl) orderNoEl.textContent = orderNo;
  if (orderInfoEl) {
    orderInfoEl.textContent =
      "Total " +
      formatRupiah(total) +
      " · Pembayaran " +
      payment +
      " · Dikirim ke " +
      kota +
      ", " +
      provinsi +
      ".";
  }

  document.getElementById("checkoutMain").hidden = true;
  document.getElementById("orderSuccess").hidden = false;

  clearCart();
  syncCartBadge();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  render();
  document.getElementById("checkoutForm")?.addEventListener("submit", handleSubmit);
});
