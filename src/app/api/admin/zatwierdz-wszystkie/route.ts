import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const result = await prisma.bieg.updateMany({
    where: { status: "do_akceptacji", zrodlo: { not: "formularz" } },
    data: { status: "opublikowany" },
  });
  return NextResponse.json({ opublikowano: result.count });
}
