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
    const etykieta = d.toLocaleDateString("pl-PL", { month: "long", year: "numeric" });
    wynik.push({
      wartosc: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      etykieta: etykieta.charAt(0).toUpperCase() + etykieta.slice(1),
    });
  }
  return wynik;
}

const pole =
  "h-10 border border-gray-200 rounded-lg px-3 text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 transition-colors";

export function Filtry({ filtry, onChange }: FiltryProps) {
  const ustaw = (k: keyof FiltryState, v: string) => onChange({ ...filtry, [k]: v });
  const maFiltry = Object.values(filtry).some((v) => v !== "");

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2">
        <div className="relative col-span-2 sm:col-span-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            aria-label="Szukaj biegu"
            placeholder="Szukaj biegu"
            value={filtry.szukaj}
            onChange={(e) => ustaw("szukaj", e.target.value)}
            className={`w-full pl-9 ${pole}`}
          />
        </div>
        <input
          type="text"
          aria-label="Miasto"
          placeholder="Miasto"
          value={filtry.miasto}
          onChange={(e) => ustaw("miasto", e.target.value)}
          className={`col-span-2 sm:col-span-1 ${pole}`}
        />
        <select aria-label="Typ biegu" value={filtry.typ} onChange={(e) => ustaw("typ", e.target.value)} className={pole}>
          <option value="">Każdy typ</option>
          {TYPY.map((t) => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
        <select aria-label="Miesiąc" value={filtry.miesiac} onChange={(e) => ustaw("miesiac", e.target.value)} className={pole}>
          <option value="">Każdy miesiąc</option>
          {generujMiesiace().map((m) => (
            <option key={m.wartosc} value={m.wartosc}>{m.etykieta}</option>
          ))}
        </select>
      </div>

      {maFiltry && (
        <button
          onClick={() => onChange({ miasto: "", typ: "", miesiac: "", dystans: "", szukaj: "" })}
          className="mt-2 text-sm text-gray-500 hover:text-orange-600 font-medium"
        >
          Wyczyść filtry
        </button>
      )}
    </div>
  );
}
