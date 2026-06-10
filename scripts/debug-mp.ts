import * as cheerio from "cheerio";

async function debug() {
  const res = await fetch(
    "https://maratonypolskie.pl/mp_index.php?dzial=3&action=1&grp=13&trgr=1",
    { headers: { "User-Agent": "Mozilla/5.0 (compatible; BiegiSlaskBot/1.0)" } }
  );
  console.log("Status:", res.status);
  const html = await res.text();
  console.log("HTML length:", html.length);

  const $ = cheerio.load(html);
  const tables = $("table");
  console.log("Liczba tabel:", tables.length);

  // Wydrukuj pierwsze 5 wierszy każdej tabeli
  tables.each((ti, table) => {
    const rows = $(table).find("tr");
    console.log(`\nTabela ${ti}: ${rows.length} wierszy`);
    rows.slice(0, 3).each((ri, row) => {
      const cells = $(row).find("td");
      console.log(`  Wiersz ${ri}: ${cells.length} komórek`);
      cells.each((ci, cell) => {
        const txt = $(cell).text().trim().slice(0, 60);
        const hasLink = $(cell).find("a").length > 0;
        const hasImg = $(cell).find("img").length > 0;
        console.log(`    td[${ci}]: "${txt}" ${hasLink ? "[LINK: " + $(cell).find("a").attr("href") + "]" : ""} ${hasImg ? "[IMG]" : ""}`);
      });
    });
  });
}

debug().catch(console.error);
