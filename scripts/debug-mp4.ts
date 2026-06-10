import * as cheerio from "cheerio";

async function debug() {
  const res = await fetch(
    "https://maratonypolskie.pl/mp_index.php?dzial=3&action=1&grp=13&trgr=1",
    { headers: { "User-Agent": "Mozilla/5.0 (compatible; BiegiSlaskBot/1.0)" } }
  );

  const buf = await res.arrayBuffer();
  const utf8 = new TextDecoder("utf-8").decode(buf);
  const html = /[ąęśćźżółń]/i.test(utf8) ? utf8 : new TextDecoder("iso-8859-2").decode(buf);

  const $ = cheerio.load(html);

  // Pokaż WSZYSTKIE linki z &bieganie — pierwsze 20
  console.log("Pierwsze 20 linków z &bieganie:\n");
  $("a[href*='action=5'][href*='bieganie']").slice(0, 20).each((i, el) => {
    const tekst = $(el).text().trim();
    const href = $(el).attr("href") || "";
    // Sprawdź czy tekst pasuje do regex i dlaczego nie
    const m1 = tekst.match(/^(\d{4}\.\d{2}\.\d{2})\s+-\s+(.+?)\s+\(([^)]+)\)\s*$/);
    const m2 = tekst.match(/^(\d{4}\.\d{2}\.\d{2})/);
    console.log(`[${i}] "${tekst.slice(0, 80)}"`);
    if (!m1) {
      if (m2) console.log(`    ^ Ma datę ale nie pasuje do pełnego regex`);
      else console.log(`    ^ Brak daty`);
    } else {
      console.log(`    ^ OK: ${m1[1]} | ${m1[2]} | ${m1[3]}`);
    }
  });
}

debug().catch(console.error);
