import * as cheerio from "cheerio";
import { FetchedEvent, TypBiegu } from "@/lib/types";
import { czyBiegSlask } from "@/lib/slask-cities";

const BASE = "https://personalbest.pl";
const LATA = [new Date().getFullYear(), new Date().getFullYear() + 1];

function parsujDate(tekst: string): Date | null {
  // Format: "17 styczeń 2026", "1 marca 2026"
  const MIESIACE: Record<string, number> = {
    styczeń: 0, stycznia: 0,
    luty: 1, lutego: 1,
    marzec: 2, marca: 2,
    kwiecień: 3, kwietnia: 3,
    maj: 4, maja: 4,
    czerwiec: 5, czerwca: 5,
    lipiec: 6, lipca: 6,
    sierpień: 7, sierpnia: 7,
    wrzesień: 8, września: 8,
    październik: 9, października: 9,
    listopad: 10, listopada: 10,
    grudzień: 11, grudnia: 11,
  };
  const m = tekst.trim().toLowerCase().match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
  if (!m) return null;
  const miesiac = MIESIACE[m[2]];
  if (miesiac === undefined) return null;
  return new Date(Number(m[3]), miesiac, Number(m[1]), 10, 0, 0);
}

function wykryjTyp(nazwa: string, dystans: string): TypBiegu {
  const n = (nazwa + " " + dystans).toLowerCase();
  if (n.includes("triatlon") || n.includes("triathlon")) return "triathlon";
  if (n.includes("maraton") && !n.includes("półmaraton") && !n.includes("pół")) return "maraton";
  if (n.includes("półmaraton") || n.includes("pół maraton") || n.includes("21")) return "półmaraton";
  if (n.includes("cross") || n.includes("przełaj") || n.includes("trail")) return "przełajowy";
  return "uliczny";
}

async function pobierzStrone(url: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 800)); // grzeczne tempo
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; BiegiSlaskBot/1.0; +https://biegislask.pl/bot)",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} dla ${url}`);
  return res.text();
}

export async function fetchPersonalBest(): Promise<FetchedEvent[]> {
  const wyniki: FetchedEvent[] = [];
  const dzisiaj = new Date();

  for (const rok of LATA) {
    const url = `${BASE}/imprezy-${rok}/`;
    let html: string;
    try {
      html = await pobierzStrone(url);
    } catch {
      // Rok może jeszcze nie istnieć na stronie — pomijamy po cichu
      continue;
    }

    const $ = cheerio.load(html);

    $("table tr").each((_, row) => {
      const komorki = $(row).find("td");
      if (komorki.length < 4) return;

      // Struktura: [logo] [nazwa] [dystans] [data] [miasto] [wyniki?]
      let nazwa = "", dystansRaw = "", dataRaw = "", miasto = "";

      if (komorki.length >= 5) {
        nazwa = $(komorki[1]).text().trim();
        dystansRaw = $(komorki[2]).text().trim();
        dataRaw = $(komorki[3]).text().trim();
        miasto = $(komorki[4]).text().trim();
      } else if (komorki.length === 4) {
        nazwa = $(komorki[0]).text().trim();
        dystansRaw = $(komorki[1]).text().trim();
        dataRaw = $(komorki[2]).text().trim();
        miasto = $(komorki[3]).text().trim();
      }

      if (!nazwa || !dataRaw || !miasto) return;

      const data = parsujDate(dataRaw);
      if (!data || data < dzisiaj) return;

      if (!czyBiegSlask(miasto, nazwa)) return;

      // Wyłuścij link do strony biegu
      const link = $(komorki[1]).find("a").attr("href") || $(row).find("a").attr("href");
      const linkPelny = link
        ? link.startsWith("http") ? link : `${BASE}/${link.replace(/^\//, "")}`
        : url;

      const dystanse = dystansRaw
        ? dystansRaw.split(/[,;/]+/).map((d) => d.trim()).filter(Boolean)
        : [];

      const zewnetrznyId = `pb-${rok}-${nazwa.slice(0, 40).replace(/\s+/g, "-").toLowerCase()}`;

      wyniki.push({
        nazwa,
        data,
        miasto: miasto.trim(),
        wojewodztwo: "śląskie",
        dystanse,
        typ: wykryjTyp(nazwa, dystansRaw),
        linkDoZapisow: linkPelny,
        zrodlo: "personalbest",
        zewnetrznyId,
      });
    });
  }

  return wyniki;
}
