/* ==========================================================================
   AURELLE — Lapisan data pesanan (Fase 0: mode demo -> tersimpan lokal)
   Pesanan nyata dari checkout disimpan di localStorage ("aurelle-orders").
   ORDERS dari js/data.js tetap dipakai sebagai data contoh (mock).
   ========================================================================== */

"use strict";

const ORDER_STORE_KEY = "aurelle-orders";

/* Alur status: Menunggu -> Diproses -> Dikirim -> Selesai */
const ORDER_FLOW = ["Menunggu", "Diproses", "Dikirim", "Selesai"];

/* Baca semua pesanan nyata dari localStorage */
function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDER_STORE_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

/* Simpan pesanan baru (dipanggil saat checkout berhasil) */
function saveOrder(order) {
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem(ORDER_STORE_KEY, JSON.stringify(orders));
}

/* Gabungan data contoh (mock) + pesanan nyata */
function getAllOrders() {
  return ORDERS.concat(getOrders());
}

/* Cari pesanan — pesanan nyata didahulukan, lalu data contoh */
function findOrder(id) {
  const value = normalizeOrderId(id);
  const real = getOrders().find((o) => normalizeOrderId(o.id) === value);
  if (real) return real;
  return ORDERS.find((o) => normalizeOrderId(o.id) === value) || null;
}

/* Normalisasi nomor pesanan: huruf besar, tanpa spasi */
function normalizeOrderId(value) {
  return String(value || "").trim().toUpperCase().replace(/\s+/g, "");
}

/* Ubah status pesanan nyata + tambah entri timeline */
function updateOrderStatus(id, status, resi) {
  const orders = getOrders();
  const order = orders.find((o) => normalizeOrderId(o.id) === normalizeOrderId(id));
  if (!order) return false;

  order.status = status;
  if (resi !== undefined && resi !== null) order.resi = resi;
  order.timeline.push({
    status,
    waktu: new Date().toISOString(),
    catatan: timelineNote(status, resi),
  });
  localStorage.setItem(ORDER_STORE_KEY, JSON.stringify(orders));
  return true;
}

function timelineNote(status, resi) {
  switch (status) {
    case "Menunggu":
      return "Pesanan diterima, menunggu konfirmasi pembayaran";
    case "Diproses":
      return "Pesanan sedang disiapkan";
    case "Dikirim":
      return resi ? "Pesanan dikirim · No. resi " + resi : "Pesanan dikirim";
    case "Selesai":
      return "Pesanan telah tiba di tujuan";
    default:
      return "";
  }
}

/* Tanggal — terima "YYYY-MM-DD" (contoh) atau ISO penuh (pesanan nyata) */
function formatTanggal(value) {
  const d = new Date(value);
  if (isNaN(d)) return value || "";
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* Waktu lengkap (tanggal + jam) untuk entri timeline */
function formatWaktu(value) {
  const d = new Date(value);
  if (isNaN(d)) return "";
  return d.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
