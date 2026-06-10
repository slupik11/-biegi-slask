import * as cheerio from "cheerio";

async function debug() {
  const res = await fetch(
    "https://maratonypolskie.pl/mp_index.php?dzial=3&action=1&grp=13&trgr=1",
    { headers: { "User-Agent": "Mozilla/5.0 (compatible; BiegiSlaskBot/1.0)" } }
  );

  const buf = await res.arrayBuffer();
  const utf8 = new TextDecoder("utf-8").decode(buf);
  const html = /[ąęśćźżółń]/i.test(utf8) ? utf8 : new TextDecoder("iso-8859-2").decode(buf);

  console.log("Polskie znaki OK?", /[ąęśćźżółń]/i.test(html));

  const $ = cheerio.load(html);

  // Sprawdź ile linków z &bieganie
  const linkiBieganie = $("a[href*='action=5'][href*='bieganie']");
  console.log("Linki z &bieganie:", linkiBieganie.length);

  // Sprawdź ile wszystkich linków action=5
  const wszystkieLinki = $("a[href*='action=5']");
  console.log("Wszystkie linki action=5:", wszystkieLinki.length);

  // Pokaż pierwsze 5 linków z ich tekstem i href
  console.log("\nPierwsze 5 linków action=5:");
  wszystkieLinki.slice(0, 5).each((i, el) => {
    const tekst = $(el).text().trim();
    const href = $(el).attr("href");
    console.log(`  [${i}] tekst: "${tekst}" | href: "${href}"`);
  });

  // Testuj regex na wszystkich linkach
  let dopasowane = 0;
  let slask = 0;
  wszystkieLinki.each((_, el) => {
    const tekst = $(el).text().trim();
    const match = tekst.match(/^(\d{4}\.\d{2}\.\d{2})\s+-\s+(.+?)\s+\(([^)]+)\)\s*$/);
    if (match) {
      dopasowane++;
      const [, data, nazwa, miasto] = match;
      if (miasto.toLowerCase().includes("śląsk") ||
          miasto.toLowerCase().includes("katowice") ||
          miasto.toLowerCase().includes("gliwice") ||
          miasto.toLowerCase().includes("bielsko") ||
          miasto.toLowerCase().includes("jaworzno") ||
          miasto.toLowerCase().includes("miasteczko")) {
        slask++;
        console.log(`  ŚLĄSK: ${data} - ${nazwa} (${miasto})`);
      }
    }
  });
  console.log(`\nDopasowane regex: ${dopasowane} | Śląskie: ${slask}`);

  // Pokaż kilka linków które NIE dopasowały
  console.log("\nLinki które NIE pasują do regex:");
  let ile = 0;
  wszystkieLinki.each((_, el) => {
    if (ile >= 3) return;
    const tekst = $(el).text().trim();
    const match = tekst.match(/^(\d{4}\.\d{2}\.\d{2})\s+-\s+(.+?)\s+\(([^)]+)\)\s*$/);
    if (!match && tekst.length > 10) {
      console.log(`  "${tekst.slice(0, 80)}"`);
      ile++;
    }
  });
}

debug().catch(console.error);
