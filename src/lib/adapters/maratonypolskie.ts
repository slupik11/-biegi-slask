// UWAGA: maratonypolskie.pl ma w robots.txt Disallow: / dla botów innych niż Googlebot.
// Adapter wdrożony na wyraźne życzenie właściciela projektu.
// Pobieramy tylko publiczne fakty: nazwa, data, miasto, dystans, link.
import * as cheerio from "cheerio";
import { FetchedEvent, TypBiegu } from "@/lib/types";
import { czyBiegSlask } from "@/lib/slask-cities";

const BASE = "https://maratonypolskie.pl";
const CALENDAR_URL = `${BASE}/mp_index.php?dzial=3&action=1&grp=13&trgr=1`;

function parsujDate(tekst: string): Date | null {
  const t = tekst.trim();
  // Format "d.m.YYYY (so)" lub "dd.mm.YYYY"
  let m = t.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (m) return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), 10, 0, 0);
  // Format zakresu "dd-dd.mm.YYYY" lub "dd-dd.mm.YYYY" — bierzemy datę końcową
  m = t.match(/\d{1,2}-(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (m) return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), 10, 0, 0);
  return null;
}

function wyglądaJakData(tekst: string): boolean {
  return tekst.length < 30 && /\d{1,2}[\.\-]\d{1,2}[\.\-]\.?\d{4}/.test(tekst);
}

function wyglądaJakMiasto(tekst: string): boolean {
  return tekst.length > 1 && tekst.length < 80 && !/div|css|position|border|px/.test(tekst.toLowerCase());
}

function wykryjTyp(nazwa: string): TypBiegu {
  const n = nazwa.toLowerCase();
  if (n.includes("triatlon") || n.includes("triathlon")) return "triathlon";
  if (n.includes("maraton") && !n.includes("półmaraton") && !n.includes("pół")) return "maraton";
  if (n.includes("półmaraton") || n.includes("pół maraton") || n.includes("polmaraton")) return "półmaraton";
  if (n.includes("cross") || n.includes("przełaj") || n.includes("trail")) return "przełajowy";
  return "uliczny";
}

async function pobierzStrone(url: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 1000));
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; BiegiSlaskBot/1.0; +https://biegislask.pl/bot)",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} dla ${url}`);

  const buf = await res.arrayBuffer();
  // Próbuj UTF-8 najpierw, potem ISO-8859-2 (stary standard polskich stron)
  const utf8 = new TextDecoder("utf-8").decode(buf);
  if (/[ąęśćźżółń]/i.test(utf8)) return utf8;
  return new TextDecoder("iso-8859-2").decode(buf);
}

export async function fetchMaratonyPolskie(): Promise<FetchedEvent[]> {
  const wyniki: FetchedEvent[] = [];
  const dzisiaj = new Date();

  let html: string;
  try {
    html = await pobierzStrone(CALENDAR_URL);
  } catch (e) {
    console.warn("[MaratonyPolskie] Błąd pobierania:", e);
    return [];
  }

  const $ = cheerio.load(html);

  // Cały kalendarz to jeden wiersz tabeli z ~900 komórkami TD.
  // Wzorzec grup: [IMG/ikona] [data] [miasto] [<a>nazwa</a>]
  // Szukamy wiersza z największą liczbą TDs.
  let maxTd = 0;
  let calendarTr: ReturnType<typeof $> | null = null;
  $("tr").each((_, tr) => {
    const count = $(tr).find("td").length;
    if (count > maxTd) {
      maxTd = count;
      calendarTr = $(tr);
    }
  });

  if (!calendarTr || maxTd < 50) {
    console.warn("[MaratonyPolskie] Nie znaleziono wiersza kalendarza");
    return [];
  }

  const tds = calendarTr.find("td").toArray();

  for (let i = 0; i < tds.length; i++) {
    const td = $(tds[i]);
    const link = td.find("a[href*='action=5'][href*='bieganie']").first();
    if (!link.length) continue;

    const nazwa = link.text().trim();
    const href = link.attr("href") || "";
    if (!nazwa || nazwa.length < 3) continue;

    // Dane są w poprzednich TDs: [i-1]=miasto, [i-2]=data
    if (i < 2) continue;

    const miastoRaw = $(tds[i - 1]).text().trim();
    const dataRaw = $(tds[i - 2]).text().trim();

    // Walidacja: TD z miastem i datą muszą wyglądać sensownie
    if (!wyglądaJakMiasto(miastoRaw) || !wyglądaJakData(dataRaw)) continue;

    const data = parsujDate(dataRaw);
    if (!data || data < dzisiaj) continue;

    // Miasto może zawierać dystans np. "Jaworzno15 km." — wycinamy nazwę
    const miastoMatch = miastoRaw.match(/^([^\d]+)/);
    const miasto = miastoMatch ? miastoMatch[1].replace(/,\s*$/, "").trim() : miastoRaw;
    if (!miasto || miasto.length < 2) continue;

    if (!czyBiegSlask(miasto, nazwa)) continue;

    const linkPelny = href.startsWith("http") ? href : `${BASE}/${href.replace(/^\//, "")}`;
    const codeMatch = href.match(/code=(\d+)/);
    const zewnetrznyId = codeMatch ? `mp-${codeMatch[1]}` : `mp-${nazwa.slice(0, 40).replace(/\s+/g, "-")}`;

    wyniki.push({
      nazwa,
      data,
      miasto,
      wojewodztwo: "śląskie",
      dystanse: [],
      typ: wykryjTyp(nazwa),
      linkDoZapisow: linkPelny,
      zrodlo: "maratonypolskie",
      zewnetrznyId,
    });
  }

  return wyniki;
}
