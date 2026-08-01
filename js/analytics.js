/* ==========================================================================
   AURELLE — Google Analytics 4 (opsional)
   Isi MEASUREMENT_ID dengan ID GA4 milikmu (analytics.google.com → Admin →
   Data Streams → Web). Selama masih "G-XXXXXXXXXX", skrip tidak mengirim
   data apa pun ke Google.
   ========================================================================== */
const MEASUREMENT_ID = "G-XXXXXXXXXX"; // TODO: ganti dengan ID GA4 kamu

(function () {
  if (MEASUREMENT_ID === "G-XXXXXXXXXX") return;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + MEASUREMENT_ID;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", MEASUREMENT_ID);
  window.gtag = gtag;
})();
