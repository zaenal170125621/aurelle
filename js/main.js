/* ==========================================================================
   AURELLE — Logika halaman beranda (index.html)
   ========================================================================== */

"use strict";

/* ---------- Render grid produk ---------- */
function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map((p, i) => productCardHTML(p, i)).join("");
  initReveal();
}

/* ---------- Form newsletter ---------- */
function initNewsletter() {
  const form = document.getElementById("newsletterForm");
  const status = document.getElementById("formStatus");
  if (!form || !status) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();

    status.textContent = "";
    status.style.color = "";

    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      status.style.color = "#b3402c";
      status.textContent = "Email belum valid. Silakan periksa kembali.";
      return;
    }

    status.style.color = "var(--terracotta-dark)";
    status.textContent = "Kamu sudah terdaftar. Cek email untuk kupon diskon 10%.";
    form.reset();
  });
}

/* ---------- Form kontak ---------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const fields = {
    name: document.getElementById("contactName"),
    email: document.getElementById("contactEmail"),
    msg: document.getElementById("contactMsg"),
  };
  const errors = {
    name: document.getElementById("err-contactName"),
    email: document.getElementById("err-contactEmail"),
    msg: document.getElementById("err-contactMsg"),
  };
  const status = document.getElementById("contactStatus");
  if (!fields.name || !fields.email || !fields.msg || !status) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nama = fields.name.value.trim();
    const email = fields.email.value.trim();
    const pesan = fields.msg.value.trim();

    let ok = true;
    Object.values(errors).forEach((el) => (el.textContent = ""));

    if (nama.length < 2) {
      errors.name.textContent = "Nama minimal 2 karakter.";
      ok = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email.textContent = "Email belum valid.";
      ok = false;
    }
    if (pesan.length < 10) {
      errors.msg.textContent = "Pesan minimal 10 karakter.";
      ok = false;
    }
    if (!ok) return;

    status.textContent =
      "Pesan terkirim! Kami akan membalas via email dalam 1x24 jam.";
    status.style.color = "var(--terracotta-dark)";
    form.reset();
  });
}

/* ---------- Carousel cerita pelanggan ---------- */
function initTestimonialCarousel() {
  const track = document.getElementById("testimonialTrack");
  const prev = document.getElementById("testPrev");
  const next = document.getElementById("testNext");
  if (!track) return;

  const card = () => track.querySelector(".testimonial");
  const step = () => {
    const c = card();
    return c ? c.getBoundingClientRect().width + 16 : 300;
  };

  prev?.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
  next?.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
}

/* ---------- Flash sale: countdown + progress terjual ---------- */
function initFlashSale() {
  const widget = document.getElementById("flashWidget");
  if (!widget) return;

  const totalStock = 100; // kuota stok flash sale (demo)
  const soldQty = 76; // sudah terjual (demo)
  const pad = (n) => String(n).padStart(2, "0");

  const render = () => {
    // Hitung mundur ke akhir hari agar selalu "live"
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    const totalSec = Math.max(0, Math.floor((end - now) / 1000));
    const hh = Math.floor(totalSec / 3600);
    const mm = Math.floor((totalSec % 3600) / 60);
    const ss = totalSec % 60;
    const pct = Math.min(100, Math.round((soldQty / totalStock) * 100));

    widget.innerHTML = `
      <div class="flash-timer" role="timer" aria-label="Flash sale berakhir dalam">
        <span class="flash-timer-label">Berakhir dalam</span>
        <div class="flash-timer-boxes">
          <span class="flash-timer-box">${pad(hh)}</span><span class="flash-timer-sep">:</span>
          <span class="flash-timer-box">${pad(mm)}</span><span class="flash-timer-sep">:</span>
          <span class="flash-timer-box">${pad(ss)}</span>
        </div>
      </div>
      <div class="flash-progress">
        <div class="flash-progress-bar"><span style="width:${pct}%"></span></div>
        <div class="flash-progress-meta">
          <span>🔥 Terjual ${pct}%</span>
          <span>Sisa ${totalStock - soldQty} dari ${totalStock}</span>
        </div>
      </div>`;
  };

  render();
  setInterval(render, 1000);
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  initNewsletter();
  initContactForm();
  initTestimonialCarousel();
  initFlashSale();
});
