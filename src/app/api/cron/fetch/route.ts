import { NextRequest, NextResponse } from "next/server";
import { fetchAll } from "@/lib/fetch-all";

// Uruchamiane codziennie przez Vercel Cron (vercel.json).
// Przy okazji utrzymuje bazę Supabase w ruchu, żeby darmowy projekt nie był usypiany.
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const sekret = process.env.CRON_SECRET;
  if (sekret && req.headers.get("authorization") !== `Bearer ${sekret}`) {
    return NextResponse.json({ error: "Brak dostępu" }, { status: 401 });
  }
  const wyniki = await fetchAll();
  return NextResponse.json({ wyniki });
}
