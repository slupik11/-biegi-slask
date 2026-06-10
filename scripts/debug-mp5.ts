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

  // Znajdź wiersz kalendarza — ma największą liczbę TDs
  let maxTd = 0;
  let calendarTr: ReturnType<typeof $> | null = null;
  $("tr").each((_, tr) => {
    const count = $(tr).find("td").length;
    if (count > maxTd) {
      maxTd = count;
      calendarTr = $(tr);
    }
  });

  console.log(`Wiersz kalendarza ma ${maxTd} komórek`);

  if (!calendarTr) return;

  const tds = calendarTr.find("td").toArray();
  console.log("\nSzukam biegów śląskich przez indeksy TDs:\n");

  let slask = 0;
  for (let i = 0; i < tds.length; i++) {
    const td = $(tds[i]);
    const link = td.find("a[href*='action=5'][href*='bieganie']").first();
    if (!link.length) continue;

    const nazwa = link.text().trim();
    const href = link.attr("href") || "";

    // Dane są w poprzednich TDs
    const cityRaw = i >= 1 ? $(tds[i - 1]).text().trim() : "";
    const dateRaw = i >= 2 ? $(tds[i - 2]).text().trim() : "";

    // Sprawdź czy to śląskie
    const isSlask = /[śs]l[aą]sk|katowice|gliwice|bielsko|jaworzno|miasteczko|tychy|sosnowiec|rybnik|bytom|chorzów|zabrze|ruda/i.test(cityRaw + " " + nazwa);

    if (isSlask) {
      slask++;
      console.log(`ŚLĄSK [${i}]: "${nazwa}"`);
      console.log(`  data: "${dateRaw}" | miasto: "${cityRaw}"`);
      console.log(`  href: ${href}`);
    }
  }
  console.log(`\nZnaleziono śląskich: ${slask}`);

  // Pokaż też kilka przykładów co jest w TDs przed linkami
  console.log("\nPrzykłady TDs wokół linków (pierwsze 5):");
  let count = 0;
  for (let i = 0; i < tds.length && count < 5; i++) {
    const td = $(tds[i]);
    const link = td.find("a[href*='action=5'][href*='bieganie']").first();
    if (!link.length) continue;
    count++;
    const nazwa = link.text().trim().slice(0, 50);
    const city = i >= 1 ? $(tds[i - 1]).text().trim() : "N/A";
    const date = i >= 2 ? $(tds[i - 2]).text().trim() : "N/A";
    console.log(`  "${nazwa}" | prev1: "${city}" | prev2: "${date}"`);
  }
}

debug().catch(console.error);
