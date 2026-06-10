import { FetchedEvent, TypBiegu } from "@/lib/types";
import { czyBiegSlask } from "@/lib/slask-cities";

const BASE = "https://dostartu.pl";

function wykryjTyp(nazwa: string, dystans: string): TypBiegu {
  const n = (nazwa + " " + dystans).toLowerCase();
  if (n.includes("triatlon") || n.includes("triathlon")) return "triathlon";
  if (n.includes("maraton") && !n.includes("półmaraton") && !n.includes("pół")) return "maraton";
  if (n.includes("półmaraton") || n.includes("pół maraton")) return "półmaraton";
  if (n.includes("cross") || n.includes("przełaj") || n.includes("trail")) return "przełajowy";
  return "uliczny";
}

function normalizujDystanse(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw.split(/[,;/]+/).map((d) => d.trim()).filter(Boolean);
}

export async function fetchDoStartu(): Promise<FetchedEvent[]> {
  // Playwright jest importowany dynamicznie — nie wczytujemy go w środowisku przeglądarki
  const { chromium } = await import("playwright");

  const wyniki: FetchedEvent[] = [];
  const dzisiaj = new Date();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (compatible; BiegiSlaskBot/1.0; +https://biegislask.pl/bot)",
    locale: "pl-PL",
  });

  try {
    const page = await context.newPage();

    // Szukamy biegów przez wbudowaną wyszukiwarkę DoStartu
    const frazy = ["śląsk", "katowice", "gliwice", "rybnik", "tychy", "sosnowiec", "bielsko"];

    for (const fraza of frazy) {
      try {
        await page.goto(`${BASE}/zawody?query=${encodeURIComponent(fraza)}`, {
          waitUntil: "networkidle",
          timeout: 20000,
        });
        await page.waitForTimeout(1500);

        // Szukamy kafelków/kart zawodów — DoStartu używa React, sprawdzamy różne selektory
        const karty = await page.$$eval(
          'a[href^="/"], [class*="event"], [class*="Event"], [class*="zawod"], [class*="race"], article',
          (els) =>
            els.map((el) => ({
              href: (el as HTMLAnchorElement).href || el.querySelector("a")?.href || "",
              tekst: el.textContent?.replace(/\s+/g, " ").trim() || "",
            }))
        );

        for (const karta of karty) {
          if (!karta.href || !karta.tekst) continue;

          // Wyciągamy nazwe — zwykle pierwszy blok tekstu
          const linie = karta.tekst.split(/\n|\|/).map((l) => l.trim()).filter(Boolean);
          const nazwa = linie[0] || "";
          if (!nazwa || nazwa.length < 5) continue;

          // Szukamy daty w formacie dd.mm.yyyy lub d miesiac yyyy
          const dataMatch = karta.tekst.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
          if (!dataMatch) continue;
          const data = new Date(
            Number(dataMatch[3]),
            Number(dataMatch[2]) - 1,
            Number(dataMatch[1]),
            10, 0, 0
          );
          if (data < dzisiaj) continue;

          // Szukamy miasta
          const miastoMatch = karta.tekst.match(/\d{2}-\d{3}\s+([\w\s-]+)/);
          const miasto = miastoMatch ? miastoMatch[1].trim() : fraza;

          if (!czyBiegSlask(miasto, nazwa)) continue;

          const slugMatch = karta.href.match(/dostartu\.pl\/([^/?#]+)/);
          const zewnetrznyId = slugMatch ? `dostartu-${slugMatch[1]}` : `dostartu-${nazwa.slice(0, 40)}`;

          const dystansMatch = karta.tekst.match(/(\d+[\s.,]*km)/gi);
          const dystanse = normalizujDystanse(dystansMatch?.join(", "));

          wyniki.push({
            nazwa,
            data,
            miasto,
            wojewodztwo: "śląskie",
            dystanse,
            typ: wykryjTyp(nazwa, dystanse.join(" ")),
            linkDoZapisow: karta.href,
            zrodlo: "dostartu",
            zewnetrznyId,
          });
        }
      } catch (e) {
        console.warn(`[DoStartu] Błąd dla frazy "${fraza}":`, e);
      }

      await page.waitForTimeout(1000); // grzeczna przerwa między zapytaniami
    }
  } finally {
    await context.close();
    await browser.close();
  }

  // Deduplikacja po zewnetrznyId
  const unikalne = new Map<string, FetchedEvent>();
  for (const w of wyniki) {
    if (!unikalne.has(w.zewnetrznyId)) unikalne.set(w.zewnetrznyId, w);
  }

  return Array.from(unikalne.values());
}
