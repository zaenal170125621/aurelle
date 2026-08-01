/* ==========================================================================
   AURELLE — Cek pesanan (cek-pesanan.html)
   Mencari pesanan dari data contoh (js/data.js) maupun pesanan nyata hasil
   checkout (js/orders.js — tersimpan di localStorage).
   ========================================================================== */

"use strict";

/* Alur status: Menunggu -> Diproses -> Dikirim -> Selesai */
const TRACK_FLOW = ["Menunggu", "Diproses", "Dikirim", "Selesai"];

const STEP_INFO = [
  { label: "Pesanan Diterima", sub: (o) => formatTanggal(o.tanggal) },
  { label: "Sedang Diproses", sub: () => "Tim kami sedang menyiapkan pesananmu" },
  { label: "Dikirim", sub: (o) => (o.kurir && o.resi ? `${o.kurir} · No. resi ${o.resi}` : "Nomor resi akan menyusul") },
  { label: "Selesai", sub: (_o, flowIndex) => (flowIndex === 3 ? "Pesanan telah tiba di tujuan" : "Menunggu konfirmasi penerimaan") },
];

/* ---------- Utilitas ---------- */
function statusBadgeHTML(status) {
  const map = {
    Menunggu: "badge-muted",
    Diproses: "badge-terracotta",
    Dikirim: "badge-ink",
    Selesai: "badge-sage",
  };
  return `<span class="admin-badge ${map[status] || "badge-muted"}">${status}</span>`;
}

/* ---------- Hasil pencarian ---------- */
function resultHTML(order) {
  const isReal = Array.isArray(order.timeline) && order.timeline.length > 0;
  const itemCount = order.items ? order.items.length : order.item || 0;

  /* Aksi pembeli: konfirmasi terima (saat dikirim), beli lagi (pesanan
     nyata punya detail produk), dan chat penjual */
  const canConfirm = order.status === "Dikirim";
  const hasItems = Array.isArray(order.items) && order.items.length > 0;
  const chatUrl =
    "https://wa.me/6285939592558?text=" +
    encodeURIComponent("Halo AURELLE! Saya mau tanya soal pesanan #" + order.id);
  const actionsBlock =
    canConfirm || hasItems
      ? `<div class="track-actions">
        ${canConfirm ? `<button type="button" class="btn btn-dark" data-action="confirm">Konfirmasi Penerimaan</button>` : ""}
        ${hasItems ? `<button type="button" class="btn btn-ghost" data-action="reorder">Beli Lagi</button>` : ""}
        <a class="btn btn-ghost" href="${chatUrl}" target="_blank" rel="noopener">Chat Penjual</a>
      </div>`
      : "";

  let steps;
  if (isReal) {
    steps = order.timeline
      .map(
        (t, i) => `
      <li class="${i === order.timeline.length - 1 ? "active" : "done"}">
        <span class="dot" aria-hidden="true"></span>
        <div>
          <strong>${t.status}</strong>
          <small>${formatWaktu(t.waktu)} · ${t.catatan || ""}</small>
        </div>
      </li>`
      )
      .join("");
  } else {
    const flowIndex = TRACK_FLOW.indexOf(order.status);
    steps = TRACK_FLOW.map((status, i) => {
      const cls = i < flowIndex ? "done" : i === flowIndex ? "active" : "";
      const info = STEP_INFO[i];
      const sub = typeof info.sub === "function" ? info.sub(order, flowIndex) : info.sub;
      return `
      <li class="${cls}">
        <span class="dot" aria-hidden="true"></span>
        <div>
          <strong>${info.label}</strong>
          <small>${sub}</small>
        </div>
      </li>`;
    }).join("");
  }

  const itemsBlock =
    order.items && order.items.length
      ? `<div class="track-items">
        <h4>Ringkasan belanja</h4>
        <ul>
          ${order.items
            .map(
              (it) => `
          <li>
            <span>${it.nama} <small>(${it.size} · ${it.warna}) × ${it.qty}</small></span>
            <strong>${formatRupiah(it.harga * it.qty)}</strong>
          </li>`
            )
            .join("")}
        </ul>
        <p class="track-items-total">Total <strong>${formatRupiah(order.total)}</strong></p>
      </div>`
      : "";

  /* Batas pembayaran 24 jam (hanya pesanan nyata yang masih menunggu) */
  const deadlineBlock =
    order.batasBayar && order.status === "Menunggu"
      ? `<div class="pay-deadline">
          <span>Selesaikan pembayaran dalam</span>
          <strong data-countdown="${order.batasBayar}">—</strong>
        </div>`
      : "";

  /* Poin loyalitas AURELLE dari pesanan ini */
  const poinBlock = order.poin
    ? `<p class="track-poin">🏅 +${order.poin} poin AURELLE didapat dari pesanan ini</p>`
    : "";

  return `
    <div class="track-card reveal">
      <div class="track-card-head">
        <div>
          <p class="track-id">Pesanan <strong>#${order.id}</strong></p>
          <p class="track-sub">dipesan ${formatTanggal(order.tanggal)} · ${itemCount} item · ${order.nama}</p>
        </div>
        ${statusBadgeHTML(order.status)}
      </div>
      <div class="track-total">
        <span>Total pembayaran</span>
        <strong>${formatRupiah(order.total)}</strong>
      </div>
      ${deadlineBlock}
      ${actionsBlock}
      ${itemsBlock}
      ${poinBlock}
      <ol class="track-timeline">
        ${steps}
      </ol>
      <p class="track-note">
        Butuh bantuan? Buka <a href="bantuan.html">pusat bantuan</a> atau
        <a href="https://wa.me/6285939592558" target="_blank" rel="noopener">chat WhatsApp</a>.
      </p>
    </div>`;
}

function notFoundHTML(value) {
  return `
    <div class="track-card track-card-empty reveal">
      <h3>Pesanan tidak ditemukan</h3>
      <p>Kami tidak menemukan pesanan dengan nomor <strong>${value}</strong>. Pastikan huruf dan angka sesuai dengan nomor dari halaman sukses checkout atau konfirmasi WhatsApp (contoh: AUR-1042).</p>
      <p class="track-note">
        Pesananmu baru saja dibuat? Pesanan tersimpan otomatis di perangkat ini (mode demo). Kalau ragu,
        <a href="https://wa.me/6285939592558?text=Halo%20AURELLE!%20Saya%20mau%20cek%20status%20pesanan." target="_blank" rel="noopener">hubungi kami di WhatsApp</a>.
      </p>
    </div>`;
}

/* ---------- Init ---------- */
function initTrack() {
  const form = document.getElementById("trackForm");
  const input = document.getElementById("orderInput");
  const status = document.getElementById("trackStatus");
  const result = document.getElementById("trackResult");
  if (!form) return;

  let currentOrderId = null;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const value = (input.value || "").trim();
    if (!value) {
      status.textContent = "Masukkan nomor pesanan dulu.";
      status.classList.add("invalid");
      input.focus();
      return;
    }
    status.textContent = "";
    status.classList.remove("invalid");

    const order = findOrder(value);
    currentOrderId = order ? order.id : null;
    result.hidden = false;
    result.innerHTML = order ? resultHTML(order) : notFoundHTML(value.toUpperCase());
    // Jalankan hitung mundur batas pembayaran jika ada
    result.querySelectorAll("[data-countdown]").forEach((el) => {
      startCountdown(el, el.dataset.countdown);
    });
    initReveal();
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  /* Aksi pada kartu hasil (delegasi karena innerHTML diganti tiap pencarian) */
  result.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn || !currentOrderId) return;

    const order = findOrder(currentOrderId);
    if (!order) return;

    if (btn.dataset.action === "confirm") {
      if (confirmReceipt(order.id).ok) {
        showToast("Terima kasih! Pesanan ditandai Selesai ✨");
        result.innerHTML = resultHTML(findOrder(order.id));
        initReveal();
      } else {
        showToast("Pesanan tidak ditemukan");
      }
    }

    if (btn.dataset.action === "reorder") {
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
  initTrack();
});
