"use client";

import { useEffect, useState, useRef } from "react";

const STYL: Record<string, { badge: string; label: string; short: string }> = {
  maratonypolskie: { badge: "bg-blue-600 text-white",    label: "Maratony Polskie", short: "MP" },
  dostartu:        { badge: "bg-emerald-600 text-white", label: "DoStartu",         short: "DS" },
  datasport:       { badge: "bg-violet-600 text-white",  label: "DataSport",        short: "Dsp" },
  personalbest:    { badge: "bg-rose-600 text-white",    label: "Personal Best",    short: "PB" },
  formularz:       { badge: "bg-amber-500 text-white",   label: "Zgłoszenia",       short: "ZG" },
  niszowe:         { badge: "bg-gray-500 text-white",    label: "Niszowe",          short: "N" },
};

interface Wpis { zrodlo: string; liczba: number }
interface Props {
  tryb: "opublikowane" | "oczekujace";
  wariant?: "hero" | "compact";
}

function useCountUp(cel: number, czas = 1800) {
  const [wartosc, setWartosc] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (cel === 0) return;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / czas, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setWartosc(Math.round(eased * cel));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [cel, czas]);

  return wartosc;
}

export function StatZrodel({ tryb, wariant = "compact" }: Props) {
  const [dane, setDane] = useState<Wpis[]>([]);
  const [suma, setSuma] = useState(0);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        const wpisy: Wpis[] = tryb === "opublikowane" ? d.opublikowane : d.oczekujace;
        setDane(wpisy ?? []);
        setSuma((wpisy ?? []).reduce((s, w) => s + w.liczba, 0));
      })
      .catch(() => {});
  }, [tryb]);

  const animowanaSuma = useCountUp(suma);

  if (wariant === "hero") {
    if (suma === 0) return null;
    return (
      <div className="flex flex-col gap-3">
        {/* Duży licznik */}
        <div>
          <p className="text-orange-300 text-xs font-semibold uppercase tracking-widest mb-1">
            Łącznie w kalendarzu
          </p>
          <div className="flex items-baseline gap-2">
            <span
              className="text-6xl sm:text-7xl font-black text-white tabular-nums"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
            >
              {animowanaSuma}
            </span>
            <span className="text-2xl font-bold text-white/80">
              biegów
            </span>
          </div>
          <p className="text-orange-200/80 text-sm mt-0.5">ze Śląska i okolic</p>
        </div>

        {/* Rozbicie per platforma */}
        {dane.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {dane.map(({ zrodlo, liczba }) => {
              const s = STYL[zrodlo] ?? STYL.niszowe;
              return (
                <span
                  key={zrodlo}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.badge} shadow-sm`}
                >
                  {s.label}
                  <span className="bg-black/20 rounded-full px-1.5 py-px text-xs font-bold leading-none">
                    {liczba}
                  </span>
                </span>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Wariant compact — admin panel i inline
  if (suma === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-gray-500 font-medium">
        Łącznie{" "}
        <span className="text-gray-900 font-bold">{suma}</span>{" "}
        {tryb === "opublikowane" ? "biegów" : "do zatwierdzenia"}:
      </span>
      {dane.map(({ zrodlo, liczba }) => {
        const s = STYL[zrodlo] ?? STYL.niszowe;
        return (
          <span
            key={zrodlo}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${s.badge}`}
          >
            {s.label}
            <span className="bg-black/20 rounded-full px-1.5 py-px text-xs font-bold leading-none">
              {liczba}
            </span>
          </span>
        );
      })}
    </div>
  );
}
