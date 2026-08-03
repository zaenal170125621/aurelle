/* ==========================================================================
   AURELLE — Halaman Masuk / Daftar (mode demo)
   Menyimpan { name, email } ke localStorage "aurelle-user".
   ========================================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const card = document.getElementById("loginCard");
  const status = document.getElementById("loginStatus");
  if (!form || !card) return;

  const nameInput = document.getElementById("loginName");
  const emailInput = document.getElementById("loginEmail");

  // Sudah login? Tampilkan info + tombol keluar, sembunyikan form.
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("aurelle-user") || "null");
  } catch (e) {
    user = null;
  }

  if (user && user.name) {
    card.innerHTML = `
      <div class="login-welcome">
        <span class="user-info-avatar" aria-hidden="true">${user.name.trim().charAt(0).toUpperCase() || "A"}</span>
        <h3>Halo, ${escapeHtml(user.name)}!</h3>
        <p>${user.email ? escapeHtml(user.email) : "Member AURELLE"}</p>
        <a href="profil.html" class="btn btn-dark btn-block">Lanjut ke Akun</a>
        <button type="button" class="btn btn-ghost btn-block" id="logoutFromLogin">Keluar</button>
      </div>`;

    const logout = document.getElementById("logoutFromLogin");
    logout?.addEventListener("click", () => {
      localStorage.removeItem("aurelle-user");
      showToast("Berhasil keluar (mode demo)");
      setTimeout(() => window.location.reload(), 600);
    });
    return;
  }

  // Tujuan setelah login: ?redirect=halaman atau profil.html
  const target = new URLSearchParams(window.location.search).get("redirect") || "profil.html";

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name) {
      showStatus("Isi nama lengkap dulu ya.", true);
      nameInput.focus();
      return;
    }
    if (!emailOk) {
      showStatus("Masukkan alamat email yang valid.", true);
      emailInput.focus();
      return;
    }

    localStorage.setItem("aurelle-user", JSON.stringify({ name, email }));
    showStatus("Berhasil masuk! Mengalihkan...", false);
    showToast(`Selamat datang, ${name}!`);
    setTimeout(() => {
      window.location.href = target;
    }, 700);
  });

  function showStatus(msg, invalid) {
    if (!status) return;
    status.textContent = msg;
    status.classList.toggle("invalid", !!invalid);
    status.hidden = false;
  }
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
