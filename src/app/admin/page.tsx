"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BiegDTO } from "@/lib/types";
import { StatZrodel } from "@/components/StatZrodel";

const STYL_ZRODLA: Record<string, { badge: string; label: string }> = {
  maratonypolskie: { badge: "bg-blue-600 text-white",    label: "Maratony Polskie" },
  dostartu:        { badge: "bg-emerald-600 text-white", label: "DoStartu" },
  datasport:       { badge: "bg-violet-600 text-white",  label: "DataSport" },
  personalbest:    { badge: "bg-rose-600 text-white",    label: "Personal Best" },
  formularz:       { badge: "bg-amber-500 text-white",   label: "Formularz" },
  niszowe:         { badge: "bg-gray-500 text-white",    label: "Niszowe" },
};

function formatujDate(iso: string) {
  return new Date(iso).toLocaleDateString("pl-PL", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default function PanelAdmina() {
  const router = useRouter();
  const [biegi, setBiegi] = useState<BiegDTO[]>([]);
  const [ladowanie, setLadowanie] = useState(true);
  const [pobieranie, setPobieranie] = useState(false);
  const [zatwierdzanieWszystkich, setZatwierdzanieWszystkich] = useState(false);
  const [przetwarzane, setPrzetwarzane] = useState<number[]>([]);

  async function pobierzBiegi() {
    setLadowanie(true);
    const res = await fetch("/api/admin/biegi");
    const dane = await res.json();
    setBiegi(dane);
    setLadowanie(false);
  }

  useEffect(() => { pobierzBiegi(); }, []);

  async function fetchBiegi() {
    setPobieranie(true);
    await fetch("/api/admin/fetch", { method: "POST" });
    setPobieranie(false);
    pobierzBiegi();
  }

  async function zatwierdzWszystkie() {
    setZatwierdzanieWszystkich(true);
    const res = await fetch("/api/admin/zatwierdz-wszystkie", { method: "POST" });
    const dane = await res.json();
    setZatwierdzanieWszystkich(false);
    alert(`Opublikowano ${dane.opublikowano} biegów`);
    pobierzBiegi();
  }

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

  async function wyloguj() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel admina</h1>
          <div className="mt-2">
            <StatZrodel tryb="oczekujace" />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {biegi.length > 0 && (
            <button
              onClick={zatwierdzWszystkie}
              disabled={zatwierdzanieWszystkich}
              className="text-sm font-semibold bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg px-4 py-2 transition-colors"
            >
              {zatwierdzanieWszystkich ? "Zatwierdzanie…" : `✓ Zatwierdź wszystkie (${biegi.length})`}
            </button>
          )}
          <button
            onClick={fetchBiegi}
            disabled={pobieranie}
            className="text-sm font-medium bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white border border-orange-600 rounded-lg px-4 py-2 transition-colors"
          >
            {pobieranie ? "Pobieranie…" : "↓ Pobierz nowe biegi"}
          </button>
          <button
            onClick={pobierzBiegi}
            className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg px-3 py-2 transition-colors"
          >
            Odśwież
          </button>
          <button
            onClick={wyloguj}
            className="text-sm text-gray-400 hover:text-red-600 border border-gray-200 rounded-lg px-3 py-2 transition-colors"
          >
            Wyloguj
          </button>
        </div>
      </div>

      {ladowanie ? (
        <div className="text-center py-16 text-gray-500">Ładowanie…</div>
      ) : biegi.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-700 text-lg font-medium">Brak biegów do zatwierdzenia</p>
          <p className="text-gray-400 text-sm mt-1">Wszystkie biegi zostały już rozpatrzone</p>
        </div>
      ) : (
        <div className="space-y-3">
          {biegi.map((bieg) => {
            const czy = przetwarzane.includes(bieg.id);
            const styl = STYL_ZRODLA[bieg.zrodlo] || STYL_ZRODLA.niszowe;
            return (
              <div
                key={bieg.id}
                className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styl.badge}`}>
                      {styl.label}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full capitalize">
                      {bieg.typ}
                    </span>
                  </div>
                  <h2 className="font-semibold text-gray-900 leading-snug">{bieg.nazwa}</h2>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {formatujDate(bieg.data)} · {bieg.miasto}
                    {bieg.dystanse.length > 0 && (
                      <span className="text-orange-600"> · {bieg.dystanse.join(", ")}</span>
                    )}
                  </p>
                  {bieg.linkDoZapisow && (
                    <a
                      href={bieg.linkDoZapisow}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline truncate block mt-0.5"
                    >
                      {bieg.linkDoZapisow}
                    </a>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    disabled={czy}
                    onClick={() => zmienStatus(bieg.id, "opublikowany")}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    ✓ Zatwierdź
                  </button>
                  <button
                    disabled={czy}
                    onClick={() => zmienStatus(bieg.id, "odrzucony")}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
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
