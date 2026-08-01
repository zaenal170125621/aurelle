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

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  initNewsletter();
});
