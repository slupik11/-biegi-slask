"use client";

import { useState } from "react";
import Link from "next/link";

const TYPY = ["uliczny", "przełajowy", "maraton", "półmaraton", "triathlon", "inne"];

export default function ZglosBieg() {
  const [form, setForm] = useState({
    nazwa: "",
    data: "",
    miasto: "",
    dystanse: "",
    typ: "uliczny",
    linkDoZapisow: "",
    opis: "",
    emailKontakt: "",
  });
  const [wysylanie, setWysylanie] = useState(false);
  const [wynik, setWynik] = useState<"sukces" | "blad" | null>(null);

  const ustaw = (pole: string, wartosc: string) =>
    setForm((prev) => ({ ...prev, [pole]: wartosc }));

  async function wyslij(e: React.FormEvent) {
    e.preventDefault();
    setWysylanie(true);
    setWynik(null);

    const dystanse = form.dystanse
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/zglos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, dystanse }),
      });

      if (res.ok) {
        setWynik("sukces");
        setForm({
          nazwa: "",
          data: "",
          miasto: "",
          dystanse: "",
          typ: "uliczny",
          linkDoZapisow: "",
          opis: "",
          emailKontakt: "",
        });
      } else {
        setWynik("blad");
      }
    } catch {
      setWynik("blad");
    } finally {
      setWysylanie(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-gray-400 hover:text-orange-600 mb-6 inline-block">
        ← Wróć do listy
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Zgłoś bieg</h1>
      <p className="text-gray-500 text-sm mb-6">
        Znasz bieg, którego nie ma na liście? Zgłoś go, a po weryfikacji pojawi się w kalendarzu.
      </p>

      {wynik === "sukces" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-green-800">
          Dziękujemy! Bieg został zgłoszony i pojawi się po akceptacji przez moderatora.
        </div>
      )}

      {wynik === "blad" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-800">
          Wystąpił błąd. Spróbuj ponownie.
        </div>
      )}

      <form onSubmit={wyslij} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nazwa biegu *
          </label>
          <input
            required
            type="text"
            value={form.nazwa}
            onChange={(e) => ustaw("nazwa", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="np. Bieg Wiosenny w Katowicach"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data *
            </label>
            <input
              required
              type="date"
              value={form.data}
              onChange={(e) => ustaw("data", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Miasto *
            </label>
            <input
              required
              type="text"
              value={form.miasto}
              onChange={(e) => ustaw("miasto", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="np. Katowice"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dystanse * <span className="text-gray-400 font-normal">(rozdziel przecinkami)</span>
            </label>
            <input
              required
              type="text"
              value={form.dystanse}
              onChange={(e) => ustaw("dystanse", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="np. 5km, 10km, 21km"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Typ biegu *
            </label>
            <select
              required
              value={form.typ}
              onChange={(e) => ustaw("typ", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            >
              {TYPY.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Link do zapisów
          </label>
          <input
            type="url"
            value={form.linkDoZapisow}
            onChange={(e) => ustaw("linkDoZapisow", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Opis <span className="text-gray-400 font-normal">(opcjonalnie)</span>
          </label>
          <textarea
            rows={3}
            value={form.opis}
            onChange={(e) => ustaw("opis", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            placeholder="Krótki opis biegu…"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E-mail kontaktowy <span className="text-gray-400 font-normal">(opcjonalnie, nie będzie widoczny publicznie)</span>
          </label>
          <input
            type="email"
            value={form.emailKontakt}
            onChange={(e) => ustaw("emailKontakt", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="twoj@email.pl"
          />
        </div>

        <button
          type="submit"
          disabled={wysylanie}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          {wysylanie ? "Wysyłanie…" : "Zgłoś bieg"}
        </button>
      </form>
    </div>
  );
}
