"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { BiegDTO } from "@/lib/types";
import { KafelekBiegu } from "@/components/KafelekBiegu";
import { Filtry } from "@/components/Filtry";
import { KalendarzBiegow } from "@/components/KalendarzBiegow";
import { StatZrodel } from "@/components/StatZrodel";
import { HeroBaner } from "@/components/HeroBaner";

type Widok = "lista" | "kalendarz";

export default function StronaGlowna() {
  const [biegi, setBiegi] = useState<BiegDTO[]>([]);
  const [ladowanie, setLadowanie] = useState(true);
  const [widok, setWidok] = useState<Widok>("lista");
  const [filtry, setFiltry] = useState({
    miasto: "",
    typ: "",
    miesiac: "",
    dystans: "",
    szukaj: "",
  });

  const pobierzBiegi = useCallback(async () => {
    setLadowanie(true);
    const params = new URLSearchParams();
    if (filtry.miasto) params.set("miasto", filtry.miasto);
    if (filtry.typ) params.set("typ", filtry.typ);
    if (filtry.miesiac) params.set("miesiac", filtry.miesiac);
    if (filtry.dystans) params.set("dystans", filtry.dystans);
    if (filtry.szukaj) params.set("szukaj", filtry.szukaj);

    const res = await fetch(`/api/biegi?${params}`);
    const dane = await res.json();
    setBiegi(dane);
    setLadowanie(false);
  }, [filtry]);

  useEffect(() => {
    pobierzBiegi();
  }, [pobierzBiegi]);

  const maFiltry = Object.values(filtry).some((v) => v !== "");

  return (
    <div>
      {/* ===== HERO ===== */}
      {!maFiltry && (
        <div className="relative overflow-hidden" style={{ minHeight: 340 }}>
          <HeroBaner />

          {/* Treść hero */}
          <div className="relative max-w-5xl mx-auto px-4 py-12 sm:py-16 flex flex-col sm:flex-row sm:items-center gap-8 sm:gap-16">
            {/* Lewa kolumna — tytuł i CTA */}
            <div className="flex flex-col gap-4 flex-1">
              <div className="inline-flex items-center gap-2 bg-orange-500/90 text-white text-xs font-bold px-3 py-1 rounded-full w-fit tracking-wide">
                🏃 Województwo Śląskie
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
                Wszystkie biegi<br />
                <span className="text-orange-400">na Śląsku</span>
              </h1>
              <p className="text-gray-300 text-sm max-w-sm leading-relaxed">
                Automatyczny kalendarz biegów — zbieramy zawody z 4 platform
                w jedno miejsce.
              </p>
              <div className="flex gap-3 mt-1">
                <Link
                  href="/zglos-bieg"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
                >
                  + Zgłoś bieg
                </Link>
                <Link
                  href="/jak-to-dziala"
                  className="bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm border border-white/20"
                >
                  Jak to działa?
                </Link>
              </div>
            </div>

            {/* Prawa kolumna — wielki licznik */}
            <div className="sm:text-right">
              <StatZrodel tryb="opublikowane" wariant="hero" />
            </div>
          </div>
        </div>
      )}

      {/* ===== GŁÓWNA TREŚĆ ===== */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="mb-5 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Nadchodzące biegi
            </h2>
            {maFiltry && (
              <div className="mt-1">
                <StatZrodel tryb="opublikowane" />
              </div>
            )}
          </div>

          {/* Przełącznik Lista / Kalendarz */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
            <button
              onClick={() => setWidok("lista")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                widok === "lista"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              ☰ Lista
            </button>
            <button
              onClick={() => setWidok("kalendarz")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                widok === "kalendarz"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              📅 Kalendarz
            </button>
          </div>
        </div>

        <Filtry filtry={filtry} onChange={setFiltry} />

        {ladowanie ? (
          <div className="text-center py-16 text-gray-400">Ładowanie biegów…</div>
        ) : biegi.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-700 text-lg font-medium mb-1">
              Brak biegów pasujących do filtrów
            </p>
            <p className="text-gray-500 text-sm">
              Spróbuj zmienić filtry lub{" "}
              <Link href="/zglos-bieg" className="text-orange-600 underline font-medium">
                zgłoś bieg
              </Link>
            </p>
          </div>
        ) : widok === "kalendarz" ? (
          <KalendarzBiegow biegi={biegi} />
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-3">
              Znaleziono:{" "}
              <span className="font-semibold text-gray-800">{biegi.length}</span> biegów
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {biegi.map((bieg) => (
                <KafelekBiegu key={bieg.id} bieg={bieg} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
