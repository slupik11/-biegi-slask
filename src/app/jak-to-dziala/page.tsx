import Link from "next/link";

const ZRODLA = [
  {
    nazwa: "DoStartu",
    badge: "bg-emerald-600 text-white",
    url: "dostartu.pl",
    opis: "Największa polska platforma do zapisów na biegi. Pobieramy dane przez ich publiczne API — dostajemy aktualne informacje o zawodach z oznaczeniem województwa śląskiego.",
  },
  {
    nazwa: "Maratony Polskie",
    badge: "bg-blue-600 text-white",
    url: "maratonypolskie.pl",
    opis: "Ogólnopolski katalog biegów, jeden z najstarszych w Polsce. Scraper parsuje ich kalendarz i filtruje biegi ze śląskich miast.",
  },
  {
    nazwa: "Personal Best",
    badge: "bg-rose-600 text-white",
    url: "personalbest.pl",
    opis: "Platforma z zapisami na biegi i wynikami. Pobieramy roczne kalendarze i filtrujemy zawody z województwa śląskiego.",
  },
  {
    nazwa: "DataSport",
    badge: "bg-violet-600 text-white",
    url: "liveds.datasport.pl",
    opis: "Polski system do obsługi zawodów biegowych i triatlonowych. Pobieramy listę nadchodzących zawodów i filtrujemy śląskie.",
  },
];

const PLANOWANE = [
  { nazwa: "bieganie.pl", opis: "Duży portal biegowy z własnym kalendarzem imprez — w planach" },
  { nazwa: "runpoland.pl", opis: "Katalog polskich biegów z opisami tras" },
  { nazwa: "trailrunning.pl", opis: "Biegi górskie i terenowe — ważne dla okolic Beskidów" },
  { nazwa: "triathlon.com.pl", opis: "Triathlony i swimruny w Polsce" },
];

export default function JakToDziala() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/" className="text-sm text-gray-500 hover:text-orange-600 mb-8 inline-block">
        ← Wróć do kalendarza
      </Link>

      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Jak to działa?</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Biegi Śląsk to automatyczny kalendarz biegów z województwa śląskiego. Zamiast ręcznie
          śledzić kilka różnych serwisów, masz wszystko w jednym miejscu.
        </p>
      </div>

      {/* Schemat działania */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-5">Schemat działania</h2>
        <div className="flex flex-col sm:flex-row gap-0 sm:gap-0">
          {[
            { krok: "1", ikona: "🤖", tytul: "Scraper pobiera biegi", opis: "Raz dziennie automatycznie pobieramy nowe zawody z 4 platform biegowych" },
            { krok: "2", ikona: "🗺️", tytul: "Filtr śląski", opis: "Zostają tylko biegi z miast i gmin województwa śląskiego" },
            { krok: "3", ikona: "✅", tytul: "Moderacja", opis: "Admin sprawdza i zatwierdza biegi — eliminuje duplikaty i błędy" },
            { krok: "4", ikona: "📅", tytul: "Pojawia się w kalendarzu", opis: "Zatwierdzone biegi są widoczne dla wszystkich w liście i widoku kalendarza" },
          ].map((s, i, arr) => (
            <div key={s.krok} className="flex sm:flex-col flex-1 items-start sm:items-center gap-3 sm:gap-0">
              <div className="flex sm:flex-col items-center sm:w-full gap-3 sm:gap-0 flex-1">
                <div className="sm:mb-3 shrink-0">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
                    {s.ikona}
                  </div>
                </div>
                {/* linia łącząca */}
                {i < arr.length - 1 && (
                  <div className="hidden sm:block h-px bg-gray-200 absolute" />
                )}
                <div className="sm:text-center">
                  <div className="font-semibold text-gray-900 text-sm">{s.tytul}</div>
                  <div className="text-xs text-gray-500 mt-0.5 max-w-[140px] sm:mx-auto">{s.opis}</div>
                </div>
              </div>
              {i < arr.length - 1 && (
                <div className="sm:hidden w-px h-6 bg-gray-200 ml-5 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Źródła danych */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Skąd pobieramy dane?</h2>
        <div className="space-y-3">
          {ZRODLA.map((z) => (
            <div key={z.nazwa} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-start">
              <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${z.badge}`}>
                {z.nazwa}
              </span>
              <div>
                <div className="text-xs text-gray-400 mb-0.5">{z.url}</div>
                <p className="text-sm text-gray-700">{z.opis}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Planowane źródła</h3>
          <div className="space-y-2">
            {PLANOWANE.map((p) => (
              <div key={p.nazwa} className="flex gap-3 items-start">
                <span className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 mt-0.5">
                  {p.nazwa}
                </span>
                <p className="text-sm text-gray-500">{p.opis}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Co robimy z danymi */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Co robimy z danymi?</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          {[
            "Pobieramy tylko publiczne informacje o zawodach: nazwa, data, miasto, dystans, link do zapisów",
            "Nie zbieramy żadnych danych osobowych uczestników",
            "Przestrzegamy pliku robots.txt każdego serwisu",
            "Używamy rozsądnych opóźnień między zapytaniami, żeby nie przeciążać serwerów",
            "Każde źródło ma w nagłówku nasz User-Agent z informacją o bocie",
          ].map((p) => (
            <li key={p} className="flex gap-2">
              <span className="text-green-600 font-bold shrink-0">✓</span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      {/* Zgłoś bieg */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
        <div className="text-2xl mb-2">🏃</div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Brakuje twojego biegu?</h2>
        <p className="text-gray-600 text-sm mb-4">
          Jeśli znasz bieg ze Śląska którego u nas nie ma — zgłoś go. Po sprawdzeniu pojawi się
          w kalendarzu.
        </p>
        <Link
          href="/zglos-bieg"
          className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
        >
          Zgłoś bieg →
        </Link>
      </div>
    </div>
  );
}
