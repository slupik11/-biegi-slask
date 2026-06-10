import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const [oczekujace, opublikowane] = await Promise.all([
    prisma.bieg.groupBy({
      by: ["zrodlo"],
      where: { status: "do_akceptacji" },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),
    prisma.bieg.groupBy({
      by: ["zrodlo"],
      where: { status: "opublikowany" },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),
  ]);

  return NextResponse.json({
    oczekujace: oczekujace.map((r) => ({ zrodlo: r.zrodlo, liczba: r._count.id })),
    opublikowane: opublikowane.map((r) => ({ zrodlo: r.zrodlo, liczba: r._count.id })),
  });
}
