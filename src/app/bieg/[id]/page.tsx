"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { BiegDTO } from "@/lib/types";

// Zdjęcie banera — biegacze na trasie (Unsplash, wolna licencja)
const BANER_IMG = "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=900&q=75&fit=crop";

const STYL_ZRODLA: Record<string, { badge: string; label: string }> = {
  maratonypolskie: { badge: "bg-blue-600 text-white",    label: "Maratony Polskie" },
  dostartu:        { badge: "bg-emerald-600 text-white", label: "DoStartu" },
  datasport:       { badge: "bg-violet-600 text-white",  label: "DataSport" },
  personalbest:    { badge: "bg-rose-600 text-white",    label: "Personal Best" },
  formularz:       { badge: "bg-amber-500 text-white",   label: "Zgłoszenie użytkownika" },
  niszowe:         { badge: "bg-gray-500 text-white",    label: "Znalezione w internecie" },
};

function formatujDate(iso: string) {
  return new Date(iso).toLocaleDateString("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function PodstronaBiegu() {
  const { id } = useParams<{ id: string }>();
  const [bieg, setBieg] = useState<BiegDTO | null>(null);
  const [blad, setBlad] = useState(false);

  useEffect(() => {
    fetch(`/api/biegi/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setBieg)
      .catch(() => setBlad(true));
  }, [id]);

  if (blad) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-4">Nie znaleziono tego biegu.</p>
        <Link href="/" className="text-orange-600 underline">
          Wróć do listy
        </Link>
      </div>
    );
  }

  if (!bieg) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-500">
        Ładowanie…
      </div>
    );
  }

  const styl = STYL_ZRODLA[bieg.zrodlo] || STYL_ZRODLA.niszowe;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="text-sm text-gray-500 hover:text-orange-600 mb-6 inline-block"
      >
        ← Wróć do listy
      </Link>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Baner ze zdjęciem */}
        <div className="relative h-44 bg-gray-200">
          <Image
            src={BANER_IMG}
            alt="Biegacze na trasie"
            fill
            className="object-cover object-center"
            sizes="(max-width: 672px) 100vw, 672px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
        </div>

        {/* Górny pasek */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center gap-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styl.badge}`}>
            {styl.label}
          </span>
          <span className="text-xs text-gray-500 capitalize bg-gray-200 px-2 py-0.5 rounded-full">
            {bieg.typ}
          </span>
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-5">{bieg.nazwa}</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Pole ikona="📅" etykieta="Data" wartosc={formatujDate(bieg.data)} />
            <Pole ikona="📍" etykieta="Miasto" wartosc={`${bieg.miasto}, ${bieg.wojewodztwo}`} />
            <Pole
              ikona="🏅"
              etykieta="Dystanse"
              wartosc={bieg.dystanse.length > 0 ? bieg.dystanse.join(", ") : "—"}
            />
            <Pole ikona="🏷️" etykieta="Typ" wartosc={bieg.typ} />
          </div>

          {bieg.opis && (
            <div className="mb-6 bg-gray-50 rounded-lg p-4">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Opis
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm">{bieg.opis}</p>
            </div>
          )}

          {bieg.linkDoZapisow && (
            <a
              href={bieg.linkDoZapisow}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Zapisz się na bieg →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Pole({ ikona, etykieta, wartosc }: { ikona: string; etykieta: string; wartosc: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-lg shrink-0">{ikona}</span>
      <div>
        <div className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{etykieta}</div>
        <div className="text-gray-800 font-medium capitalize">{wartosc}</div>
      </div>
    </div>
  );
}
