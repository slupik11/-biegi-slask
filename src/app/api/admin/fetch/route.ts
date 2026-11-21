import { NextResponse } from "next/server";
import { fetchAll } from "@/lib/fetch-all";

export const maxDuration = 300;

export async function POST() {
  const wyniki = await fetchAll();
  const zapisane = wyniki.reduce((s, w) => s + w.zapisane, 0);
  const znalezione = wyniki.reduce((s, w) => s + w.znalezione, 0);
  const ok = zapisane > 0 || znalezione === 0;
  return NextResponse.json({ sukces: ok, zapisane, znalezione, wyniki }, { status: ok ? 200 : 502 });
}
