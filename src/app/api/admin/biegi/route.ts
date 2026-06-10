import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const biegi = await prisma.bieg.findMany({
    where: { status: "do_akceptacji" },
    orderBy: { dataUtworzenia: "desc" },
  });

  return NextResponse.json(
    biegi.map((b) => ({
      ...b,
      dystanse: JSON.parse(b.dystanse || "[]"),
      data: b.data.toISOString(),
      dataUtworzenia: b.dataUtworzenia.toISOString(),
      dataAktualizacji: b.dataAktualizacji.toISOString(),
    }))
  );
}
