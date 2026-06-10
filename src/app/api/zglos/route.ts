import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nazwa, data, miasto, dystanse, typ, linkDoZapisow, opis, emailKontakt } = body;

    if (!nazwa || !data || !miasto || !dystanse || !typ) {
      return NextResponse.json({ error: "Brakuje wymaganych pól" }, { status: 400 });
    }

    const bieg = await prisma.bieg.create({
      data: {
        nazwa: nazwa.trim(),
        data: new Date(data),
        miasto: miasto.trim(),
        dystanse: JSON.stringify(
          Array.isArray(dystanse) ? dystanse : [dystanse]
        ),
        typ,
        linkDoZapisow: linkDoZapisow?.trim() || null,
        opis: opis?.trim() || null,
        zrodlo: "formularz",
        emailKontakt: emailKontakt?.trim() || null,
        status: "do_akceptacji",
      },
    });

    return NextResponse.json({ sukces: true, id: bieg.id });
  } catch {
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
