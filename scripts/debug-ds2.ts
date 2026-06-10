import * as cheerio from "cheerio";

async function debug() {
  const res = await fetch("https://liveds.datasport.pl/lista.html", {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; BiegiSlaskBot/1.0)" },
  });
  const buf = await res.arrayBuffer();
  const html = new TextDecoder("windows-1250").decode(buf);
  const $ = cheerio.load(html);

  console.log("Polskie znaki OK:", /[ąęśćź]/i.test(html));

  // Znajdź pierwszą kartę zawodów
  const firstCard = $(".event-list-content").first().closest(".card, [class*='card'], div.col, li");
  console.log("\nKarta (outer HTML, 2000 znaków):\n", firstCard.prop("outerHTML")?.slice(0, 2000) || "BRAK");

  // Szukaj elementów z datą i miastem
  console.log("\n--- Szukam daty i miasta ---");
  const dataDivs = $("[class*='date'], [class*='data'], [class*='calendar'], time, .bi-calendar, .bi-geo").slice(0, 5);
  dataDivs.each((i, el) => {
    console.log(`[${i}] <${$(el).prop("tagName")} class="${$(el).attr("class")}"> "${$(el).text().trim().slice(0, 60)}"`);
  });

  // Wypisz kompletny HTML dla 2 zawodów
  const all = $(".event-list-content");
  console.log(`\nŁącznie .event-list-content: ${all.length}`);

  // Sprawdź czy śląskie są
  let slask = 0;
  all.each((_, el) => {
    const tekst = $(el).text();
    if (/śląsk|katowice|gliwice|rybnik|bytom|sosnowiec|tychy|chorzów/i.test(tekst)) {
      slask++;
      if (slask <= 3) console.log(`\nŚLĄSK: "${tekst.replace(/\s+/g, " ").trim().slice(0, 150)}"`);
    }
  });
  console.log(`Śląskich: ${slask}`);
}

debug().catch(console.error);
