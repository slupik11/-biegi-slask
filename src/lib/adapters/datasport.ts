import * as cheerio from "cheerio";
import { FetchedEvent, TypBiegu } from "@/lib/types";
import { czyBiegSlask } from "@/lib/slask-cities";

const BASE = "https://liveds.datasport.pl";
const LIST_URL = `${BASE}/lista.html`;

function wykryjTyp(nazwa: string): TypBiegu {
  const n = nazwa.toLowerCase();
  if (n.includes("triatlon") || n.includes("triathlon")) return "triathlon";
  if (n.includes("maraton") && !n.includes("półmaraton") && !n.includes("pół")) return "maraton";
  if (n.includes("półmaraton") || n.includes("pół maraton")) return "półmaraton";
  if (n.includes("cross") || n.includes("przełaj") || n.includes("trail")) return "przełajowy";
  return "uliczny";
}

export async function fetchDatasport(): Promise<FetchedEvent[]> {
  const wyniki: FetchedEvent[] = [];
  const dzisiaj = new Date();

  let html: string;
  try {
    await new Promise((r) => setTimeout(r, 700));
    const res = await fetch(LIST_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BiegiSlaskBot/1.0; +https://biegislask.pl/bot)",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = await res.arrayBuffer();
    // Strona ma <meta charset="windows-1250">
    html = new TextDecoder("windows-1250").decode(buf);
  } catch (e) {
    console.warn("[Datasport] Błąd pobierania:", e);
    return [];
  }

  const $ = cheerio.load(html);

  // Struktura karty:
  // <div class="event-list-content mt-3 mt-lg-0">
  //   <h5 class="fs-19 mb-0"><a class="primary-link" href="...">Nazwa</a></h5>
  //   <p class="text-muted mb-2">2026-06-12</p>
  //   <ul class="list-inline mb-0 text-muted">
  //     <li class="list-inline-item"><i class="mdi mdi-map-marker"></i> Miasto</li>
  //   </ul>
  // </div>

  $(".event-list-content").each((_, el) => {
    const $el = $(el);

    const $link = $el.find("a.primary-link").first();
    const nazwa = $link.text().trim();
    const href = $link.attr("href") || "";

    if (!nazwa || nazwa.length < 3 || !href) return;

    const dataRaw = $el.find("p.text-muted").first().text().trim();
    const data = new Date(dataRaw);
    if (isNaN(data.getTime()) || data < dzisiaj) return;

    // Miasto: tekst w <li class="list-inline-item"> po usunięciu ikony
    const miastoRaw = $el.find(".list-inline-item").first().text().trim();
    const miasto = miastoRaw.replace(/^[\s\W]+/, "").trim(); // usuń ikonę z początku

    if (!czyBiegSlask(miasto, nazwa)) return;

    const linkPelny = href.startsWith("http") ? href : `${BASE}/${href.replace(/^\//, "")}`;
    const idMatch = href.match(/zawody(\d+)/);
    const zewnetrznyId = idMatch ? `ds-${idMatch[1]}` : `ds-${nazwa.slice(0, 40).replace(/\s+/g, "-")}`;

    wyniki.push({
      nazwa,
      data,
      miasto,
      wojewodztwo: "śląskie",
      dystanse: [],
      typ: wykryjTyp(nazwa),
      linkDoZapisow: linkPelny,
      zrodlo: "datasport",
      zewnetrznyId,
    });
  });

  return wyniki;
}
