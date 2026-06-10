import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const miasto = searchParams.get("miasto");
  const typ = searchParams.get("typ");
  const miesiac = searchParams.get("miesiac"); // format: "2025-06"
  const dystans = searchParams.get("dystans");
  const szukaj = searchParams.get("szukaj");

  const where: Record<string, unknown> = {
    status: "opublikowany",
    data: { gte: new Date() },
  };

  if (miasto) where.miasto = { contains: miasto };
  if (typ) where.typ = typ;
  if (szukaj) where.nazwa = { contains: szukaj };
  if (miesiac) {
    const [rok, mies] = miesiac.split("-").map(Number);
    const poczatek = new Date(rok, mies - 1, 1);
    const koniec = new Date(rok, mies, 0, 23, 59, 59);
    where.data = { gte: poczatek, lte: koniec };
  }

  const biegi = await prisma.bieg.findMany({
    where,
    orderBy: { data: "asc" },
    take: 200,
  });

  const result = biegi
    .map((b) => ({
      ...b,
      dystanse: JSON.parse(b.dystanse || "[]"),
      data: b.data.toISOString(),
      dataUtworzenia: b.dataUtworzenia.toISOString(),
      dataAktualizacji: b.dataAktualizacji.toISOString(),
    }))
    .filter((b) => {
      if (!dystans) return true;
      return b.dystanse.some((d: string) =>
        d.toLowerCase().includes(dystans.toLowerCase())
      );
    });

  return NextResponse.json(result);
}
