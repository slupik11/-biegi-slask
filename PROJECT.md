# PROJEKT: „Biegi Śląsk" — automatyczny kalendarz biegów

## O projekcie
Strona-kalendarz automatycznie zbierająca biegi z województwa śląskiego i okolic. Sercem projektu jest automatyczne pobieranie danych z zewnętrznych platform biegowych ORAZ wyszukiwanie niszowych lokalnych biegów przez Brave Search API. Projekt z pasji, docelowo własna domena .pl, możliwe reklamy.

## Stack techniczny
- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS**
- **Prisma** + **SQLite** lokalnie (PostgreSQL przy publikacji)
- **Scrapery:** cheerio (strony statyczne), playwright (strony dynamiczne)
- Interfejs po **polsku**, w pełni **responsywny**

## Źródła danych (trzy filary)
**A) Duże platformy — adapter na każdą:**
- Maratony Polskie (maratonypolskie.pl)
- DoStartu (dostartu.pl)
- DataSport (datasport.pl)
- Personal Best (personalbest.pl)

**B) Niszowe biegi:** Brave Search API (BRAVE_API_KEY w .env, 2000 zapytań/mc)

**C) Formularz zgłoszeniowy** — każdy może zgłosić bieg, trafia do moderacji.

## Zasady pobierania danych
- Zawsze sprawdź robots.txt, API/RSS/sitemap — preferuj oficjalne API
- Rozsądny User-Agent, limitowanie tempa zapytań
- Tylko fakty publiczne: nazwa, data, miejsce, dystans, link. Żadnych danych osobowych.
- NIE scrapuj Facebooka

## Architektura
- **Adaptery:** wspólny interfejs `fetchEvents()` → zunifikowany format biegu
- **Normalizacja i deduplikacja:** match po nazwie + dacie + mieście
- **Cron:** zadanie cykliczne odpalające wszystkie adaptery
- **Moderacja:** każdy bieg automatyczny trafia do „do akceptacji", pojawia się publicznie dopiero po zatwierdzeniu w panelu admina

## Model danych biegu
```
id, nazwa, data, miasto, województwo, dystanse (tablica), typ (uliczny/przełajowy/maraton/półmaraton/inne),
link_do_zapisów, opis, źródło, zewnętrzny_id (deduplikacja), status (do_akceptacji/opublikowany/odrzucony),
lat/lng (przyszła mapa), data_dodania, data_aktualizacji
```

## URL admina
`/admin-panel-biegi` (nieoczywisty URL, bez logowania na start)

## Status etapów

### Etap 1 — MVP lokalny ✅ UKOŃCZONY (2026-06-10)
- [x] Krok 1: Node.js v22.3.0 — OK
- [x] Krok 2: Next.js + TypeScript + Tailwind + Prisma + SQLite
- [x] Krok 3: Strona główna z kafelkami, filtrami i wyszukiwarką
- [x] Krok 4: Podstrona biegu
- [x] Krok 5: Formularz „Zgłoś bieg"
- [x] Krok 6: Panel admina `/admin-panel-biegi`
- [x] Krok 7: Adapter Maratony Polskie — pierwsze realne dane
- [x] Krok 8: Uruchomienie lokalne

### Etap 2 — NASTĘPNY
- [ ] Adaptery: DoStartu, DataSport, Personal Best
- [ ] Harmonogram cron (co 6h / co dobę)

### Etap 3 — PLANOWANY
- [ ] Moduł niszowy — Brave Search API (BRAVE_API_KEY w .env)
- [ ] Logika wyciągania dat/miejsc z HTML lokalnych stron

### Etap 4 — PUBLIKACJA
- [ ] Przejście na PostgreSQL
- [ ] Wdrożenie na Vercel
- [ ] Domena .pl
