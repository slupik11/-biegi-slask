"use client";

// Biegacz w połowie kroku — SVG sylwetka
function Biegacz({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size * 1.35}
      viewBox="-18 -44 36 76"
      fill="none"
    >
      {/* Głowa */}
      <circle cx="2" cy="-36" r="6.5" fill="white" />
      {/* Tors (lekko pochylony do przodu) */}
      <line x1="2" y1="-29" x2="-2" y2="-8" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      {/* Lewe ramię — do przodu */}
      <line x1="0" y1="-22" x2="-14" y2="-13" stroke="white" strokeWidth="3" strokeLinecap="round" />
      {/* Prawe ramię — do tyłu/góry */}
      <line x1="0" y1="-22" x2="13" y2="-31" stroke="white" strokeWidth="3" strokeLinecap="round" />
      {/* Lewa noga — wykrok do przodu */}
      <polyline
        points="-2,-8  -12,12  -10,28"
        stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Prawa noga — wypchnięta do tyłu */}
      <polyline
        points="-2,-8  14,4  16,-9"
        stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

// Stałe wartości (bez Math.random — hydration-safe)
const BIEGACZE = [
  { size: 58, czas: "13s", delay: "0s",    top: "56%", opacity: 0.9 },
  { size: 47, czas: "18s", delay: "3.2s",  top: "62%", opacity: 0.78 },
  { size: 38, czas: "22s", delay: "6.8s",  top: "52%", opacity: 0.65 },
  { size: 31, czas: "27s", delay: "10.5s", top: "67%", opacity: 0.52 },
  { size: 26, czas: "30s", delay: "14s",   top: "58%", opacity: 0.40 },
  { size: 21, czas: "35s", delay: "18s",   top: "72%", opacity: 0.30 },
];

const LINIE = [
  { top: "20%", w: 220, czas: "2.6s", delay: "0s",    opacity: 0.14, kolor: "#f97316" },
  { top: "33%", w: 130, czas: "2.0s", delay: "0.5s",  opacity: 0.08, kolor: "#ffffff" },
  { top: "46%", w: 260, czas: "3.2s", delay: "1.0s",  opacity: 0.18, kolor: "#f97316" },
  { top: "57%", w: 95,  czas: "1.8s", delay: "0.3s",  opacity: 0.07, kolor: "#ffffff" },
  { top: "70%", w: 180, czas: "2.8s", delay: "1.6s",  opacity: 0.12, kolor: "#fb923c" },
  { top: "13%", w: 150, czas: "3.5s", delay: "2.1s",  opacity: 0.09, kolor: "#f97316" },
  { top: "80%", w: 110, czas: "2.1s", delay: "0.7s",  opacity: 0.06, kolor: "#ffffff" },
  { top: "40%", w: 300, czas: "4.2s", delay: "1.3s",  opacity: 0.20, kolor: "#f97316" },
  { top: "27%", w: 85,  czas: "1.6s", delay: "0.9s",  opacity: 0.06, kolor: "#ffffff" },
  { top: "64%", w: 200, czas: "3.6s", delay: "2.4s",  opacity: 0.14, kolor: "#fb923c" },
  { top: "51%", w: 140, czas: "2.3s", delay: "0.1s",  opacity: 0.10, kolor: "#f97316" },
  { top: "76%", w: 75,  czas: "1.9s", delay: "1.8s",  opacity: 0.05, kolor: "#ffffff" },
];

export function HeroBaner() {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background:
          "linear-gradient(140deg, #0c0c0e 0%, #18181b 45%, #1c0f00 100%)",
      }}
    >
      {/* Pomarańczowy blask wschodu słońca na dole */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "45%",
          background:
            "radial-gradient(ellipse 80% 60% at 50% 110%, rgba(249,115,22,0.28) 0%, rgba(251,146,60,0.08) 50%, transparent 75%)",
          animation: "glowPulse 4s ease-in-out infinite",
        }}
      />

      {/* Linie podłogi (track) — poziome linie perspektywy */}
      <div className="absolute bottom-0 left-0 right-0 h-24 opacity-15">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute left-0 right-0"
            style={{
              bottom: `${i * 22}px`,
              height: "1px",
              background: "linear-gradient(to right, transparent, rgba(249,115,22,0.6) 20%, rgba(249,115,22,0.6) 80%, transparent)",
            }}
          />
        ))}
      </div>

      {/* Linie prędkości */}
      {LINIE.map((l, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            top: l.top,
            width: l.w,
            height: "1.5px",
            background: `linear-gradient(to left, transparent 0%, ${l.kolor} 60%, ${l.kolor} 100%)`,
            opacity: l.opacity,
            animation: `speedStreak ${l.czas} linear ${l.delay} infinite`,
            filter: "blur(0.4px)",
          }}
        />
      ))}

      {/* Biegacze */}
      {BIEGACZE.map((b, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: b.top,
            opacity: b.opacity,
            animation: `runAcross ${b.czas} linear ${b.delay} infinite`,
            filter: "drop-shadow(0 2px 6px rgba(249,115,22,0.3))",
          }}
        >
          <div
            style={{
              animation: `runBob 0.42s ease-in-out ${i * 0.07}s infinite alternate`,
            }}
          >
            <Biegacz size={b.size} />
          </div>
        </div>
      ))}

      {/* Gradient tekstu — lewa strona bardzo ciemna */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(12,12,14,0.97) 0%, rgba(12,12,14,0.75) 35%, rgba(12,12,14,0.30) 65%, transparent 100%)",
        }}
      />
      {/* Dolny gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(12,12,14,0.55) 0%, transparent 40%)",
        }}
      />
    </div>
  );
}
