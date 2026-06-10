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

export function Filtry({ filtry, onChange }: FiltryProps) {
  const ustaw = (pole: keyof FiltryState, wartosc: string) =>
    onChange({ ...filtry, [pole]: wartosc });

  const wyczyscFiltry = () =>
    onChange({ miasto: "", typ: "", miesiac: "", dystans: "", szukaj: "" });

  const maFiltry = Object.values(filtry).some((v) => v !== "");

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Szukaj po nazwie biegu…"
          value={filtry.szukaj}
          onChange={(e) => ustaw("szukaj", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <input
            type="text"
            placeholder="Miasto"
            value={filtry.miasto}
            onChange={(e) => ustaw("miasto", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <select
            value={filtry.typ}
            onChange={(e) => ustaw("typ", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="">Wszystkie typy</option>
            {TYPY.map((t) => (
              <option key={t} value={t} className="capitalize">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filtry.miesiac}
            onChange={(e) => ustaw("miesiac", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="">Wszystkie miesiące</option>
            {generujMiesiace().map((m) => (
              <option key={m.wartosc} value={m.wartosc}>
                {m.etykieta}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Dystans (np. 10km)"
            value={filtry.dystans}
            onChange={(e) => ustaw("dystans", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {maFiltry && (
          <button
            onClick={wyczyscFiltry}
            className="self-start text-sm text-gray-400 hover:text-orange-600 underline"
          >
            Wyczyść filtry
          </button>
        )}
      </div>
    </div>
  );
}
