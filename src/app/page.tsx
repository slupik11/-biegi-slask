"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BiegDTO } from "@/lib/types";
import { KafelekBiegu } from "@/components/KafelekBiegu";
import { Filtry } from "@/components/Filtry";
import { KalendarzBiegow } from "@/components/KalendarzBiegow";
import { StatZrodel } from "@/components/StatZrodel";
import { HeroBaner } from "@/components/HeroBaner";

type Widok = "lista" | "kalendarz";
type Stan = "ladowanie" | "gotowe" | "blad";

const FRAZY_HERO = ["na Śląsku", "w jednym miejscu", "pod ręką", "z 4 platform"];

const PUSTE_FILTRY = { miasto: "", typ: "", miesiac: "", dystans: "", szukaj: "" };

function pluralBieg(n: number) {
  if (n === 1) return "bieg";
  const r10 = n % 10, r100 = n % 100;
  if (r10 >= 2 && r10 <= 4 && (r100 < 12 || r100 > 14)) return "biegi";
  return "biegów";
}

export default function StronaGlowna() {
  const [biegi, setBiegi] = useState<BiegDTO[]>([]);
  const [stan, setStan] = useState<Stan>("ladowanie");
  const [widok, setWidok] = useState<Widok>("lista");
  const [frazaIndeks, setFrazaIndeks] = useState(0);
  const [filtry, setFiltry] = useState(PUSTE_FILTRY);
  const [proba, setProba] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setFrazaIndeks((i) => (i + 1) % FRAZY_HERO.length), 3000);
    return () => clearInterval(t);
  }, []);

  // Pobieranie z małym opóźnieniem, żeby nie strzelać do API przy każdej literze
  useEffect(() => {
    const kontroler = new AbortController();
    const t = setTimeout(async () => {
      setStan("ladowanie");
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(filtry)) if (v) params.set(k, v);
      try {
        const res = await fetch(`/api/biegi?${params}`, { signal: kontroler.signal });
        if (!res.ok) throw new Error(String(res.status));
        setBiegi(await res.json());
        setStan("gotowe");
      } catch (e) {
        if ((e as Error).name !== "AbortError") setStan("blad");
      }
    }, 250);
    return () => {
      clearTimeout(t);
      kontroler.abort();
    };
  }, [filtry, proba]);

  const maFiltry = Object.values(filtry).some((v) => v !== "");

  return (
    <div className="bg-white">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden" style={{ minHeight: 340 }}>
        <HeroBaner />
        <div className="relative max-w-5xl mx-auto px-4 py-12 sm:py-16 flex flex-col sm:flex-row sm:items-center gap-8 sm:gap-16">
          <div className="flex flex-col gap-4 flex-1 min-w-0">
            <p
              className="text-sm font-black italic uppercase tracking-widest text-orange-300"
              style={{ textShadow: "0 1px 10px rgba(0,0,0,0.7)" }}
            >
              Województwo Śląskie
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight overflow-hidden">
              Wszystkie biegi
              <span className="block overflow-hidden" style={{ height: "1.25em" }}>
                <span
                  key={frazaIndeks}
                  className="text-orange-400 block whitespace-nowrap"
                  style={{ animation: "heroTextIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards" }}
                >
                  {FRAZY_HERO[frazaIndeks]}
                </span>
              </span>
            </h1>
            <p className="text-gray-300 text-sm max-w-sm leading-relaxed">
              Automatyczny kalendarz biegów — zbieramy zawody z 4 platform w jedno miejsce.
            </p>
            <div className="flex gap-3 mt-1">
              <a
                href="#biegi"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
              >
                Zobacz biegi
              </a>
              <Link
                href="/zglos-bieg"
                className="bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm border border-white/20 backdrop-blur-sm"
              >
                + Zgłoś bieg
              </Link>
            </div>
          </div>
          <div className="sm:text-right">
            <StatZrodel tryb="opublikowane" wariant="hero" />
          </div>
        </div>
      </section>

      {/* ===== BIEGI ===== */}
      <section id="biegi" className="max-w-5xl mx-auto px-4 pt-10 pb-16 scroll-mt-16">
        <div className="flex items-end justify-between gap-4 flex-wrap pb-5 mb-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Nadchodzące biegi</h2>
            <p className="text-sm text-gray-500 mt-1">
              {stan === "gotowe" && biegi.length > 0 ? (
                <>
                  {biegi.length} {pluralBieg(biegi.length)}
                  {maFiltry ? " pasujących do filtrów" : " w kalendarzu"}
                  {widok === "lista" && (
                    <>
                      {" · "}
                      <button onClick={() => setWidok("kalendarz")} className="text-orange-600 font-medium hover:underline">
                        przełącz na kalendarz
                      </button>
                    </>
                  )}
                </>
              ) : (
                "Biegi z całego województwa, posortowane od najbliższych."
              )}
            </p>
          </div>

          <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1" role="tablist">
            {(["lista", "kalendarz"] as Widok[]).map((w) => (
              <button
                key={w}
                role="tab"
                aria-selected={widok === w}
                onClick={() => setWidok(w)}
                className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  widok === w ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {w === "lista" ? "Lista" : "Kalendarz"}
              </button>
            ))}
          </div>
        </div>

        <Filtry filtry={filtry} onChange={setFiltry} />

        {stan === "ladowanie" && biegi.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-36 rounded-xl border border-gray-100 bg-gray-50 animate-pulse" />
            ))}
          </div>
        ) : stan === "blad" ? (
          <div className="text-center py-16 border border-gray-200 rounded-xl">
            <p className="text-gray-900 font-semibold">Nie udało się wczytać biegów</p>
            <p className="text-gray-500 text-sm mt-1">Serwer chwilowo nie odpowiada. Spróbuj za moment.</p>
            <button
              onClick={() => setProba((p) => p + 1)}
              className="mt-4 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Spróbuj ponownie
            </button>
          </div>
        ) : biegi.length === 0 ? (
          <div className="text-center py-16 border border-gray-200 rounded-xl">
            <p className="text-gray-900 font-semibold">
              {maFiltry ? "Brak biegów pasujących do filtrów" : "Na razie brak zaplanowanych biegów"}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {maFiltry ? (
                <button onClick={() => setFiltry(PUSTE_FILTRY)} className="text-orange-600 font-medium hover:underline">
                  Wyczyść filtry
                </button>
              ) : (
                <>
                  Znasz bieg, którego tu nie ma?{" "}
                  <Link href="/zglos-bieg" className="text-orange-600 font-medium hover:underline">
                    Zgłoś go
                  </Link>
                </>
              )}
            </p>
          </div>
        ) : (
          <div className={stan === "ladowanie" ? "opacity-60 transition-opacity" : "transition-opacity"}>
            {widok === "kalendarz" ? (
              <KalendarzBiegow biegi={biegi} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {biegi.map((bieg) => (
                  <KafelekBiegu key={bieg.id} bieg={bieg} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
