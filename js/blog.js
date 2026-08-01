/* ==========================================================================
   AURELLE — Blog (blog.html & artikel.html)
   Data artikel (ARTICLES) diambil dari js/data.js. blog.js juga dimuat di
   artikel.html agar blogCardHTML bisa dipakai untuk "Artikel lainnya".
   ========================================================================== */

"use strict";

/* ---------- Format tanggal ---------- */
function formatBlogDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ---------- Kartu artikel (dipakai blog.html & artikel.html) ---------- */
function blogCardHTML(a) {
  return `
    <a href="artikel.html?id=${a.id}" class="blog-card reveal" aria-label="Baca artikel: ${a.title}">
      <div class="blog-card-img">
        <img src="${a.image}" alt="${a.title}" loading="lazy" />
        <span class="blog-cat">${a.category}</span>
      </div>
      <div class="blog-card-body">
        <h3>${a.title}</h3>
        <p>${a.excerpt}</p>
        <span class="blog-meta">${formatBlogDate(a.date)} · ${a.readTime} menit baca</span>
      </div>
    </a>`;
}

/* ---------- Init blog.html ---------- */
function initBlog() {
  const grid = document.getElementById("blogGrid");
  if (!grid) return;
  grid.innerHTML = ARTICLES.map(blogCardHTML).join("");
  initReveal();
}

document.addEventListener("DOMContentLoaded", () => {
  initBlog();
});
