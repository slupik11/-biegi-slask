import Link from "next/link";
import { BiegDTO } from "@/lib/types";

const KOLORY_ZRODLA: Record<string, string> = {
  maratonypolskie: "bg-blue-100 text-blue-700",
  dostartu: "bg-green-100 text-green-700",
  datasport: "bg-purple-100 text-purple-700",
  personalbest: "bg-pink-100 text-pink-700",
  formularz: "bg-yellow-100 text-yellow-700",
  niszowe: "bg-gray-100 text-gray-600",
};

const ETYKIETY_ZRODLA: Record<string, string> = {
  maratonypolskie: "Maratony Polskie",
  dostartu: "DoStartu",
  datasport: "DataSport",
  personalbest: "Personal Best",
  formularz: "Zgłoszenie",
  niszowe: "Niszowe",
};

function formatujDate(iso: string) {
  return new Date(iso).toLocaleDateString("pl-PL", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function KafelekBiegu({ bieg }: { bieg: BiegDTO }) {
  const kolorZrodla = KOLORY_ZRODLA[bieg.zrodlo] || "bg-gray-100 text-gray-600";
  const etykietaZrodla = ETYKIETY_ZRODLA[bieg.zrodlo] || bieg.zrodlo;

  return (
    <Link href={`/bieg/${bieg.id}`} className="block group">
      <div className="bg-white border border-gray-200 rounded-xl p-4 h-full hover:shadow-md hover:border-orange-300 transition-all duration-150">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${kolorZrodla}`}>
            {etykietaZrodla}
          </span>
          <span className="text-xs text-gray-400 capitalize">{bieg.typ}</span>
        </div>

        <h2 className="font-semibold text-gray-900 group-hover:text-orange-600 leading-snug mb-2 line-clamp-2">
          {bieg.nazwa}
        </h2>

        <div className="space-y-1 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <span>📅</span>
            <span>{formatujDate(bieg.data)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>📍</span>
            <span>{bieg.miasto}</span>
          </div>
          {bieg.dystanse.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>🏅</span>
              {bieg.dystanse.map((d) => (
                <span
                  key={d}
                  className="bg-orange-50 text-orange-700 text-xs px-1.5 py-0.5 rounded"
                >
                  {d}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
