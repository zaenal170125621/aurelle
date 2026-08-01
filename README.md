# AURELLE

Website toko pakaian estetik — statis murni (HTML, CSS, JavaScript) tanpa backend dan tanpa build step.

## Fitur

- **Beranda** — hero, kategori, promo, tentang, testimoni, kontak
- **Katalog** (`koleksi.html`) — filter kategori, pencarian live, urutan harga/rating/terlaris, deep-link lewat URL
- **Detail produk** (`produk.html`) — pilih ukuran & warna, tambah ke keranjang, wishlist
- **Keranjang** (`keranjang.html`) — ubah jumlah, hapus, progress gratis ongkir (min. Rp150.000)
- **Wishlist** (`wishlist.html`) — tersimpan di localStorage + badge di navbar
- **Checkout** (`checkout.html`) — form alamat dengan validasi, metode pembayaran, pesan sukses
- Tema terang/gelap, navbar aktif + scrollspy, tombol kembali ke atas, animasi scroll halus
- Data tersimpan di `localStorage` per browser (keranjang, wishlist, tema)

## Struktur

```
index.html        Beranda
koleksi.html      Katalog + filter + pencarian
produk.html       Detail produk
keranjang.html    Keranjang
wishlist.html     Wishlist
checkout.html     Checkout
css/style.css     Seluruh styling (8 bagian)
js/data.js        Data produk, kategori, konfigurasi ongkir
js/site.js        Utilitas bersama (tema, keranjang, wishlist, scroll, dll.)
js/*.js           Logika per halaman
```

## Preview lokal

```sh
# Opsi 1 — Python
py -m http.server 8000
# buka http://localhost:8000

# Opsi 2 — Node
npx serve
```

## Deploy gratis

Semua path relatif, jadi tinggal unggah foldernya.

- **Netlify Drop** — buka https://app.netlify.com/drop, seret folder ini, selesai.
- **GitHub Pages** — push repo ini, lalu *Settings → Pages → Deploy from branch* (`main`, root). URL: `https://<username>.github.io/<repo>/`
- **Cloudflare Pages / Vercel** — import repo atau unggah folder lewat dashboard. Tidak ada build command.

## Mengubah data produk

Edit `js/data.js` — array `PRODUCTS` (nama, harga, gambar, ukuran, warna, deskripsi, dll.) dan `KATEGORI`.

© 2026 AURELLE
