"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginAdmina() {
  const [haslo, setHaslo] = useState("");
  const [blad, setBlad] = useState(false);
  const [ladowanie, setLadowanie] = useState(false);
  const router = useRouter();

  async function zaloguj(e: React.FormEvent) {
    e.preventDefault();
    setLadowanie(true);
    setBlad(false);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ haslo }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setBlad(true);
      setLadowanie(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Biegi Śląsk" className="h-10 mx-auto mb-4" />
          <h1 className="text-lg font-bold text-gray-900">Panel administracyjny</h1>
          <p className="text-sm text-gray-500 mt-1">Wpisz hasło aby kontynuować</p>
        </div>

        <form onSubmit={zaloguj} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="Hasło"
            value={haslo}
            onChange={(e) => setHaslo(e.target.value)}
            autoFocus
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
          {blad && (
            <p className="text-red-500 text-sm text-center">Złe hasło, spróbuj ponownie.</p>
          )}
          <button
            type="submit"
            disabled={ladowanie || !haslo}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            {ladowanie ? "Sprawdzanie…" : "Zaloguj się"}
          </button>
        </form>
      </div>
    </div>
  );
}
