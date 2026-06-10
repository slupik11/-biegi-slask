"use client";

import { useEffect, useState } from "react";
import { BiegDTO } from "@/lib/types";

const ETYKIETY_ZRODLA: Record<string, string> = {
  maratonypolskie: "Maratony Polskie",
  dostartu: "DoStartu",
  datasport: "DataSport",
  personalbest: "Personal Best",
  formularz: "Formularz",
  niszowe: "Niszowe",
};

function formatujDate(iso: string) {
  return new Date(iso).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function PanelAdmina() {
  const [biegi, setBiegi] = useState<BiegDTO[]>([]);
  const [ladowanie, setLadowanie] = useState(true);
  const [przetwarzane, setPrzetwarzane] = useState<number[]>([]);

  async function pobierzBiegi() {
    setLadowanie(true);
    const res = await fetch("/api/admin/biegi");
    const dane = await res.json();
    setBiegi(dane);
    setLadowanie(false);
  }

  useEffect(() => {
    pobierzBiegi();
  }, []);

  async function zmienStatus(id: number, status: "opublikowany" | "odrzucony") {
    setPrzetwarzane((p) => [...p, id]);
    await fetch(`/api/admin/biegi/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBiegi((prev) => prev.filter((b) => b.id !== id));
    setPrzetwarzane((p) => p.filter((x) => x !== id));
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel admina</h1>
          <p className="text-gray-500 text-sm mt-1">Biegi oczekujące na akceptację</p>
        </div>
        <button
          onClick={pobierzBiegi}
          className="text-sm text-gray-500 hover:text-orange-600 border border-gray-200 rounded-lg px-3 py-1.5"
        >
          Odśwież
        </button>
      </div>

      {ladowanie ? (
        <div className="text-center py-16 text-gray-400">Ładowanie…</div>
      ) : biegi.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">Brak biegów do zatwierdzenia</p>
          <p className="text-gray-400 text-sm mt-1">Wszystkie biegi zostały już rozpatrzone</p>
        </div>
      ) : (
        <div className="space-y-3">
          {biegi.map((bieg) => {
            const czy = przetwarzane.includes(bieg.id);
            return (
              <div
                key={bieg.id}
                className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {ETYKIETY_ZRODLA[bieg.zrodlo] || bieg.zrodlo}
                    </span>
                    <span className="text-xs text-gray-400 capitalize">{bieg.typ}</span>
                  </div>
                  <h2 className="font-semibold text-gray-900 leading-snug">{bieg.nazwa}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {formatujDate(bieg.data)} · {bieg.miasto}
                    {bieg.dystanse.length > 0 && (
                      <span> · {bieg.dystanse.join(", ")}</span>
                    )}
                  </p>
                  {bieg.linkDoZapisow && (
                    <a
                      href={bieg.linkDoZapisow}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline truncate block mt-0.5"
                    >
                      {bieg.linkDoZapisow}
                    </a>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    disabled={czy}
                    onClick={() => zmienStatus(bieg.id, "opublikowany")}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    ✓ Zatwierdź
                  </button>
                  <button
                    disabled={czy}
                    onClick={() => zmienStatus(bieg.id, "odrzucony")}
                    className="bg-red-100 hover:bg-red-200 disabled:opacity-50 text-red-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    ✗ Odrzuć
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
