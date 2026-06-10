import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { haslo } = await req.json();

  if (haslo !== "slupik") {
    return NextResponse.json({ error: "Złe hasło" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_sesja", "biegi_slask_admin", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 dni
  });
  return res;
}
