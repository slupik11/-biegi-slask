"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { BiegDTO } from "@/lib/types";
import { KafelekBiegu } from "@/components/KafelekBiegu";
import { Filtry } from "@/components/Filtry";

export default function StronaGlowna() {
  const [biegi, setBiegi] = useState<BiegDTO[]>([]);
  const [ladowanie, setLadowanie] = useState(true);
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Nadchodzące biegi na Śląsku
        </h1>
        <p className="text-gray-500 text-sm">
          Dane zbierane automatycznie z największych platform biegowych
        </p>
      </div>

      <Filtry filtry={filtry} onChange={setFiltry} />

      {ladowanie ? (
        <div className="text-center py-16 text-gray-400">Ładowanie biegów…</div>
      ) : biegi.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-2">Brak biegów pasujących do filtrów</p>
          <p className="text-gray-400 text-sm">
            Spróbuj zmienić filtry lub{" "}
            <Link href="/zglos-bieg" className="text-orange-600 underline">
              zgłoś bieg
            </Link>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {biegi.map((bieg) => (
            <KafelekBiegu key={bieg.id} bieg={bieg} />
          ))}
        </div>
      )}
    </div>
  );
}
