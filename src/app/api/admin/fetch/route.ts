import { NextResponse } from "next/server";
import { fetchAll } from "@/lib/fetch-all";

export async function POST() {
  try {
    await fetchAll();
    return NextResponse.json({ sukces: true });
  } catch (e) {
    console.error("[fetchAll] Błąd:", e);
    return NextResponse.json({ error: "Błąd pobierania" }, { status: 500 });
  }
}
