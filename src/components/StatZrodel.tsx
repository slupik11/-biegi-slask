"use client";

import { useEffect, useState } from "react";

const STYL: Record<string, { badge: string; label: string }> = {
  maratonypolskie: { badge: "bg-blue-600 text-white",    label: "Maratony Polskie" },
  dostartu:        { badge: "bg-emerald-600 text-white", label: "DoStartu" },
  datasport:       { badge: "bg-violet-600 text-white",  label: "DataSport" },
  personalbest:    { badge: "bg-rose-600 text-white",    label: "Personal Best" },
  formularz:       { badge: "bg-amber-500 text-white",   label: "Zgłoszenia" },
  niszowe:         { badge: "bg-gray-500 text-white",    label: "Niszowe" },
};

interface Wpis { zrodlo: string; liczba: number }
interface Props { tryb: "opublikowane" | "oczekujace" }

export function StatZrodel({ tryb }: Props) {
  const [dane, setDane] = useState<Wpis[]>([]);
  const [suma, setSuma] = useState(0);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        const wpisy: Wpis[] = tryb === "opublikowane" ? d.opublikowane : d.oczekujace;
        setDane(wpisy);
        setSuma(wpisy.reduce((s, w) => s + w.liczba, 0));
      })
      .catch(() => {});
  }, [tryb]);

  if (suma === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-gray-500 font-medium">
        Łącznie{" "}
        <span className="text-gray-900 font-bold">{suma}</span>{" "}
        {tryb === "opublikowane" ? "biegów" : "do zatwierdzenia"}:
      </span>
      {dane.map(({ zrodlo, liczba }) => {
        const s = STYL[zrodlo] || STYL.niszowe;
        return (
          <span
            key={zrodlo}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${s.badge}`}
          >
            {s.label}
            <span className="bg-white/25 rounded-full px-1.5 py-0.5 text-xs font-bold leading-none">
              {liczba}
            </span>
          </span>
        );
      })}
    </div>
  );
}
