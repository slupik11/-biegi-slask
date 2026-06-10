"use client";

import Link from "next/link";
import { BiegDTO } from "@/lib/types";

const STYL_ZRODLA: Record<string, string> = {
  maratonypolskie: "bg-blue-600",
  dostartu:        "bg-emerald-600",
  datasport:       "bg-violet-600",
  personalbest:    "bg-rose-600",
  formularz:       "bg-amber-500",
  niszowe:         "bg-gray-500",
};

const NAZWY_MIESIECY = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień",
];

const NAZWY_DNI = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];

interface DzienInfo {
  date: Date;
  biegi: BiegDTO[];
}

interface MiesiacInfo {
  rok: number;
  miesiac: number; // 0-11
  dni: (DzienInfo | null)[]; // null = padding przed 1. dniem
  biegiWMiesiacu: number;
}

function grupujPoMiesiacach(biegi: BiegDTO[]): MiesiacInfo[] {
  if (biegi.length === 0) return [];

  // Zbierz unikalne pary rok-miesiąc
  const mapaMiesiecy = new Map<string, Map<string, BiegDTO[]>>();

  for (const bieg of biegi) {
    const d = new Date(bieg.data);
    const kluczMiesiaca = `${d.getFullYear()}-${d.getMonth()}`;
    const kluczDnia = d.toISOString().slice(0, 10);

    if (!mapaMiesiecy.has(kluczMiesiaca)) {
      mapaMiesiecy.set(kluczMiesiaca, new Map());
    }
    const mapaDni = mapaMiesiecy.get(kluczMiesiaca)!;
    if (!mapaDni.has(kluczDnia)) {
      mapaDni.set(kluczDnia, []);
    }
    mapaDni.get(kluczDnia)!.push(bieg);
  }

  const wynik: MiesiacInfo[] = [];

  for (const [kluczMiesiaca, mapaDni] of mapaMiesiecy) {
    const [rok, miesiac] = kluczMiesiaca.split("-").map(Number);
    const pierwszyDzien = new Date(rok, miesiac, 1);
    const ostatniDzien = new Date(rok, miesiac + 1, 0);

    // Offset: w Polsce tydzień zaczyna się od poniedziałku (0=Pn)
    // getDay() zwraca 0=Nd, 1=Pn, ..., 6=Sb
    const offsetDnia = (pierwszyDzien.getDay() + 6) % 7; // 0=Pn

    const dni: (DzienInfo | null)[] = [];

    // Padding przed 1. dniem
    for (let p = 0; p < offsetDnia; p++) {
      dni.push(null);
    }

    // Wszystkie dni miesiąca
    for (let d = 1; d <= ostatniDzien.getDate(); d++) {
      const date = new Date(rok, miesiac, d);
      const klucz = date.toISOString().slice(0, 10);
      dni.push({ date, biegi: mapaDni.get(klucz) || [] });
    }

    wynik.push({
      rok,
      miesiac,
      dni,
      biegiWMiesiacu: Array.from(mapaDni.values()).reduce((s, b) => s + b.length, 0),
    });
  }

  // Sortuj chronologicznie
  wynik.sort((a, b) => a.rok !== b.rok ? a.rok - b.rok : a.miesiac - b.miesiac);
  return wynik;
}

export function KalendarzBiegow({ biegi }: { biegi: BiegDTO[] }) {
  const miesiace = grupujPoMiesiacach(biegi);

  return (
    <div className="space-y-8">
      {miesiace.map(({ rok, miesiac, dni, biegiWMiesiacu }) => (
        <div key={`${rok}-${miesiac}`} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Nagłówek miesiąca */}
          <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-lg">
              {NAZWY_MIESIECY[miesiac]} {rok}
            </h2>
            <span className="text-sm text-gray-500">
              {biegiWMiesiacu} {biegiWMiesiacu === 1 ? "bieg" : biegiWMiesiacu < 5 ? "biegi" : "biegów"}
            </span>
          </div>

          {/* Siatka kalendarza */}
          <div className="p-4">
            {/* Nagłówki dni tygodnia */}
            <div className="grid grid-cols-7 mb-2">
              {NAZWY_DNI.map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Siatka dni */}
            <div className="grid grid-cols-7 gap-1">
              {dni.map((dzien, idx) => {
                if (!dzien) {
                  return <div key={`pad-${idx}`} />;
                }

                const maBiegi = dzien.biegi.length > 0;
                const dzisiaj = new Date();
                const czyDzisiaj =
                  dzien.date.getDate() === dzisiaj.getDate() &&
                  dzien.date.getMonth() === dzisiaj.getMonth() &&
                  dzien.date.getFullYear() === dzisiaj.getFullYear();

                return (
                  <div
                    key={dzien.date.toISOString()}
                    className={`min-h-[3.5rem] rounded-lg p-1.5 flex flex-col gap-1 ${
                      maBiegi
                        ? "bg-orange-50 border border-orange-200"
                        : czyDzisiaj
                        ? "bg-blue-50 border border-blue-200"
                        : "bg-gray-50 border border-transparent"
                    }`}
                  >
                    <span
                      className={`text-xs font-semibold self-start leading-none ${
                        czyDzisiaj
                          ? "text-blue-600"
                          : maBiegi
                          ? "text-orange-700"
                          : "text-gray-400"
                      }`}
                    >
                      {dzien.date.getDate()}
                    </span>

                    {/* Biegi w tym dniu */}
                    {dzien.biegi.map((bieg) => (
                      <Link
                        key={bieg.id}
                        href={`/bieg/${bieg.id}`}
                        className="block"
                        title={`${bieg.nazwa} — ${bieg.miasto}`}
                      >
                        <div className="flex items-center gap-1 group">
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${STYL_ZRODLA[bieg.zrodlo] || "bg-gray-400"}`}
                          />
                          <span className="text-xs text-gray-800 leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors">
                            {bieg.nazwa}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lista biegów miesiąca pod kalendarzem */}
          <div className="border-t border-gray-100 px-5 pb-4 pt-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Biegi w {NAZWY_MIESIECY[miesiac].toLowerCase()}:
            </h3>
            <div className="space-y-2">
              {biegi
                .filter((b) => {
                  const d = new Date(b.data);
                  return d.getMonth() === miesiac && d.getFullYear() === rok;
                })
                .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
                .map((bieg) => {
                  const d = new Date(bieg.data);
                  return (
                    <Link
                      key={bieg.id}
                      href={`/bieg/${bieg.id}`}
                      className="flex items-start gap-3 group py-1.5 border-b border-gray-50 last:border-0"
                    >
                      {/* Data */}
                      <div className="shrink-0 w-12 text-center bg-gray-100 rounded-lg py-1">
                        <div className="text-xs text-gray-400 leading-none">
                          {NAZWY_DNI[(d.getDay() + 6) % 7]}
                        </div>
                        <div className="text-base font-bold text-gray-900 leading-tight">
                          {d.getDate()}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors leading-snug line-clamp-1">
                          {bieg.nazwa}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          📍 {bieg.miasto}
                          {bieg.dystanse.length > 0 && (
                            <span className="ml-2 text-orange-600">
                              {bieg.dystanse.join(", ")}
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Badge źródła */}
                      <span
                        className={`shrink-0 text-xs text-white font-medium px-2 py-0.5 rounded-full self-start ${STYL_ZRODLA[bieg.zrodlo] || "bg-gray-500"}`}
                      >
                        {bieg.zrodlo === "maratonypolskie"
                          ? "MP"
                          : bieg.zrodlo === "dostartu"
                          ? "DS"
                          : bieg.zrodlo === "datasport"
                          ? "Dsp"
                          : bieg.zrodlo === "personalbest"
                          ? "PB"
                          : "ZG"}
                      </span>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
