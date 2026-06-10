"use client";

// Keyframes muszą być inline — Tailwind v4 nie przetwarza @keyframes z globals.css
const STYLE = `
  @keyframes speedStreak {
    0%   { transform: translateX(110vw); opacity: 0; }
    6%   { opacity: 1; }
    88%  { opacity: 0.8; }
    100% { transform: translateX(-70vw); opacity: 0; }
  }
`;

// Delikatne linie prędkości — tylko pomarańcz i biel, subtelne
const LINIE = [
  { top: "15%", w: 260, czas: "3.2s", delay: "-0.8s", op: 0.10, kolor: "#f97316" },
  { top: "28%", w: 150, czas: "2.4s", delay: "-1.5s", op: 0.06, kolor: "#ffffff" },
  { top: "42%", w: 320, czas: "4.0s", delay: "-0.3s", op: 0.12, kolor: "#f97316" },
  { top: "55%", w: 110, czas: "2.0s", delay: "-2.1s", op: 0.05, kolor: "#ffffff" },
  { top: "67%", w: 220, czas: "3.5s", delay: "-1.0s", op: 0.09, kolor: "#fb923c" },
  { top: "10%", w: 180, czas: "2.8s", delay: "-2.6s", op: 0.07, kolor: "#f97316" },
  { top: "78%", w: 130, czas: "2.2s", delay: "-0.6s", op: 0.05, kolor: "#ffffff" },
  { top: "36%", w: 280, czas: "3.8s", delay: "-1.8s", op: 0.11, kolor: "#f97316" },
  { top: "22%", w: 95,  czas: "1.9s", delay: "-1.2s", op: 0.05, kolor: "#ffffff" },
  { top: "61%", w: 200, czas: "3.3s", delay: "-2.4s", op: 0.08, kolor: "#fb923c" },
  { top: "48%", w: 160, czas: "2.6s", delay: "-0.4s", op: 0.07, kolor: "#f97316" },
  { top: "72%", w: 85,  czas: "2.1s", delay: "-1.6s", op: 0.04, kolor: "#ffffff" },
];

export function HeroBaner() {
  return (
    <>
      <style>{STYLE}</style>
      <div className="absolute inset-0 overflow-hidden">

        {/* ── Zdjęcie biegaczy w tle ── */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ objectPosition: "center 30%" }}
        />

        {/* ── Przyciemnienie zdjęcia ── */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.58)" }}
        />

        {/* ── Gradient — lewa strona jeszcze ciemniejsza dla tekstu ── */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.05) 100%)",
          }}
        />

        {/* ── Delikatny pomarańczowy blask u dołu ── */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "35%",
            background:
              "linear-gradient(to top, rgba(249,115,22,0.18) 0%, transparent 100%)",
          }}
        />

        {/* ── Subtelne linie prędkości ── */}
        {LINIE.map((l, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: l.top,
              width: l.w,
              height: "1.5px",
              borderRadius: "9999px",
              background: `linear-gradient(to left, transparent 0%, ${l.kolor} 55%, ${l.kolor} 100%)`,
              opacity: l.op,
              animation: `speedStreak ${l.czas} linear ${l.delay} infinite`,
              filter: "blur(0.4px)",
            }}
          />
        ))}
      </div>
    </>
  );
}
