"use client";

import Link from "next/link";
import { BiegDTO } from "@/lib/types";

const STYL_ZRODLA: Record<string, { badge: string; border: string; label: string }> = {
  maratonypolskie: { badge: "bg-blue-600 text-white", border: "border-l-blue-500", label: "Maratony Polskie" },
  dostartu:        { badge: "bg-emerald-600 text-white", border: "border-l-emerald-500", label: "DoStartu" },
  datasport:       { badge: "bg-violet-600 text-white", border: "border-l-violet-500", label: "DataSport" },
  personalbest:    { badge: "bg-rose-600 text-white", border: "border-l-rose-500", label: "Personal Best" },
  formularz:       { badge: "bg-amber-500 text-white", border: "border-l-amber-400", label: "Zgłoszenie" },
  niszowe:         { badge: "bg-gray-500 text-white", border: "border-l-gray-400", label: "Niszowe" },
};

const ETYKIETY_TYPU: Record<string, string> = {
  uliczny: "Uliczny",
  przełajowy: "Przełajowy",
  maraton: "Maraton",
  półmaraton: "Półmaraton",
  triathlon: "Triathlon",
  inne: "Inne",
};

function formatujDate(iso: string) {
  const d = new Date(iso);
  const dzien = d.toLocaleDateString("pl-PL", { weekday: "short" });
  const data = d.toLocaleDateString("pl-PL", { day: "numeric", month: "short" });
  const rok = d.getFullYear();
  return { dzien, data, rok };
}

export function KafelekBiegu({ bieg }: { bieg: BiegDTO }) {
  const styl = STYL_ZRODLA[bieg.zrodlo] || STYL_ZRODLA.niszowe;
  const { dzien, data, rok } = formatujDate(bieg.data);

  return (
    <Link href={`/bieg/${bieg.id}`} className="block group">
      <div className={`bg-white border border-gray-200 border-l-4 ${styl.border} rounded-xl overflow-hidden h-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150`}>
        {/* Górna sekcja — data */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
          <div className="text-gray-900">
            <span className="text-xs text-gray-500 uppercase tracking-wide mr-1">{dzien}</span>
            <span className="font-bold text-base">{data}</span>
            <span className="text-gray-400 text-sm ml-1">{rok}</span>
          </div>
          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
            {ETYKIETY_TYPU[bieg.typ] || bieg.typ}
          </span>
        </div>

        {/* Środkowa sekcja — nazwa + miasto */}
        <div className="px-4 py-3">
          <h2 className="font-semibold text-gray-900 text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {bieg.nazwa}
          </h2>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <span className="text-gray-400">📍</span>
            {bieg.miasto}
          </p>

          {bieg.dystanse.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {bieg.dystanse.map((d) => (
                <span
                  key={d}
                  className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-0.5 rounded-full"
                >
                  {d}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Dolna sekcja — źródło */}
        <div className="px-4 pb-3">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styl.badge}`}>
            {styl.label}
          </span>
        </div>
      </div>
    </Link>
  );
}
