/* Smoke test sementara: js/afiliasi.js (kalkulator komisi) — dihapus setelah dipakai */
const fs = require("fs");

const elements = {};
const handlers = {};
const domListeners = {};

function makeEl(id) {
  return {
    id,
    innerHTML: "",
    textContent: "",
    value: "",
    hidden: false,
    addEventListener(type, fn) {
      (handlers[id + ":" + type] ||= []).push(fn);
    },
    focus() {},
  };
}

global.document = {
  getElementById: (id) => (elements[id] ||= makeEl(id)),
  querySelectorAll: () => [],
  addEventListener: (t, fn) => {
    (domListeners[t] ||= []).push(fn);
  },
  body: { appendChild() {}, classList: { add() {}, remove() {} } },
};
global.window = { matchMedia: () => ({ matches: false }), scrollTo() {} };
global.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };

const testCode = `
function __test() {
  const assert = (c, m) => {
    if (!c) throw new Error("FAIL: " + m);
    console.log("ok - " + m);
  };

  // Tier rate
  assert(afiliasiRate(3) === 0.08, "1-5 pesanan -> 8%");
  assert(afiliasiRate(5) === 0.08, "5 pesanan -> 8%");
  assert(afiliasiRate(6) === 0.1, "6 pesanan -> 10%");
  assert(afiliasiRate(20) === 0.1, "20 pesanan -> 10%");
  assert(afiliasiRate(21) === 0.12, "21 pesanan -> 12%");
  assert(afiliasiRate(0) === 0.08, "0 pesanan -> 8%");

  // Inisialisasi: listener + hitungan awal (default HTML: 10 unit, 1.000.000)
  elements.afUnits.value = "10";
  elements.afSales.value = "1000000";
  domListeners["DOMContentLoaded"].forEach((fn) => fn());
  assert(handlers["afUnits:input"] && handlers["afUnits:input"].length === 1, "listener input unit terpasang");
  assert(handlers["afSales:input"] && handlers["afSales:input"].length === 1, "listener input penjualan terpasang");

  // Hitung awal (default 10 unit, 1.000.000) -> 10% -> Rp100.000
  assert(elements.afResult.innerHTML.includes("10% · 6–20 pesanan"), "tier default 10%");
  assert(elements.afResult.innerHTML.includes("Rp100.000"), "komisi default Rp100.000");

  // Tier 21+ -> 12%
  elements.afUnits.value = "30";
  elements.afSales.value = "2500000";
  calcAfiliasi();
  assert(elements.afResult.innerHTML.includes("12% · 21+ pesanan"), "tier 21+ -> 12%");
  assert(elements.afResult.innerHTML.includes("Rp300.000"), "komisi 12% dari 2,5jt = Rp300.000");

  // Tier awal -> 8%
  elements.afUnits.value = "3";
  elements.afSales.value = "500000";
  calcAfiliasi();
  assert(elements.afResult.innerHTML.includes("8% · 1–5 pesanan"), "tier awal -> 8%");
  assert(elements.afResult.innerHTML.includes("Rp40.000"), "komisi 8% dari 500rb = Rp40.000");

  // Input kosong/0 tidak error
  elements.afUnits.value = "";
  elements.afSales.value = "";
  calcAfiliasi();
  assert(elements.afResult.innerHTML.includes("Rp0"), "input kosong -> Rp0 tanpa error");

  console.log("SMOKE_TEST_PASSED");
}
__test();
`;

const src =
  fs.readFileSync("js/data.js", "utf8") +
  "\n" +
  fs.readFileSync("js/afiliasi.js", "utf8") +
  "\n" +
  testCode;
eval(src);
