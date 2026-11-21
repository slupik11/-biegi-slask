import { prisma } from "@/lib/prisma";
import { FetchedEvent } from "@/lib/types";
import { fetchPersonalBest } from "@/lib/adapters/personalbest";
import { fetchMaratonyPolskie } from "@/lib/adapters/maratonypolskie";
import { fetchDoStartu } from "@/lib/adapters/dostartu";
import { fetchDatasport } from "@/lib/adapters/datasport";

export interface WynikAdaptera {
  zrodlo: string;
  znalezione: number;
  zapisane: number;
  bledy: number;
  blad?: string;
}

async function zapiszBiegi(biegi: FetchedEvent[]): Promise<{ zapisane: number; bledy: number; ostatniBlad?: string }> {
  let zapisane = 0;
  let bledy = 0;
  let ostatniBlad: string | undefined;

  for (const bieg of biegi) {
    try {
      await prisma.bieg.upsert({
        where: {
          zewnetrznyId_zrodlo: { zewnetrznyId: bieg.zewnetrznyId, zrodlo: bieg.zrodlo },
        },
        update: {
          nazwa: bieg.nazwa,
          data: bieg.data,
          miasto: bieg.miasto,
          dystanse: JSON.stringify(bieg.dystanse),
          typ: bieg.typ,
          linkDoZapisow: bieg.linkDoZapisow || null,
          opis: bieg.opis || null,
        },
        create: {
          nazwa: bieg.nazwa,
          data: bieg.data,
          miasto: bieg.miasto,
          wojewodztwo: bieg.wojewodztwo || "śląskie",
          dystanse: JSON.stringify(bieg.dystanse),
          typ: bieg.typ,
          linkDoZapisow: bieg.linkDoZapisow || null,
          opis: bieg.opis || null,
          zrodlo: bieg.zrodlo,
          zewnetrznyId: bieg.zewnetrznyId,
          status: "do_akceptacji",
        },
      });
      zapisane++;
    } catch (e) {
      bledy++;
      ostatniBlad = e instanceof Error ? e.message.split("\n").filter(Boolean).pop() : String(e);
      // Baza nie odpowiada — nie ma sensu próbować reszty
      if (bledy >= 3 && zapisane === 0) break;
    }
  }

  return { zapisane, bledy, ostatniBlad };
}

/** Pobiera biegi ze wszystkich źródeł i zwraca podsumowanie (zamiast udawać sukces). */
export async function fetchAll(): Promise<WynikAdaptera[]> {
  const adaptery: Array<{ nazwa: string; fn: () => Promise<FetchedEvent[]> }> = [
    { nazwa: "Personal Best", fn: fetchPersonalBest },
    { nazwa: "Maratony Polskie", fn: fetchMaratonyPolskie },
    { nazwa: "DoStartu", fn: fetchDoStartu },
    { nazwa: "DataSport", fn: fetchDatasport },
  ];

  // Wszystkie źródła pobieramy równolegle — szybciej i mieścimy się w limicie czasu Vercela
  return Promise.all(
    adaptery.map(async ({ nazwa, fn }): Promise<WynikAdaptera> => {
      try {
        const biegi = await fn();
        const { zapisane, bledy, ostatniBlad } = await zapiszBiegi(biegi);
        console.log(`[${nazwa}] znaleziono ${biegi.length}, zapisano ${zapisane}, błędy ${bledy}`);
        return { zrodlo: nazwa, znalezione: biegi.length, zapisane, bledy, blad: ostatniBlad };
      } catch (e) {
        const blad = e instanceof Error ? e.message : String(e);
        console.error(`[${nazwa}] błąd adaptera:`, blad);
        return { zrodlo: nazwa, znalezione: 0, zapisane: 0, bledy: 1, blad };
      }
    })
  );
}
