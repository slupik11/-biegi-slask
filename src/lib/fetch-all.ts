import { prisma } from "@/lib/prisma";
import { FetchedEvent } from "@/lib/types";
import { fetchPersonalBest } from "@/lib/adapters/personalbest";
import { fetchMaratonyPolskie } from "@/lib/adapters/maratonypolskie";
import { fetchDoStartu } from "@/lib/adapters/dostartu";

async function zapiszBiegi(biegi: FetchedEvent[], zrodlo: string): Promise<{ nowe: number; pominięte: number }> {
  let nowe = 0;
  let pominięte = 0;

  for (const bieg of biegi) {
    try {
      await prisma.bieg.upsert({
        where: {
          zewnetrznyId_zrodlo: {
            zewnetrznyId: bieg.zewnetrznyId,
            zrodlo: bieg.zrodlo,
          },
        },
        update: {
          nazwa: bieg.nazwa,
          data: bieg.data,
          miasto: bieg.miasto,
          dystanse: JSON.stringify(bieg.dystanse),
          typ: bieg.typ,
          linkDoZapisow: bieg.linkDoZapisow || null,
          opis: bieg.opis || null,
          dataAktualizacji: new Date(),
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
      nowe++;
    } catch (e) {
      console.error(`[${zrodlo}] Błąd zapisu "${bieg.nazwa}":`, e);
      pominięte++;
    }
  }

  return { nowe, pominięte };
}

export async function fetchAll(): Promise<void> {
  console.log("=== Pobieranie biegów śląskich ===\n");

  const adaptery: Array<{ nazwa: string; fn: () => Promise<FetchedEvent[]> }> = [
    { nazwa: "Personal Best", fn: fetchPersonalBest },
    { nazwa: "Maratony Polskie", fn: fetchMaratonyPolskie },
    { nazwa: "DoStartu", fn: fetchDoStartu },
  ];

  for (const adapter of adaptery) {
    console.log(`▶ ${adapter.nazwa}...`);
    try {
      const biegi = await adapter.fn();
      console.log(`  Znaleziono: ${biegi.length} biegów śląskich`);

      if (biegi.length > 0) {
        const { nowe, pominięte } = await zapiszBiegi(biegi, adapter.nazwa);
        console.log(`  Zapisano: ${nowe} | Pominięto: ${pominięte}`);
      }
    } catch (e) {
      console.error(`  ❌ Błąd adaptera ${adapter.nazwa}:`, e);
    }
    console.log();
  }

  console.log("=== Gotowe ===");
}
