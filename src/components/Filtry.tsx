"use client";

interface FiltryState {
  miasto: string;
  typ: string;
  miesiac: string;
  dystans: string;
  szukaj: string;
}

interface FiltryProps {
  filtry: FiltryState;
  onChange: (f: FiltryState) => void;
}

const TYPY = ["uliczny", "przełajowy", "maraton", "półmaraton", "triathlon", "inne"];

function generujMiesiace() {
  const wynik: { wartosc: string; etykieta: string }[] = [];
  const teraz = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(teraz.getFullYear(), teraz.getMonth() + i, 1);
    wynik.push({
      wartosc: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      etykieta: d.toLocaleDateString("pl-PL", { month: "long", year: "numeric" }),
    });
  }
  return wynik;
}

const inputKlasa =
  "border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400";

export function Filtry({ filtry, onChange }: FiltryProps) {
  const ustaw = (pole: keyof FiltryState, wartosc: string) =>
    onChange({ ...filtry, [pole]: wartosc });

  const wyczyscFiltry = () =>
    onChange({ miasto: "", typ: "", miesiac: "", dystans: "", szukaj: "" });

  const maFiltry = Object.values(filtry).some((v) => v !== "");

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="🔍  Szukaj po nazwie biegu…"
          value={filtry.szukaj}
          onChange={(e) => ustaw("szukaj", e.target.value)}
          className={`w-full ${inputKlasa}`}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            placeholder="Miasto (np. Katowice)"
            value={filtry.miasto}
            onChange={(e) => ustaw("miasto", e.target.value)}
            className={inputKlasa}
          />

          <select
            value={filtry.typ}
            onChange={(e) => ustaw("typ", e.target.value)}
            className={inputKlasa}
          >
            <option value="">Wszystkie typy</option>
            {TYPY.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filtry.miesiac}
            onChange={(e) => ustaw("miesiac", e.target.value)}
            className={inputKlasa}
          >
            <option value="">Wszystkie miesiące</option>
            {generujMiesiace().map((m) => (
              <option key={m.wartosc} value={m.wartosc}>
                {m.etykieta}
              </option>
            ))}
          </select>
        </div>

        {maFiltry && (
          <button
            onClick={wyczyscFiltry}
            className="self-start text-sm text-orange-600 hover:text-orange-800 font-medium"
          >
            ✕ Wyczyść filtry
          </button>
        )}
      </div>
    </div>
  );
}
