"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { BiegDTO } from "@/lib/types";
import { KafelekBiegu } from "@/components/KafelekBiegu";
import { Filtry } from "@/components/Filtry";
import { KalendarzBiegow } from "@/components/KalendarzBiegow";
import { StatZrodel } from "@/components/StatZrodel";

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

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-5 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Nadchodzące biegi na Śląsku
          </h1>
          <div className="mt-2">
            <StatZrodel tryb="opublikowane" />
          </div>
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
  );
}
