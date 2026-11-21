"use client";

import Link from "next/link";
import { BiegDTO } from "@/lib/types";

const ZRODLO: Record<string, { kropka: string; label: string }> = {
  maratonypolskie: { kropka: "bg-blue-600",    label: "Maratony Polskie" },
  dostartu:        { kropka: "bg-emerald-600", label: "DoStartu" },
  datasport:       { kropka: "bg-violet-600",  label: "DataSport" },
  personalbest:    { kropka: "bg-rose-600",    label: "Personal Best" },
  formularz:       { kropka: "bg-amber-500",   label: "Zgłoszenie" },
  niszowe:         { kropka: "bg-gray-400",    label: "Inne źródło" },
};

const TYP: Record<string, string> = {
  uliczny: "Uliczny",
  przełajowy: "Przełaj",
  maraton: "Maraton",
  półmaraton: "Półmaraton",
  triathlon: "Triathlon",
  inne: "Bieg",
};

export function KafelekBiegu({ bieg }: { bieg: BiegDTO }) {
  const d = new Date(bieg.data);
  const zrodlo = ZRODLO[bieg.zrodlo] ?? ZRODLO.niszowe;
  const miesiac = d.toLocaleDateString("pl-PL", { month: "short" }).replace(".", "");
  const dzienTyg = d.toLocaleDateString("pl-PL", { weekday: "short" }).replace(".", "");

  return (
    <Link
      href={`/bieg/${bieg.id}`}
      className="group flex gap-4 h-full bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-[0_6px_20px_-8px_rgba(0,0,0,0.15)] transition-all"
    >
      {/* Data */}
      <div className="shrink-0 w-14 text-center rounded-lg bg-gray-50 group-hover:bg-orange-50 transition-colors py-2 self-start">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-orange-600 leading-none">{miesiac}</div>
        <div className="text-2xl font-black text-gray-900 leading-tight tabular-nums">{d.getDate()}</div>
        <div className="text-[11px] text-gray-400 leading-none capitalize">{dzienTyg}</div>
      </div>

      {/* Treść */}
      <div className="flex-1 min-w-0 flex flex-col">
        <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
          {bieg.nazwa}
        </h3>
        <p className="text-sm text-gray-500 mt-1 truncate">{bieg.miasto}</p>

        {bieg.dystanse.length > 0 && (
          <p className="text-sm font-medium text-gray-800 mt-2 truncate">{bieg.dystanse.join(" · ")}</p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between gap-2 text-xs text-gray-400">
          <span className="inline-flex items-center gap-1.5 truncate">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${zrodlo.kropka}`} />
            {zrodlo.label}
          </span>
          <span className="shrink-0 text-gray-500">{TYP[bieg.typ] ?? bieg.typ}</span>
        </div>
      </div>
    </Link>
  );
}
