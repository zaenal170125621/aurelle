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

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  initNewsletter();
  initContactForm();
  initTestimonialCarousel();
});
