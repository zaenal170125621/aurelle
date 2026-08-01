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
      ${itemsBlock}
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
    result.hidden = false;
    result.innerHTML = order ? resultHTML(order) : notFoundHTML(value.toUpperCase());
    initReveal();
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTrack();
});
