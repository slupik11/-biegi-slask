"use client";

// ── Kluczowe: keyframes muszą być inline — Tailwind v4 nie przetwarza
//    @keyframes z globals.css w sposób kompatybilny z zewnętrznymi animacjami.
const STYLE = `
  @keyframes runAcross {
    0%   { transform: translateX(110vw); }
    100% { transform: translateX(-200px); }
  }
  @keyframes runBob {
    0%   { transform: translateY(0px) rotate(0deg); }
    100% { transform: translateY(-8px) rotate(-1.5deg); }
  }
  @keyframes speedStreak {
    0%   { transform: translateX(110vw); opacity: 0; }
    5%   { opacity: 1; }
    88%  { opacity: 0.8; }
    100% { transform: translateX(-70vw); opacity: 0; }
  }
  @keyframes glowPulse {
    0%, 100% { opacity: 0.30; }
    50%       { opacity: 0.55; }
  }
  @keyframes floatShoe {
    0%, 100% { transform: translateY(0px) rotate(-8deg); }
    50%       { transform: translateY(-12px) rotate(-6deg); }
  }
`;

// Biegacz w pełnym kroku — sylwetka SVG
function Biegacz({ size }: { size: number }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="-20 -48 40 80" fill="none">
      {/* Głowa */}
      <circle cx="2" cy="-39" r="7.5" fill="white" />
      {/* Tors — pochylony do przodu */}
      <line x1="2" y1="-31" x2="-3" y2="-8"
        stroke="white" strokeWidth="4" strokeLinecap="round" />
      {/* Lewe ramię — do przodu i w dół */}
      <line x1="0" y1="-24" x2="-15" y2="-14"
        stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      {/* Prawe ramię — do tyłu i w górę */}
      <line x1="0" y1="-24" x2="14" y2="-34"
        stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      {/* Lewa noga — wykrok do przodu, kolano zgięte */}
      <polyline points="-3,-8 -13,12 -11,28"
        stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Prawa noga — wypchnięta do tyłu/góry */}
      <polyline points="-3,-8  15,5  17,-10"
        stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Duży but biegowy — sylwetka dekoracyjna (widok z boku, nos w prawo)
function ButBiegowy() {
  return (
    <svg
      viewBox="0 0 260 120"
      width="380"
      height="175"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Podeszwa zewnętrzna */}
      <path
        d="M18 96 C10 96 6 102 9 108 C12 113 22 116 36 116
           L218 116 C232 116 242 111 242 104 C242 97 232 93 220 93 Z"
        fill="#f97316"
      />
      {/* Podeszwa środkowa — jaśniejszy pasek */}
      <path
        d="M20 90 L222 90 C234 90 242 94 242 100 L220 93 L20 93 Z"
        fill="#fb923c"
      />
      {/* Główna cholewka */}
      <path
        d="M22 90
           C22 66 34 46 70 32
           C102 20 152 22 188 28
           C208 32 222 46 222 64
           C222 78 212 90 196 90 Z"
        fill="white"
      />
      {/* Zakrętka piętowa / heel counter */}
      <path
        d="M182 28 C200 24 218 34 220 52 C222 66 214 80 200 86
           L192 90 C208 88 220 78 220 64 C220 48 208 34 182 28 Z"
        fill="rgba(249,115,22,0.45)"
      />
      {/* Kołnierz / ankle collar */}
      <path
        d="M176 30 C186 20 198 18 200 26 C204 36 196 54 184 60
           L174 64 L172 44 Z"
        fill="rgba(249,115,22,0.75)"
      />
      {/* Nos buta */}
      <path
        d="M22 90 C10 86 6 74 12 64 C16 58 26 55 32 60 L32 90 Z"
        fill="rgba(249,115,22,0.20)"
      />
      {/* Linie sznurowania */}
      {[78, 106, 132, 156].map((x) => (
        <line key={x} x1={x} y1={x === 78 ? 32 : 28} x2={x} y2={87}
          stroke="rgba(249,115,22,0.30)" strokeWidth="2" />
      ))}
      {/* Swoosh / dekoracyjna linia */}
      <path
        d="M 85 72 Q 130 50 180 58"
        stroke="rgba(255,255,255,0.22)" strokeWidth="5"
        fill="none" strokeLinecap="round"
      />
      {/* Odbicia świateł */}
      <path d="M 90 34 Q 130 28 170 32" stroke="rgba(255,255,255,0.15)"
        strokeWidth="8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// Negative delays = biegacze NATYCHMIAST widoczni na ekranie przy załadowaniu
const BIEGACZE = [
  { size: 62, czas: "13s", delay: "-5s",  top: "54%", opacity: 0.92 },
  { size: 50, czas: "18s", delay: "-9s",  top: "60%", opacity: 0.80 },
  { size: 40, czas: "22s", delay: "-6s",  top: "50%", opacity: 0.68 },
  { size: 33, czas: "27s", delay: "-14s", top: "65%", opacity: 0.55 },
  { size: 27, czas: "31s", delay: "-4s",  top: "57%", opacity: 0.42 },
  { size: 22, czas: "36s", delay: "-20s", top: "70%", opacity: 0.32 },
];

const LINIE = [
  { top: "18%", w: 240, czas: "2.4s", delay: "-0.5s", op: 0.22, kolor: "#f97316" },
  { top: "31%", w: 140, czas: "1.9s", delay: "-1.1s", op: 0.12, kolor: "#ffffff" },
  { top: "44%", w: 290, czas: "3.0s", delay: "-0.3s", op: 0.26, kolor: "#f97316" },
  { top: "56%", w: 100, czas: "1.7s", delay: "-0.8s", op: 0.10, kolor: "#ffffff" },
  { top: "68%", w: 200, czas: "2.7s", delay: "-1.5s", op: 0.18, kolor: "#fb923c" },
  { top: "12%", w: 160, czas: "3.3s", delay: "-2.0s", op: 0.14, kolor: "#f97316" },
  { top: "79%", w: 120, czas: "2.0s", delay: "-0.6s", op: 0.09, kolor: "#ffffff" },
  { top: "38%", w: 320, czas: "4.0s", delay: "-1.2s", op: 0.28, kolor: "#f97316" },
  { top: "25%", w: 90,  czas: "1.6s", delay: "-0.9s", op: 0.09, kolor: "#ffffff" },
  { top: "62%", w: 210, czas: "3.4s", delay: "-2.3s", op: 0.20, kolor: "#fb923c" },
  { top: "48%", w: 150, czas: "2.2s", delay: "-0.2s", op: 0.15, kolor: "#f97316" },
  { top: "74%", w: 80,  czas: "1.8s", delay: "-1.7s", op: 0.08, kolor: "#ffffff" },
];

export function HeroBaner() {
  return (
    <>
      <style>{STYLE}</style>
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          background:
            "linear-gradient(140deg, #0c0c0e 0%, #1c1917 50%, #1e0e00 100%)",
        }}
      >
        {/* ── Pomarańczowy blask świtu na dole ── */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "50%",
            background:
              "radial-gradient(ellipse 80% 65% at 50% 115%, rgba(249,115,22,0.35) 0%, rgba(251,146,60,0.10) 55%, transparent 78%)",
            animation: "glowPulse 4s ease-in-out infinite",
          }}
        />

        {/* ── Linie toru biegu (perspektywa) ── */}
        <div className="absolute bottom-0 left-0 right-0 h-20" style={{ opacity: 0.18 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute left-0 right-0"
              style={{
                bottom: i * 18,
                height: "1px",
                background:
                  "linear-gradient(to right, transparent 0%, rgba(249,115,22,0.7) 15%, rgba(249,115,22,0.7) 85%, transparent 100%)",
              }}
            />
          ))}
        </div>

        {/* ── Linie prędkości ── */}
        {LINIE.map((l, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: l.top,
              width: l.w,
              height: "2px",
              borderRadius: "9999px",
              background: `linear-gradient(to left, transparent 0%, ${l.kolor} 50%, ${l.kolor} 100%)`,
              opacity: l.op,
              animation: `speedStreak ${l.czas} linear ${l.delay} infinite`,
              filter: "blur(0.5px)",
            }}
          />
        ))}

        {/* ── Biegacze SVG ── */}
        {BIEGACZE.map((b, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: b.top,
              opacity: b.opacity,
              animation: `runAcross ${b.czas} linear ${b.delay} infinite`,
              filter: `drop-shadow(0 3px 8px rgba(249,115,22,0.35))`,
            }}
          >
            <div
              style={{
                animation: `runBob 0.42s ease-in-out ${i * 0.06}s infinite alternate`,
              }}
            >
              <Biegacz size={b.size} />
            </div>
          </div>
        ))}

        {/* ── Duży dekoracyjny but biegowy po prawej ── */}
        <div
          className="absolute hidden sm:block"
          style={{
            right: "-30px",
            bottom: "10px",
            opacity: 0.13,
            animation: "floatShoe 5s ease-in-out infinite",
            filter: "drop-shadow(0 0 30px rgba(249,115,22,0.4))",
          }}
        >
          <ButBiegowy />
        </div>

        {/* ── Gradient tekstu — lewa ciemna ── */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(12,12,14,0.97) 0%, rgba(12,12,14,0.78) 30%, rgba(12,12,14,0.35) 60%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(12,12,14,0.60) 0%, transparent 40%)",
          }}
        />
      </div>
    </>
  );
}
