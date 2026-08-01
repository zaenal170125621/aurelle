/* ==========================================================================
   AURELLE — Data produk, pesanan & artikel (dipakai seluruh halaman)
   ========================================================================== */

"use strict";

const PRODUCTS = [
  {
    name: "Kaos Oversize Basic",
    category: "Wanita · Pria",
    price: 89000,
    oldPrice: null,
    badge: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    description:
      "Kaos oversize dengan potongan rileks yang tetap rapi dipakai. Bahan katun combed 30s yang adem dan jatuh, cocok untuk gaya kasual sehari-hari maupun layering.",
    bahan: "100% katun combed 30s, gramasi 180 gsm. Adem, tidak menerawang, dan awet dipakai.",
    perawatan: "Cuci dengan air dingin, jangan direndam terlalu lama, jemur di tempat teduh.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Putih", hex: "#f2ede3" },
      { name: "Hitam", hex: "#26231f" },
      { name: "Krem", hex: "#d9c9ae" },
      { name: "Sage", hex: "#a3a380" },
    ],
    rating: 4.9,
    sold: 420,
    reviews: 96,
  },
  {
    name: "Dress Puff Sleeve",
    category: "Wanita",
    price: 249000,
    oldPrice: 299000,
    badge: "-17%",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    description:
      "Dress dengan lengan puff dan potongan A-line yang feminin. Siluetnya jatuh lembut dan flowy, cocok untuk acara santai hingga semi formal.",
    bahan: "Kombinasi katun poplin dan voal, ringan dan menyerap keringat.",
    perawatan: "Cuci halus dengan suhu rendah, setrika dengan suhu sedang.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Krem", hex: "#e4d5bd" },
      { name: "Terracotta", hex: "#c67b5c" },
      { name: "Olive", hex: "#6f6b4a" },
    ],
    rating: 4.8,
    sold: 265,
    reviews: 58,
  },
  {
    name: "Blouse Linen",
    category: "Wanita",
    price: 199000,
    oldPrice: null,
    badge: null,
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80",
    description:
      "Blouse berbahan linen dengan tekstur natural dan potongan relaxed. Kancing depan dengan detail French seam untuk tampilan yang rapi dan premium.",
    bahan: "55% linen, 45% katun. Adem, breathable, dan semakin nyaman dipakai.",
    perawatan: "Cuci tangan atau mesin dengan siklus halus, hindari pengering mesin.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Natural", hex: "#e8ddc9" },
      { name: "Putih", hex: "#f5f1e8" },
    ],
    rating: 4.9,
    sold: 198,
    reviews: 41,
  },
  {
    name: "Jeans Wide Leg",
    category: "Wanita",
    price: 259000,
    oldPrice: 299000,
    badge: "-13%",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
    description:
      "Celana jeans dengan potongan wide leg dan high-waist yang menciptakan siluet panjang. Fleksibel dipadukan dengan kaos, blouse, atau knitwear.",
    bahan: "Denim stretch, 98% katun dan 2% spandex. Nyaman digerakkan.",
    perawatan: "Cuci terbalik dengan air dingin, hindari setrika langsung pada bahan.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Denim Gelap", hex: "#3c4a5a" },
      { name: "Denim Muda", hex: "#7f96ab" },
      { name: "Hitam", hex: "#26231f" },
    ],
    rating: 4.7,
    sold: 310,
    reviews: 73,
  },
  {
    name: "Cardigan Rajut",
    category: "Wanita",
    price: 179000,
    oldPrice: null,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    description:
      "Cardigan rajut dengan rajutan halus dan potongan oversize. Lapisan hangat yang tetap ringan, cocok untuk cuaca sejuk dan layering.",
    bahan: "Akrilik premium yang lembut, anti-pilling, dan mudah dirawat.",
    perawatan: "Cuci tangan dengan air dingin, keringkan dengan cara dibentangkan.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Cokelat Susu", hex: "#b9a48c" },
      { name: "Krem", hex: "#e6dcc8" },
      { name: "Abu", hex: "#9a948c" },
    ],
    rating: 4.8,
    sold: 154,
    reviews: 33,
  },
  {
    name: "Rok Plisket",
    category: "Wanita",
    price: 159000,
    oldPrice: 189000,
    badge: "-16%",
    image:
      "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=800&q=80",
    description:
      "Rok plisket dengan lipatan presisi dan pinggang karet yang nyaman. Gerakan rok saat dipakai memberi kesan anggun sekaligus dinamis.",
    bahan: "Polyester premium yang ringan dan tidak mudah kusut.",
    perawatan: "Cuci dengan air dingin, gantung kering agar lipatan tetap rapi.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Hitam", hex: "#26231f" },
      { name: "Putih", hex: "#f2ede3" },
      { name: "Terracotta", hex: "#c67b5c" },
    ],
    rating: 4.8,
    sold: 227,
    reviews: 49,
  },
  {
    name: "Hoodie Premium",
    category: "Pria",
    price: 229000,
    oldPrice: null,
    badge: null,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80",
    description:
      "Hoodie dengan bahan fleece tebal yang hangat dan nyaman. Potongan regular dengan hood berlapis, kantong kanguru, dan tali serut berkualitas.",
    bahan: "Cotton fleece, 80% katun dan 20% poliester, gramasi 320 gsm.",
    perawatan: "Cuci terbalik dengan air dingin, keringkan dengan suhu rendah.",
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Abu Tua", hex: "#4a4a48" },
      { name: "Hitam", hex: "#26231f" },
      { name: "Navy", hex: "#2c3a4d" },
    ],
    rating: 4.9,
    sold: 342,
    reviews: 81,
  },
  {
    name: "Tote Bag Kanvas",
    category: "Aksesoris",
    price: 99000,
    oldPrice: 129000,
    badge: "-23%",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    description:
      "Tote bag kanvas tebal dengan kapasitas lapang dan kompartemen dalam. Pendamping setia untuk kuliah, kerja, atau belanja.",
    bahan: "Kanvas 12 oz dengan jahitan ganda yang kuat.",
    perawatan: "Lap dengan kain lembap, hindari mesin cuci.",
    sizes: ["One Size"],
    colors: [
      { name: "Natural", hex: "#e0d5bd" },
      { name: "Hitam", hex: "#26231f" },
    ],
    rating: 4.9,
    sold: 512,
    reviews: 118,
  },
];

const formatRupiah = (value) =>
  "Rp" + value.toLocaleString("id-ID").replace(/,/g, ".");

/* Format jumlah terjual ala marketplace (mis. 420 -> "400+") */
const formatSold = (n) => (n >= 100 ? Math.floor(n / 100) * 100 + "+" : String(n));

/* Voucher promo statis (demo) — dipakai di halaman checkout */
const VOUCHERS = [
  { kode: "HEMAT10", tipe: "persen", nilai: 10, minBelanja: 100000, deskripsi: "Diskon 10% · min. belanja Rp100.000" },
  { kode: "HARIINI", tipe: "persen", nilai: 15, minBelanja: 200000, deskripsi: "Diskon 15% · min. belanja Rp200.000" },
  { kode: "NGOPI", tipe: "nominal", nilai: 15000, minBelanja: 50000, deskripsi: "Potongan Rp15.000 · min. belanja Rp50.000" },
];

/* Kategori untuk filter di halaman katalog ("Semua" = tanpa filter) */
const KATEGORI = ["Semua", "Wanita", "Pria", "Aksesoris"];

/* Konfigurasi ongkir (dipakai halaman keranjang & checkout) */
const ONGKIR_FLAT = 20000;
const FREE_ONGKIR_MIN = 150000;

/* Data contoh pesanan (mode demo, tanpa backend) — dipakai admin & cek pesanan */
const ORDERS = [
  { id: "AUR-1042", nama: "Siti Rahma", tanggal: "2026-08-02", item: 3, total: 537000, status: "Diproses", kurir: null, resi: null },
  { id: "AUR-1041", nama: "Budi Santoso", tanggal: "2026-08-02", item: 1, total: 89000, status: "Selesai", kurir: "J&T", resi: "JT2508142001" },
  { id: "AUR-1040", nama: "Dewi Lestari", tanggal: "2026-08-01", item: 2, total: 448000, status: "Dikirim", kurir: "JNE", resi: "JD0023512487" },
  { id: "AUR-1039", nama: "Rizky Pratama", tanggal: "2026-08-01", item: 4, total: 726000, status: "Menunggu", kurir: null, resi: null },
  { id: "AUR-1038", nama: "Maya Anggraini", tanggal: "2026-07-31", item: 2, total: 358000, status: "Selesai", kurir: "SiCepat", resi: "SC3028112290" },
  { id: "AUR-1037", nama: "Fajar Nugroho", tanggal: "2026-07-30", item: 1, total: 229000, status: "Selesai", kurir: "J&T", resi: "JT2508093104" },
  { id: "AUR-1036", nama: "Putri Ayu", tanggal: "2026-07-30", item: 3, total: 497000, status: "Diproses", kurir: null, resi: null },
  { id: "AUR-1035", nama: "Andi Wijaya", tanggal: "2026-07-29", item: 1, total: 99000, status: "Dikirim", kurir: "JNE", resi: "JD0023487126" },
];

/* Data contoh artikel (mode demo, tanpa backend) — dipakai blog.html & artikel.html */
const ARTICLES = [
  {
    id: 1,
    title: "Panduan Memilih Ukuran Baju Tanpa Menyesal",
    category: "Tips",
    date: "2026-07-28",
    readTime: 3,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    excerpt:
      "Ukuran M yang pas di satu toko belum tentu pas di toko lain. Ini cara mudah menemukan ukuran yang paling cocok untukmu.",
    content: [
      "Pernah beli baju ukuran M tapi jatuhnya kekecilan? Tenang, kamu tidak sendirian. Ukuran pakaian antar merek bisa beda jauh — makanya kami selalu menyertakan tabel ukuran di setiap halaman produk.",
      "Langkah pertama: ambil baju favoritmu yang paling pas. Letakkan di permukaan datar, lalu ukur lebar dada dan panjangnya dengan meteran. Bandingkan angkanya dengan tabel ukuran di halaman produk.",
      "Suka potongan longgar? Tambahkan kelonggaran 2–3 cm dari ukuran pas. Suka yang pas di badan? Ambil ukuran yang sesuai, atau satu tingkat di bawah kalau bahannya elastis.",
      "Masih ragu? Jangan sungkan chat kami di WhatsApp — tim kami biasa membantu pelanggan memilih ukuran, lengkap dengan rekomendasi berdasarkan tinggi dan berat badan.",
    ],
  },
  {
    id: 2,
    title: "5 Cara Merawat Bahan Katun Combed agar Awet",
    category: "Perawatan",
    date: "2026-07-21",
    readTime: 4,
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80",
    excerpt:
      "Katun combed 30s itu adem dan jatuh — tapi biar awet dipakai bertahun-tahun, perawatannya harus benar.",
    content: [
      "Sebagian besar produk AURELLE memakai katun combed 30s: adem, tidak menerawang, dan jatuhnya enak. Dengan perawatan yang tepat, kaos favoritmu bisa tetap seperti baru.",
      "<ul><li><strong>Cuci dengan air dingin</strong> — air panas bisa membuat serat katun cepat kendur dan warna luntur.</li><li><strong>Jangan direndam terlalu lama</strong> — cukup 5–10 menit sebelum dicuci.</li><li><strong>Jemur di tempat teduh</strong> — sinar matahari langsung bikin warna cepat pudar, terutama untuk warna gelap.</li><li><strong>Setrika dengan suhu sedang</strong> — katun combed mudah halus tanpa perlu setrika panas.</li><li><strong>Pisahkan warna terang dan gelap</strong> — mencegah noda luntur di cucian pertama.</li></ul>",
      "Satu lagi: balik pakaian ke sisi dalam sebelum dicuci. Sabuk jahitan dan warna di bagian luar jadi lebih terlindungi, sehingga kaos tetap rapi lebih lama.",
    ],
  },
  {
    id: 3,
    title: "Tampil Rapi ke Kantor dengan Atasan AURELLE",
    category: "Inspirasi",
    date: "2026-07-14",
    readTime: 3,
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
    excerpt:
      "Rapi, nyaman, dan tetap santai — tiga padu padan atasan AURELLE untuk look kantoran yang effortless.",
    content: [
      "<h3>1. Kaos oversize + celana panjang</h3>Padukan Kaos Oversize Basic dengan celana panjang atau chino. Selipkan sedikit bagian depan kaos ke celana untuk siluet yang lebih rapi, lengkapi dengan sneakers putih.",
      "<h3>2. Dress puff sleeve + blazer tipis</h3>Dress Puff Sleeve terlihat profesional saat dipakai dengan blazer tipis. Pilih warna netral seperti krem atau sage agar lebih mudah dipadu dengan tas dan sepatu.",
      "<h3>3. Kemeja krem + rok plisket</h3>Kemeja krem yang diselipkan rapi ke Rok Plisket memberi kesan formal tanpa terasa kaku. Tambahkan sabuk tipis untuk memberi definisi pada pinggang.",
      "Rahasianya ada di bahan: katun combed yang adem membuatmu nyaman duduk berjam-jam di ruangan ber-AC tanpa gerah. Semua produk di atas tersedia di halaman koleksi.",
    ],
  },
  {
    id: 4,
    title: "Di Balik Proses: Kaos Combed yang Kami Banggakan",
    category: "Cerita",
    date: "2026-07-07",
    readTime: 5,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80",
    excerpt:
      "Dari pemilihan benang sampai jahitan akhir — begini perjalanan satu kaos AURELLE dibuat dengan hati.",
    content: [
      "Semua berawal dari benang. Kami memilih kapas berserat panjang yang dipintal halus, menghasilkan kain combed 30s yang lembut, adem, dan tidak menerawang. Benang inilah yang membuat kaos AURELLE nyaman dipakai dari pagi sampai malam.",
      "Kain kemudian dipotong dengan pola presisi agar motif tidak miring dan sisi kiri-kanan simetris. Setiap potongan diperiksa satu per satu sebelum masuk ke bagian penjahitan.",
      "Jahitan menggunakan teknik flatlock yang rata dan kuat di sisi dalam, sehingga tidak menggesek kulit dan tahan terhadap tarikan. Kerah dibuat dengan rib yang lentur — tidak mudah melar meski sering dipakai.",
      "Sebelum dikirim, setiap kaos melewati quality check akhir: cek jahitan, kerapian kerah, dan kebersihan kain. Baru setelah lolos, kaos itu layak sampai di tanganmu. Itulah kenapa kami yakin — setiap AURELLE yang kamu pakai adalah yang terbaik.",
    ],
  },
];
