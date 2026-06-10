export function HeroBaner() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ objectPosition: "center 30%" }}
      />
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.66)" }} />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.05) 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "35%",
          background: "linear-gradient(to top, rgba(249,115,22,0.16) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
