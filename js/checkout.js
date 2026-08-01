/* ==========================================================================
   AURELLE — Halaman checkout (checkout.html)
   Form alamat + ringkasan pesanan + validasi + pesan sukses.
   ========================================================================== */

"use strict";

/* Buku alamat tersimpan (localStorage) */
const ADDRESS_KEY = "aurelle-alamat";

let activeVoucher = null;

function getCartItems() {
  return getCart().filter((item) => PRODUCTS[item.id]);
}

/* Potongan dari voucher (persen / nominal), dikunci di bawah min. belanja */
function hitungDiskon(voucher, subtotal) {
  if (!voucher || subtotal < voucher.minBelanja) return 0;
  const diskon = voucher.tipe === "persen" ? (subtotal * voucher.nilai) / 100 : voucher.nilai;
  return Math.min(diskon, subtotal);
}

function calcTotals(items, voucher) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const diskon = voucher ? hitungDiskon(voucher, subtotal) : 0;
  const ongkir = subtotal >= FREE_ONGKIR_MIN ? 0 : ONGKIR_FLAT;
  return { subtotal, diskon, ongkir, total: subtotal - diskon + ongkir };
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
  const diskonEl = document.getElementById("sDiskon");
  const voucherRow = document.getElementById("voucherRow");
  const voucherName = document.getElementById("voucherName");
  if (!container) return;

  const { subtotal, diskon, ongkir, total } = calcTotals(items, activeVoucher);

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
  if (voucherRow) voucherRow.hidden = !(diskon > 0);
  if (diskonEl) diskonEl.textContent = "−" + formatRupiah(diskon);
  if (voucherName && activeVoucher) voucherName.textContent = activeVoucher.kode;
  renderVouchers();
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

/* ---------- Voucher / kode promo ---------- */
function renderVouchers() {
  const list = document.getElementById("voucherList");
  if (!list) return;
  list.innerHTML = VOUCHERS.map((v) => {
    const active = activeVoucher && activeVoucher.kode === v.kode;
    return `
    <button type="button" class="voucher-chip${active ? " active" : ""}" data-kode="${v.kode}" title="${v.deskripsi}">
      <strong>${v.kode}</strong>
      <span>${v.deskripsi}</span>
    </button>`;
  }).join("");
}

function applyVoucher(kode) {
  const status = document.getElementById("voucherStatus");
  const code = (kode || "").trim().toUpperCase();
  const voucher = VOUCHERS.find((v) => v.kode === code);
  if (!voucher) {
    if (status) {
      status.textContent = "Kode voucher tidak dikenal.";
      status.classList.add("invalid");
    }
    return;
  }
  const { subtotal } = calcTotals(getCartItems(), null);
  if (subtotal < voucher.minBelanja) {
    if (status) {
      status.textContent = `Min. belanja ${formatRupiah(voucher.minBelanja)} untuk memakai ${voucher.kode}.`;
      status.classList.add("invalid");
    }
    return;
  }
  activeVoucher = voucher;
  if (status) {
    status.textContent = "";
    status.classList.remove("invalid");
  }
  renderSummary();
  showToast("Voucher " + voucher.kode + " dipakai 🎟️");
}

function removeVoucher() {
  activeVoucher = null;
  const status = document.getElementById("voucherStatus");
  if (status) {
    status.textContent = "";
    status.classList.remove("invalid");
  }
  renderSummary();
}

function initVoucher() {
  const applyBtn = document.getElementById("voucherApply");
  const input = document.getElementById("voucherInput");
  applyBtn?.addEventListener("click", () => applyVoucher(input?.value || ""));
  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyVoucher(input.value);
    }
  });
  document.getElementById("voucherList")?.addEventListener("click", (e) => {
    const chip = e.target.closest(".voucher-chip");
    if (chip) applyVoucher(chip.dataset.kode);
  });
  document.getElementById("voucherRemove")?.addEventListener("click", removeVoucher);
}

/* ---------- Buku alamat tersimpan ---------- */
function getAlamat() {
  try {
    return JSON.parse(localStorage.getItem(ADDRESS_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function saveAlamat(entry) {
  const list = getAlamat();
  const idx = list.findIndex((a) => a.alamat === entry.alamat && a.kota === entry.kota);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...entry };
  } else {
    list.push(entry);
  }
  if (!list.some((a) => a.isDefault)) list[list.length - 1].isDefault = true;
  localStorage.setItem(ADDRESS_KEY, JSON.stringify(list));
}

function fillForm(addr) {
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.value = value || "";
  };
  set("nama", addr.nama);
  set("hp", addr.hp);
  set("email", addr.email);
  set("kodepos", addr.kodepos);
  set("alamat", addr.alamat);
  set("kota", addr.kota);
  set("provinsi", addr.provinsi);
  set("catatan", addr.catatan);
}

function initAddressBook() {
  const select = document.getElementById("alamatList");
  if (!select) return;

  const list = getAlamat();
  select.innerHTML =
    `<option value="">— Pilih alamat tersimpan —</option>` +
    list
      .map(
        (a, i) =>
          `<option value="${i}"${a.isDefault ? " selected" : ""}>${a.nama} · ${a.kota}${a.isDefault ? " (utama)" : ""}</option>`
      )
      .join("");

  // Isi otomatis dengan alamat utama jika ada
  if (list.length) {
    const def = list.findIndex((a) => a.isDefault);
    fillForm(list[def >= 0 ? def : 0]);
  }

  select.addEventListener("change", () => {
    const idx = parseInt(select.value, 10);
    if (!isNaN(idx) && list[idx]) fillForm(list[idx]);
  });
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

/* ---------- Submit: buka WhatsApp & tampilkan pesan sukses ---------- */
function handleSubmit(e) {
  e.preventDefault();
  if (!validate()) {
    showToast("Lengkapi data yang bertanda *");
    return;
  }

  const value = (id) => (document.getElementById(id)?.value || "").trim();
  const nama = value("nama");
  const hp = value("hp");
  const email = value("email");
  const kodepos = value("kodepos");
  const alamat = value("alamat");
  const kota = value("kota");
  const provinsi = value("provinsi");
  const payment =
    document.querySelector('input[name="payment"]:checked')?.value || "Transfer Bank";
  const items = getCartItems();
  const { subtotal, diskon, ongkir, total } = calcTotals(items, activeVoucher);
  const orderNo = "AU-" + Date.now().toString().slice(-8);

  /* Simpan pesanan ke localStorage (Fase 0) agar bisa dikelola admin
     dan dicek lewat halaman Cek Pesanan */
  const order = {
    id: orderNo,
    tanggal: new Date().toISOString(),
    nama,
    hp,
    email: email || "",
    alamat: alamat + ", " + kota + ", " + provinsi + " " + kodepos,
    kota,
    provinsi,
    kodepos,
    catatan: value("catatan"),
    payment,
    items: items.map((item) => {
      const p = PRODUCTS[item.id];
      return {
        id: item.id,
        nama: p.name,
        size: item.size,
        warna: item.color,
        qty: item.qty,
        harga: item.price,
      };
    }),
    subtotal,
    diskon,
    ongkir,
    total,
    voucher: activeVoucher ? activeVoucher.kode : null,
    poin: Math.floor(total / 1000),
    batasBayar: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: "Menunggu",
    resi: "",
    timeline: [
      {
        status: "Menunggu",
        waktu: new Date().toISOString(),
        catatan: timelineNote("Menunggu"),
      },
    ],
  };
  saveOrder(order);

  /* Ringkasan pesanan untuk dikirim via WhatsApp */
  const lines = items
    .map((item, i) => {
      const p = PRODUCTS[item.id];
      return `${i + 1}. ${p.name} (${item.size} · ${item.color}) x${item.qty} = ${formatRupiah(item.price * item.qty)}`;
    })
    .join("\n");

  const message = [
    "Halo AURELLE! Saya mau pesan:",
    "",
    lines,
    "",
    `Subtotal: ${formatRupiah(subtotal)}`,
    `Ongkir: ${ongkir === 0 ? "Gratis" : formatRupiah(ongkir)}`,
    diskon > 0 ? `Voucher ${activeVoucher.kode}: -${formatRupiah(diskon)}` : "",
    `TOTAL: ${formatRupiah(total)}`,
    "",
    `Nama: ${nama}`,
    `No. HP: ${hp}`,
    email ? `Email: ${email}` : "",
    `Alamat: ${alamat}, ${kota}, ${provinsi} ${kodepos}`,
    `Pembayaran: ${payment}`,
    "",
    `No. Order: ${orderNo}`,
  ]
    .filter(Boolean)
    .join("\n");

  const waLink =
    "https://wa.me/6285939592558?text=" + encodeURIComponent(message);
  window.open(waLink, "_blank");

  const orderNoEl = document.getElementById("orderNo");
  const orderInfoEl = document.getElementById("orderInfo");
  const waOrderLink = document.getElementById("waOrderLink");
  if (orderNoEl) orderNoEl.textContent = orderNo;
  if (waOrderLink) waOrderLink.href = waLink;
  if (orderInfoEl) {
    orderInfoEl.textContent =
      "Total " +
      formatRupiah(total) +
      (diskon > 0 ? " (sudah dipotong voucher " + activeVoucher.kode + ")" : "") +
      " · Pembayaran " +
      payment +
      " · Dikirim ke " +
      kota +
      ", " +
      provinsi +
      " · +" +
      Math.floor(total / 1000) +
      " poin AURELLE";
  }

  /* Countdown batas pembayaran (24 jam) */
  const countdownEl = document.getElementById("payCountdown");
  if (countdownEl) startCountdown(countdownEl, order.batasBayar);

  /* Simpan alamat ke buku alamat jika dicentang */
  if (document.getElementById("simpanAlamat")?.checked) {
    saveAlamat({
      nama,
      hp,
      email,
      kodepos,
      alamat,
      kota,
      provinsi,
      catatan: value("catatan"),
    });
  }

  document.getElementById("checkoutMain").hidden = true;
  document.getElementById("orderSuccess").hidden = false;

  clearCart();
  syncCartBadge();
  if (typeof animatedScrollTo === "function") animatedScrollTo(0);
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  render();
  initVoucher();
  initAddressBook();
  document.getElementById("checkoutForm")?.addEventListener("submit", handleSubmit);
});
