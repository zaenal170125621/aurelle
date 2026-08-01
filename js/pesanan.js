/* ==========================================================================
   AURELLE — Pesanan Saya (pesanan.html)
   Terinspirasi halaman "Pembelian" Shopee: tab status, pencarian, kartu
   pesanan berisi item + total, aksi kontekstual, dan detail yang bisa dibuka.
   Data: pesanan contoh (mock) + pesanan nyata dari checkout (localStorage).
   ========================================================================== */

"use strict";

const PURCHASE_TABS = ["Semua", "Menunggu", "Diproses", "Dikirim", "Selesai"];

let activeTab = "Semua";
let searchQuery = "";

/* Semua pesanan diurutkan terbaru dulu */
function getAllOrdersSorted() {
  return getAllOrders()
    .slice()
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
}

/* ---------- Bantuan ---------- */
function badgeFor(status) {
  const map = {
    Menunggu: "badge-muted",
    Diproses: "badge-terracotta",
    Dikirim: "badge-ink",
    Selesai: "badge-sage",
  };
  return `<span class="admin-badge ${map[status] || "badge-muted"}">${status}</span>`;
}

function chatUrl(order) {
  return (
    "https://wa.me/6285939592558?text=" +
    encodeURIComponent("Halo AURELLE! Saya mau tanya soal pesanan #" + order.id)
  );
}

/* Pesan pembayaran via WhatsApp (pesanan nyata ikut rangkuman item) */
function payUrl(order) {
  const lines = ["Halo AURELLE! Saya akan menyelesaikan pembayaran pesanan #" + order.id + ":"];
  if (Array.isArray(order.items) && order.items.length) {
    order.items.forEach((it) => {
      lines.push("- " + it.nama + " (" + (it.size || "-") + " · " + (it.warna || "-") + ") x" + it.qty);
    });
    lines.push("Total: " + formatRupiah(order.total));
    lines.push("Mohon info instruksi pembayarannya ya.");
  } else {
    lines.push("Mohon info instruksi pembayarannya ya.");
  }
  return "https://wa.me/6285939592558?text=" + encodeURIComponent(lines.join("\n"));
}

/* ---------- Baris item ---------- */
function orderItemsHTML(order) {
  const items = Array.isArray(order.items) && order.items.length ? order.items : null;
  if (!items) {
    return `
    <div class="order-item">
      <span class="order-item-thumb order-item-thumb--placeholder" aria-hidden="true">A</span>
      <div class="order-item-info">
        <p class="order-item-name">Produk AURELLE</p>
        <p class="order-item-meta">${order.item || 0} produk dalam pesanan ini</p>
      </div>
    </div>`;
  }
  return items
    .map((it) => {
      const p = PRODUCTS[it.id];
      const thumb = p
        ? `<a class="order-item-thumb" href="produk.html?id=${it.id}" aria-label="${it.nama}">
            <img src="${p.image}" alt="${it.nama}" loading="lazy" />
          </a>`
        : `<span class="order-item-thumb order-item-thumb--placeholder" aria-hidden="true">A</span>`;
      return `
    <div class="order-item">
      ${thumb}
      <div class="order-item-info">
        <a class="order-item-name" href="${p ? "produk.html?id=" + it.id : "#"}">${it.nama}</a>
        <p class="order-item-meta">Ukuran ${it.size || "-"}${it.warna ? " · Warna " + it.warna : ""} × ${it.qty}</p>
      </div>
      <div class="order-item-price">
        <strong>${formatRupiah(it.harga * it.qty)}</strong>
        <small>${formatRupiah(it.harga)} × ${it.qty}</small>
      </div>
    </div>`;
    })
    .join("");
}

/* ---------- Aksi kontekstual per status ---------- */
function actionsHTML(order) {
  const isReal = Array.isArray(order.timeline) && order.timeline.length > 0;
  const hasItems = Array.isArray(order.items) && order.items.length > 0;
  const btns = [];

  if (order.status === "Menunggu") {
    btns.push(`<a class="btn btn-dark btn-sm" href="${payUrl(order)}" target="_blank" rel="noopener">Bayar Sekarang</a>`);
    btns.push(`<a class="btn btn-ghost btn-sm" href="${chatUrl(order)}" target="_blank" rel="noopener">Hubungi Penjual</a>`);
  } else if (order.status === "Diproses") {
    btns.push(`<a class="btn btn-ghost btn-sm" href="${chatUrl(order)}" target="_blank" rel="noopener">Hubungi Penjual</a>`);
  } else if (order.status === "Dikirim") {
    if (isReal) {
      btns.push(`<button type="button" class="btn btn-dark btn-sm" data-action="confirm" data-id="${order.id}">Konfirmasi Penerimaan</button>`);
    }
    btns.push(`<a class="btn btn-ghost btn-sm" href="${chatUrl(order)}" target="_blank" rel="noopener">Hubungi Penjual</a>`);
  } else if (order.status === "Selesai") {
    if (hasItems) {
      btns.push(`<button type="button" class="btn btn-dark btn-sm" data-action="reorder" data-id="${order.id}">Beli Lagi</button>`);
      btns.push(`<a class="btn btn-ghost btn-sm" href="produk.html?id=${order.items[0].id}#ulasanSection">Lihat Penilaian</a>`);
    }
    btns.push(`<a class="btn btn-ghost btn-sm" href="${chatUrl(order)}" target="_blank" rel="noopener">Hubungi Penjual</a>`);
  }

  return btns.join("");
}

/* ---------- Detail pesanan (bisa dibuka) ---------- */
function detailHTML(order) {
  const isReal = Array.isArray(order.timeline) && order.timeline.length > 0;
  const alamat = order.alamat
    ? order.alamat + (order.kota ? ", " + order.kota + (order.provinsi ? ", " + order.provinsi : "") : "")
    : order.kota || "";

  const rows = [`<div class="d-row"><span>Penerima</span><strong>${order.nama}</strong></div>`];
  if (alamat) {
    rows.push(`<div class="d-row"><span>Alamat</span><strong>${alamat}${order.kodepos ? " " + order.kodepos : ""}</strong></div>`);
  }
  if (order.payment) {
    rows.push(`<div class="d-row"><span>Pembayaran</span><strong>${order.payment}</strong></div>`);
  }
  if (order.kurir) {
    rows.push(`<div class="d-row"><span>Kurir</span><strong>${order.kurir}${order.resi ? " · " + order.resi : ""}</strong></div>`);
  }

  let totals = "";
  if (typeof order.subtotal === "number") {
    totals = `
      <div class="detail-totals">
        <div><span>Subtotal</span><strong>${formatRupiah(order.subtotal)}</strong></div>
        ${order.diskon ? `<div><span>Diskon${order.voucher ? " (" + order.voucher + ")" : ""}</span><strong class="neg">−${formatRupiah(order.diskon)}</strong></div>` : ""}
        <div><span>Ongkir</span><strong>${order.ongkir ? formatRupiah(order.ongkir) : "Gratis"}</strong></div>
        <div class="d-total"><span>Total</span><strong>${formatRupiah(order.total)}</strong></div>
      </div>`;
  }

  const poin = order.poin
    ? `<p class="detail-poin">🏅 +${order.poin} poin AURELLE dari pesanan ini</p>`
    : "";

  let timeline = "";
  if (isReal) {
    timeline = `<ol class="detail-timeline">
      ${order.timeline
        .map(
          (t) => `<li><strong>${t.status}</strong><small>${formatWaktu(t.waktu)}${t.catatan ? " · " + t.catatan : ""}</small></li>`
        )
        .join("")}
    </ol>`;
  }

  return `
    <div class="order-detail" hidden>
      <div class="detail-info-grid">
        ${rows.join("")}
      </div>
      ${totals}
      ${poin}
      ${timeline}
    </div>`;
}

/* ---------- Kartu pesanan ---------- */
function orderCardHTML(order) {
  const deadline =
    order.batasBayar && order.status === "Menunggu"
      ? `<p class="order-pay-deadline">Selesaikan pembayaran dalam <strong data-countdown="${order.batasBayar}">—</strong></p>`
      : "";

  return `
  <article class="order-card reveal" data-id="${order.id}">
    <header class="order-card-head">
      <div class="order-shop">
        <span class="order-shop-logo" aria-hidden="true">A</span>
        <div class="order-shop-info">
          <strong>AURELLE</strong>
          <small>Pakaian estetik untuk hari-harimu</small>
        </div>
      </div>
      <div class="order-head-right">
        <span class="order-no">#${order.id}</span>
        ${badgeFor(order.status)}
      </div>
    </header>

    <div class="order-body">
      <div class="order-items">
        ${orderItemsHTML(order)}
      </div>
      <aside class="order-side">
        <div class="order-side-inner">
          ${deadline}
          <p class="order-side-label">Total Pesanan</p>
          <p class="order-side-total">${formatRupiah(order.total)}</p>
          <div class="order-actions">
            ${actionsHTML(order)}
          </div>
        </div>
      </aside>
    </div>

    <footer class="order-card-foot">
      <button type="button" class="detail-toggle" data-action="toggle-detail" aria-expanded="false">
        Detail Pesanan
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </footer>
    ${detailHTML(order)}
  </article>`;
}

/* ---------- Tab status ---------- */
function tabsHTML() {
  const orders = getAllOrdersSorted();
  const countFor = (s) => (s === "Semua" ? orders.length : orders.filter((o) => o.status === s).length);
  return PURCHASE_TABS.map(
    (t) => `
    <button type="button" class="purchase-tab${t === activeTab ? " active" : ""}" data-tab="${t}" role="tab" aria-selected="${t === activeTab}">
      ${t} <span class="tab-count">${countFor(t)}</span>
    </button>`
  ).join("");
}

/* ---------- Filter: tab status + kata kunci ---------- */
function filteredOrders() {
  const orders = getAllOrdersSorted();
  return orders.filter((o) => {
    if (activeTab !== "Semua" && o.status !== activeTab) return false;
    if (searchQuery && !normalizeOrderId(o.id).includes(normalizeOrderId(searchQuery))) return false;
    return true;
  });
}

/* ---------- Render ---------- */
function render() {
  const list = document.getElementById("purchaseList");
  const tabsEl = document.getElementById("purchaseTabs");
  const countEl = document.getElementById("purchaseCount");
  if (!list) return;

  const orders = filteredOrders();

  if (tabsEl) tabsEl.innerHTML = tabsHTML();
  if (countEl) countEl.textContent = orders.length + " pesanan";

  if (!orders.length) {
    list.innerHTML = `
      <div class="purchase-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M6 7h12l-1.2 12.2a1.5 1.5 0 0 1-1.5 1.3H8.7a1.5 1.5 0 0 1-1.5-1.3L6 7Z" />
          <path d="M9 10V6a3 3 0 0 1 6 0v4" />
        </svg>
        <h3>${activeTab === "Semua" && searchQuery ? "Pesanan tidak ditemukan" : "Belum ada pesanan di tab ini"}</h3>
        <p>${activeTab === "Semua" && searchQuery ? "Coba kata kunci lain atau periksa kembali nomor pesanan." : "Yuk mulai belanja — pesananmu akan muncul di sini setelah checkout."}</p>
        <a href="koleksi.html" class="btn btn-dark">Mulai Belanja</a>
      </div>`;
  } else {
    list.innerHTML = orders.map(orderCardHTML).join("");
  }

  /* Hitung mundur batas pembayaran */
  list.querySelectorAll("[data-countdown]").forEach((el) => {
    startCountdown(el, el.dataset.countdown);
  });
  initReveal();
}

/* ---------- Init ---------- */
function initPurchase() {
  document.getElementById("purchaseTabs")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-tab]");
    if (!btn) return;
    activeTab = btn.dataset.tab;
    render();
  });

  document.getElementById("purchaseSearch")?.addEventListener("input", (e) => {
    searchQuery = e.target.value.trim();
    render();
  });

  document.getElementById("purchaseList")?.addEventListener("click", (e) => {
    const actionEl = e.target.closest("[data-action]");
    if (!actionEl) return;
    const card = actionEl.closest(".order-card");
    if (!card) return;

    /* Buka/tutup detail pesanan */
    if (actionEl.dataset.action === "toggle-detail") {
      const detail = card.querySelector(".order-detail");
      if (!detail) return;
      const expanded = !detail.hidden;
      detail.hidden = expanded;
      actionEl.setAttribute("aria-expanded", String(!expanded));
      actionEl.classList.toggle("open", !expanded);
      return;
    }

    const order = findOrder(card.dataset.id);
    if (!order) return;

    if (actionEl.dataset.action === "confirm") {
      if (confirmReceipt(order.id).ok) {
        showToast("Terima kasih! Pesanan ditandai Selesai ✨");
      } else {
        showToast("Pesanan tidak ditemukan");
      }
      render();
    }

    if (actionEl.dataset.action === "reorder") {
      order.items.forEach((it) => {
        const p = PRODUCTS[it.id];
        if (!p) return;
        addToCart({ id: it.id, name: p.name, size: it.size, color: it.warna, qty: it.qty, price: it.harga });
      });
      showToast("Produk ditambahkan ke keranjang 🛍️");
      setTimeout(() => {
        window.location.href = "keranjang.html";
      }, 700);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  render();
  initPurchase();
});
