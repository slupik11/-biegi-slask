"use client";

import { useState } from "react";
import Link from "next/link";
import { BiegDTO } from "@/lib/types";

const ZRODLO: Record<string, { bg: string; short: string; label: string }> = {
  maratonypolskie: { bg: "bg-blue-600",    short: "MP",  label: "Maratony Polskie" },
  dostartu:        { bg: "bg-emerald-600", short: "DS",  label: "DoStartu"         },
  datasport:       { bg: "bg-violet-600",  short: "Dsp", label: "DataSport"        },
  personalbest:    { bg: "bg-rose-600",    short: "PB",  label: "Personal Best"    },
  formularz:       { bg: "bg-amber-500",   short: "ZG",  label: "Zgłoszenie"       },
  niszowe:         { bg: "bg-gray-400",    short: "?",   label: "Inne"             },
};

const MIESIACE = [
  "Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec",
  "Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień",
];
const DNI = ["Pn","Wt","Śr","Cz","Pt","So","Nd"];

function localKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function pluralBieg(n: number) {
  if (n === 1) return "1 bieg";
  if (n < 5) return `${n} biegi`;
  return `${n} biegów`;
}

interface MiesiacData {
  rok: number;
  miesiac: number;
  biegi: BiegDTO[];
  mapaDni: Map<string, BiegDTO[]>;
}

function grupuj(biegi: BiegDTO[]): MiesiacData[] {
  const mapa = new Map<string, MiesiacData>();
  for (const bieg of biegi) {
    const d = new Date(bieg.data);
    const klucz = `${d.getFullYear()}-${d.getMonth()}`;
    if (!mapa.has(klucz)) {
      mapa.set(klucz, { rok: d.getFullYear(), miesiac: d.getMonth(), biegi: [], mapaDni: new Map() });
    }
    const m = mapa.get(klucz)!;
    m.biegi.push(bieg);
    const dk = localKey(d);
    if (!m.mapaDni.has(dk)) m.mapaDni.set(dk, []);
    m.mapaDni.get(dk)!.push(bieg);
  }
  return [...mapa.values()].sort((a, b) => a.rok !== b.rok ? a.rok - b.rok : a.miesiac - b.miesiac);
}

export function KalendarzBiegow({ biegi }: { biegi: BiegDTO[] }) {
  const miesiace = grupuj(biegi);
  const dzisiajKey = localKey(new Date());
  const [wybranyDzien, setWybranyDzien] = useState<string | null>(null);

  const kliknijDzien = (dk: string) => {
    setWybranyDzien((prev) => (prev === dk ? null : dk));
  };

  // Dane dla desktop panelu
  let biegiWybranyDzien: BiegDTO[] = [];
  let dataWybranyDzien: Date | null = null;
  if (wybranyDzien) {
    for (const { mapaDni } of miesiace) {
      if (mapaDni.has(wybranyDzien)) { biegiWybranyDzien = mapaDni.get(wybranyDzien)!; break; }
    }
    dataWybranyDzien = new Date(wybranyDzien);
  }

  return (
    <div className="sm:flex sm:gap-6 sm:items-start">
    <div className="space-y-6 flex-1 min-w-0">
      {miesiace.map(({ rok, miesiac, biegi: biegiM, mapaDni }) => {
        const pierwszyDzien = new Date(rok, miesiac, 1);
        const ostatniDzien = new Date(rok, miesiac + 1, 0).getDate();
        const offset = (pierwszyDzien.getDay() + 6) % 7;
        const posortowane = [...biegiM].sort(
          (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
        );

        return (
          <div key={`${rok}-${miesiac}`} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Nagłówek */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">
                {MIESIACE[miesiac]} <span className="text-gray-400 font-normal">{rok}</span>
              </h2>
              <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full">
                {pluralBieg(biegiM.length)}
              </span>
            </div>

            <div className="p-4 sm:p-5">
              {/* Siatka */}
              <div className="mb-1">
                <div className="grid grid-cols-7 mb-1">
                  {DNI.map((d, i) => (
                    <div key={d} className={`text-center text-xs font-semibold py-1 ${i >= 5 ? "text-orange-400" : "text-gray-400"}`}>
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-0.5">
                  {Array.from({ length: offset }).map((_, i) => <div key={`pad-${i}`} />)}

                  {Array.from({ length: ostatniDzien }).map((_, i) => {
                    const dzien = i + 1;
                    const dk = localKey(new Date(rok, miesiac, dzien));
                    const biegiDnia = mapaDni.get(dk) ?? [];
                    const maBiegi = biegiDnia.length > 0;
                    const dzisiaj = dk === dzisiajKey;
                    const weekend = (new Date(rok, miesiac, dzien).getDay() + 6) % 7 >= 5;
                    const wybrany = wybranyDzien === dk;

                    return (
                      <button
                        key={dk}
                        onClick={() => maBiegi && kliknijDzien(dk)}
                        disabled={!maBiegi}
                        className={`aspect-square flex flex-col items-center justify-center rounded-lg relative transition-all ${
                          maBiegi
                            ? wybrany
                              ? "bg-orange-600 shadow-md scale-105 ring-2 ring-orange-400 cursor-pointer"
                              : "bg-orange-500 hover:bg-orange-600 hover:scale-105 cursor-pointer"
                            : dzisiaj
                            ? "bg-blue-50 ring-2 ring-blue-400 ring-inset"
                            : weekend
                            ? "bg-gray-50"
                            : ""
                        }`}
                      >
                        <span className={`text-xs font-bold leading-none ${
                          maBiegi ? "text-white" : dzisiaj ? "text-blue-600" : weekend ? "text-gray-500" : "text-gray-600"
                        }`}>
                          {dzien}
                        </span>
                        {maBiegi && biegiDnia.length > 1 && (
                          <span className="text-white/80 text-[9px] leading-none mt-0.5 font-semibold">
                            ×{biegiDnia.length}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Panel wybranego dnia — tylko mobile (sm: ukryty, zastąpiony modalem) */}
              {wybranyDzien && mapaDni.has(wybranyDzien) && (() => {
                const biegiDnia = mapaDni.get(wybranyDzien)!;
                const d = new Date(wybranyDzien);
                const weekday = DNI[(d.getDay() + 6) % 7];
                return (
                  <div className="sm:hidden mt-4 rounded-xl bg-orange-50 border border-orange-200 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-orange-500">
                      <span className="text-white font-bold text-sm">
                        {weekday}, {d.getDate()} {MIESIACE[d.getMonth()]}
                      </span>
                      <button onClick={() => setWybranyDzien(null)} className="text-white/80 hover:text-white text-lg leading-none font-bold">×</button>
                    </div>
                    <div className="divide-y divide-orange-100">
                      {biegiDnia.map((bieg) => {
                        const s = ZRODLO[bieg.zrodlo] ?? ZRODLO.niszowe;
                        return (
                          <Link key={bieg.id} href={`/bieg/${bieg.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-orange-100 transition-colors group">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 group-hover:text-orange-700 truncate">{bieg.nazwa}</p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {bieg.miasto}
                                {bieg.dystanse.length > 0 && <span className="text-orange-600 ml-1.5">{bieg.dystanse.join(" · ")}</span>}
                              </p>
                            </div>
                            <span className={`shrink-0 text-[10px] font-bold text-white px-2 py-0.5 rounded ${s.bg}`}>{s.short}</span>
                            <span className="text-gray-400 group-hover:text-orange-500 text-sm">→</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Lista miesięczna */}
              <div className="border-t border-gray-100 mt-5 pt-4 space-y-1">
                {posortowane.map((bieg) => {
                  const d = new Date(bieg.data);
                  const weekday = DNI[(d.getDay() + 6) % 7];
                  const s = ZRODLO[bieg.zrodlo] ?? ZRODLO.niszowe;
                  return (
                    <Link
                      key={bieg.id}
                      href={`/bieg/${bieg.id}`}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="shrink-0 w-11 text-center">
                        <div className="text-[10px] font-semibold text-gray-400 uppercase leading-none mb-0.5">{weekday}</div>
                        <div className="text-lg font-black text-gray-900 leading-none">{d.getDate()}</div>
                      </div>
                      <div className="w-px h-8 bg-gray-200 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                          {bieg.nazwa}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {bieg.miasto}
                          {bieg.dystanse.length > 0 && (
                            <span className="text-orange-500 ml-1.5">{bieg.dystanse.join(" · ")}</span>
                          )}
                        </p>
                      </div>
                      <span className={`shrink-0 text-[10px] font-bold text-white px-1.5 py-0.5 rounded ${s.bg}`}>
                        {s.short}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>

      {/* Panel desktop — prawa kolumna sticky, ukryty na mobile */}
      {wybranyDzien && biegiWybranyDzien.length > 0 && dataWybranyDzien && (
        <div className="hidden sm:block w-72 shrink-0 sticky top-6">
          <div className="rounded-xl bg-orange-50 border border-orange-200 overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-4 py-2.5 bg-orange-500">
              <span className="text-white font-bold text-sm">
                {DNI[(dataWybranyDzien.getDay() + 6) % 7]}, {dataWybranyDzien.getDate()} {MIESIACE[dataWybranyDzien.getMonth()]}
              </span>
              <button
                onClick={() => setWybranyDzien(null)}
                className="text-white/80 hover:text-white text-lg leading-none font-bold"
              >
                ×
              </button>
            </div>
            <div className="divide-y divide-orange-100 max-h-[70vh] overflow-y-auto">
              {biegiWybranyDzien.map((bieg) => {
                const s = ZRODLO[bieg.zrodlo] ?? ZRODLO.niszowe;
                return (
                  <Link
                    key={bieg.id}
                    href={`/bieg/${bieg.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-orange-100 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-orange-700 truncate">{bieg.nazwa}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {bieg.miasto}
                        {bieg.dystanse.length > 0 && <span className="text-orange-600 ml-1.5">{bieg.dystanse.join(" · ")}</span>}
                      </p>
                    </div>
                    <span className={`shrink-0 text-[10px] font-bold text-white px-2 py-0.5 rounded ${s.bg}`}>{s.short}</span>
                    <span className="text-gray-400 group-hover:text-orange-500 text-sm">→</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
