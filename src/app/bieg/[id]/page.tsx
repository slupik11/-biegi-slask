"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BiegDTO } from "@/lib/types";

const ETYKIETY_ZRODLA: Record<string, string> = {
  maratonypolskie: "Maratony Polskie",
  dostartu: "DoStartu",
  datasport: "DataSport",
  personalbest: "Personal Best",
  formularz: "Zgłoszenie użytkownika",
  niszowe: "Znalezione w internecie",
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
        <p className="text-gray-500 mb-4">Nie znaleziono tego biegu.</p>
        <Link href="/" className="text-orange-600 underline">
          Wróć do listy
        </Link>
      </div>
    );
  }

  if (!bieg) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-400">
        Ładowanie…
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="text-sm text-gray-400 hover:text-orange-600 mb-6 inline-block"
      >
        ← Wróć do listy
      </Link>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="mb-1 text-xs text-gray-400 uppercase tracking-wide">
          {ETYKIETY_ZRODLA[bieg.zrodlo] || bieg.zrodlo}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{bieg.nazwa}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
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
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Opis
            </h2>
            <p className="text-gray-700 leading-relaxed">{bieg.opis}</p>
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
  );
}

function Pole({
  ikona,
  etykieta,
  wartosc,
}: {
  ikona: string;
  etykieta: string;
  wartosc: string;
}) {
  return (
    <div className="flex gap-2">
      <span className="text-lg">{ikona}</span>
      <div>
        <div className="text-xs text-gray-400 uppercase tracking-wide">{etykieta}</div>
        <div className="text-gray-800 font-medium capitalize">{wartosc}</div>
      </div>
    </div>
  );
}
