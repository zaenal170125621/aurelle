/* ==========================================================================
   AURELLE — Program afiliasi (afiliasi.html)
   Kalkulator simulasi komisi: 8% (1–5 pesanan), 10% (6–20), 12% (21+).
   ========================================================================== */

"use strict";

function afiliasiRate(units) {
  if (units >= 21) return 0.12;
  if (units >= 6) return 0.1;
  return 0.08;
}

function calcAfiliasi() {
  const units = Math.max(0, Number(document.getElementById("afUnits")?.value) || 0);
  const sales = Math.max(0, Number(document.getElementById("afSales")?.value) || 0);
  const result = document.getElementById("afResult");
  if (!result) return;

  const rate = afiliasiRate(units);
  const komisi = sales * rate;
  const tier = rate === 0.12 ? "21+ pesanan" : rate === 0.1 ? "6–20 pesanan" : "1–5 pesanan";

  result.innerHTML = `
    <div class="calc-line">
      <span>Tier kamu</span>
      <strong>${Math.round(rate * 100)}% · ${tier}</strong>
    </div>
    <div class="calc-line">
      <span>Perkiraan komisi bulan ini</span>
      <strong class="calc-komisi">${formatRupiah(komisi)}</strong>
    </div>`;
}

function initAfiliasi() {
  const units = document.getElementById("afUnits");
  const sales = document.getElementById("afSales");
  if (!units || !sales) return;

  units.addEventListener("input", calcAfiliasi);
  sales.addEventListener("input", calcAfiliasi);
  calcAfiliasi();
}

document.addEventListener("DOMContentLoaded", () => {
  initAfiliasi();
});
