import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status } = await request.json();

  if (!["opublikowany", "odrzucony"].includes(status)) {
    return NextResponse.json({ error: "Nieprawidłowy status" }, { status: 400 });
  }

  const bieg = await prisma.bieg.update({
    where: { id: Number(id) },
    data: { status },
  });

  return NextResponse.json({ sukces: true, id: bieg.id, status: bieg.status });
}
