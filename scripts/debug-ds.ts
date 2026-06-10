import * as cheerio from "cheerio";

async function debug() {
  const res = await fetch("https://liveds.datasport.pl/lista.html", {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; BiegiSlaskBot/1.0)" },
  });
  console.log("Status:", res.status, "CT:", res.headers.get("content-type"));
  const html = await res.text();
  console.log("HTML length:", html.length);

  const $ = cheerio.load(html);

  // Znajdź wszystkie linki do stron zawodów
  const linki = $("a[href*='zawody']");
  console.log("Linki do zawodów:", linki.length);

  // Wypisz pierwsze 5 linków i kontekst
  linki.slice(0, 5).each((i, el) => {
    const $el = $(el);
    const href = $el.attr("href");
    const tekst = $el.text().trim().slice(0, 60);
    const parent = $el.parent();
    const parentTag = parent.prop("tagName");
    const parentClass = parent.attr("class") || "";
    const grandparent = parent.parent();
    const gpTag = grandparent.prop("tagName");
    const gpClass = grandparent.attr("class") || "";
    console.log(`\n[${i}] "${tekst}"`);
    console.log(`  href: ${href}`);
    console.log(`  parent: <${parentTag} class="${parentClass}">`);
    console.log(`  grandparent: <${gpTag} class="${gpClass}">`);
    console.log(`  grandparent text (100): "${grandparent.text().trim().slice(0, 100)}"`);
  });

  // Pokaż pierwsze 500 znaków HTML żeby zobaczyć strukturę
  console.log("\n--- Pierwsze 1000 znaków body ---");
  console.log(html.slice(0, 1000));
}

debug().catch(console.error);
