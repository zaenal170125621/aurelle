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

/* Konfirmasi penerimaan pesanan (dari halaman Cek Pesanan).
   Pesanan contoh (mock) ikut disalin ke localStorage agar perubahannya
   nyata — status Selesai langsung terlihat juga di panel admin. */
function confirmReceipt(id) {
  const value = normalizeOrderId(id);
  const orders = getOrders();
  let order = orders.find((o) => normalizeOrderId(o.id) === value);

  if (!order) {
    const mock = ORDERS.find((o) => normalizeOrderId(o.id) === value);
    if (!mock) return { ok: false };
    order = JSON.parse(JSON.stringify(mock));
    delete order.items; // mock hanya punya jumlah item, bukan detail produk
    const base = new Date(order.tanggal).getTime();
    order.timeline = [
      { status: "Diproses", waktu: new Date(base + 3600e3 * 2).toISOString(), catatan: "Pesanan sedang disiapkan" },
      {
        status: "Dikirim",
        waktu: new Date(base + 3600e3 * 26).toISOString(),
        catatan: order.kurir && order.resi ? "Pesanan dikirim · No. resi " + order.resi : "Pesanan dikirim",
      },
    ];
    orders.push(order);
  }

  if (order.status === "Selesai") return { ok: true };
  if (!Array.isArray(order.timeline)) order.timeline = [];
  order.status = "Selesai";
  order.timeline.push({
    status: "Selesai",
    waktu: new Date().toISOString(),
    catatan: "Pesanan dikonfirmasi diterima oleh pembeli",
  });
  localStorage.setItem(ORDER_STORE_KEY, JSON.stringify(orders));
  return { ok: true };
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
