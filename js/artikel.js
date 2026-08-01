/* ==========================================================================
   AURELLE — Halaman artikel (artikel.html?id=N)
   ========================================================================== */

"use strict";

/* Isi artikel: teks polos dibungkus <p>, markup HTML (list/tips) dipertahankan */
function articleContentHTML(a) {
  return a.content
    .map((c) => (c.startsWith("<") ? c : `<p>${c}</p>`))
    .join("");
}

function renderArticle() {
  const id = Number(new URLSearchParams(location.search).get("id"));
  const article = ARTICLES.find((a) => a.id === id);

  const crumb = document.getElementById("breadcrumbCurrent");
  const cat = document.getElementById("articleCat");
  const title = document.getElementById("articleTitle");
  const meta = document.getElementById("articleMeta");
  const image = document.getElementById("articleImage");
  const body = document.getElementById("articleBody");
  const related = document.getElementById("relatedGrid");
  if (!title) return;

  if (!article) {
    if (crumb) crumb.textContent = "Artikel tidak ditemukan";
    document.title = "Artikel tidak ditemukan — AURELLE";
    if (cat) cat.textContent = "Oops";
    title.textContent = "Artikel tidak ditemukan";
    if (meta) meta.hidden = true;
    if (image) image.hidden = true;
    if (body)
      body.innerHTML =
        "<p>Artikel yang kamu cari tidak ada atau sudah dipindah. Silakan kembali ke halaman blog.</p>";
    return;
  }

  if (crumb) crumb.textContent = article.title;
  document.title = article.title + " — AURELLE";
  if (cat) cat.textContent = article.category;
  title.textContent = article.title;
  if (meta) meta.textContent = `${formatBlogDate(article.date)} · ${article.readTime} menit baca`;
  if (image) image.src = article.image;
  if (body) body.innerHTML = articleContentHTML(article);

  // Artikel lainnya (kecuali artikel yang sedang dibaca)
  const others = ARTICLES.filter((a) => a.id !== article.id).slice(0, 2);
  if (related) {
    related.innerHTML = others.map(blogCardHTML).join("");
    initReveal();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderArticle();
});
