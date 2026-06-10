import { FetchedEvent, TypBiegu } from "@/lib/types";
import { czyBiegSlask } from "@/lib/slask-cities";

const API_BASE = "https://api.dostartu.pl";
const LINK_BASE = "https://dostartu.pl";

// Typy zawodów DoStartu które uznajemy za biegowe
const TYPY_BIEGOWE = new Set([1, 2, 3, 4, 5, 6, 7, 8, 12, 13, 14]); // bieg, trail, maraton, półmaraton, nordic walking, OCR, przeszkodowe itp.

interface DSCompetition {
  id: number;
  name: string;
  location: string;
  locationLat: number | null;
  locationLng: number | null;
  startedTime: string;
  type: number;
  permaLink: string;
  descriptionPl?: string | null;
}

function wykryjTyp(nazwa: string, typ: number): TypBiegu {
  const n = nazwa.toLowerCase();
  if (n.includes("triatlon") || n.includes("triathlon")) return "triathlon";
  if (n.includes("maraton") && !n.includes("półmaraton") && !n.includes("pół")) return "maraton";
  if (n.includes("półmaraton") || n.includes("pół maraton")) return "półmaraton";
  if (n.includes("cross") || n.includes("przełaj") || n.includes("trail") || typ === 4) return "przełajowy";
  return "uliczny";
}

export async function fetchDoStartu(): Promise<FetchedEvent[]> {
  const wyniki: FetchedEvent[] = [];
  const dzisiaj = new Date();
  const dataSince = dzisiaj.toISOString();

  let strona = 1;
  const maxStron = 15; // max 1500 zawodów (po 100)

  while (strona <= maxStron) {
    await new Promise((r) => setTimeout(r, 500));

    const url = `${API_BASE}/competitions?dateSince=${encodeURIComponent(dataSince)}&page=${strona}&itemsPerPage=100`;

    let dane: { competitions: DSCompetition[] };
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; BiegiSlaskBot/1.0; +https://biegislask.pl/bot)",
          "Accept": "application/json",
        },
      });
      if (!res.ok) break;
      dane = await res.json();
    } catch (e) {
      console.warn(`[DoStartu] Błąd strony ${strona}:`, e);
      break;
    }

    const zawody = dane.competitions || [];
    if (zawody.length === 0) break; // koniec stron

    for (const z of zawody) {
      // Filtruj tylko zawody biegowe
      if (!TYPY_BIEGOWE.has(z.type)) continue;

      const data = new Date(z.startedTime);
      if (isNaN(data.getTime()) || data < dzisiaj) continue;

      // Miasto: DoStartu często dodaje ", SL" lub ", KR" itp. — bierzemy część przed przecinkiem
      const miasto = z.location.split(",")[0].trim();
      const lokalizacjaPelna = z.location;

      // Filtr śląski — sprawdź miasto I czy lokalizacja zawiera skrót "SL" (Śląsk)
      const czySlaskApiTag = /\bSL\b/i.test(lokalizacjaPelna);
      if (!czySlaskApiTag && !czyBiegSlask(miasto, z.name)) continue;

      const link = `${LINK_BASE}${z.permaLink}`;
      const zewnetrznyId = `dostartu-${z.id}`;

      wyniki.push({
        nazwa: z.name,
        data,
        miasto,
        wojewodztwo: "śląskie",
        dystanse: [],
        typ: wykryjTyp(z.name, z.type),
        linkDoZapisow: link,
        opis: z.descriptionPl?.slice(0, 500) || undefined,
        lat: z.locationLat || undefined,
        lng: z.locationLng || undefined,
        zrodlo: "dostartu",
        zewnetrznyId,
      } as FetchedEvent & { lat?: number; lng?: number });
    }

    strona++;
  }

  return wyniki;
}
