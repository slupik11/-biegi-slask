import * as cheerio from "cheerio";

async function debug() {
  const res = await fetch(
    "https://maratonypolskie.pl/mp_index.php?dzial=3&action=1&grp=13&trgr=1",
    { headers: { "User-Agent": "Mozilla/5.0 (compatible; BiegiSlaskBot/1.0)" } }
  );

  const ct = res.headers.get("content-type") || "";
  console.log("Content-Type:", ct);

  const buf = await res.arrayBuffer();
  let html = new TextDecoder("utf-8").decode(buf);
  if (!/[ąęśćźżółń]/i.test(html)) {
    console.log("UTF-8 nie działa, próbuję windows-1250...");
    html = new TextDecoder("windows-1250").decode(buf);
  }

  // Sprawdź czy polskie znaki są poprawne
  const testIdx = html.indexOf("laskie");
  console.log("Fragment wokół 'laskie':", html.slice(Math.max(0, testIdx - 5), testIdx + 20));

  const $ = cheerio.load(html);

  let znalezioneLinki = 0;
  let testowane = 0;

  $("a[href*='action=5']").each((_, link) => {
    znalezioneLinki++;
    const $link = $(link);
    const nazwa = $link.text().trim();
    const href = $link.attr("href") || "";

    const $tdNazwa = $link.parent("td");
    const $tdMiejsce = $tdNazwa.prev("td");
    const $tdData = $tdMiejsce.prev("td");

    const miejsceRaw = $tdMiejsce.text().trim();
    const dataRaw = $tdData.text().trim();

    testowane++;
    if (testowane <= 10) {
      console.log(`\nBieg: "${nazwa}"`);
      console.log(`  href: ${href}`);
      console.log(`  miejsce raw: "${miejsceRaw}"`);
      console.log(`  data raw: "${dataRaw}"`);
      const miastoMatch = miejsceRaw.match(/^([^\d]+)/);
      const miasto = miastoMatch ? miastoMatch[1].trim() : miejsceRaw;
      console.log(`  miasto extracted: "${miasto}"`);
    }
  });

  console.log(`\nŁącznie linków action=5: ${znalezioneLinki}`);
}

debug().catch(console.error);
