/* ==========================================================================
   AURELLE — Data produk (dipakai oleh index.html & produk.html)
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
  },
];

const formatRupiah = (value) =>
  "Rp" + value.toLocaleString("id-ID").replace(/,/g, ".");

/* Kategori untuk filter di halaman katalog ("Semua" = tanpa filter) */
const KATEGORI = ["Semua", "Wanita", "Pria", "Aksesoris"];

/* Konfigurasi ongkir (dipakai halaman keranjang & checkout) */
const ONGKIR_FLAT = 20000;
const FREE_ONGKIR_MIN = 150000;
