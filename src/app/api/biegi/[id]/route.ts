import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bieg = await prisma.bieg.findFirst({
    where: { id: Number(id), status: "opublikowany" },
  });

  if (!bieg) {
    return NextResponse.json({ error: "Nie znaleziono biegu" }, { status: 404 });
  }

  return NextResponse.json({
    ...bieg,
    dystanse: JSON.parse(bieg.dystanse || "[]"),
    data: bieg.data.toISOString(),
    dataUtworzenia: bieg.dataUtworzenia.toISOString(),
    dataAktualizacji: bieg.dataAktualizacji.toISOString(),
  });
}
