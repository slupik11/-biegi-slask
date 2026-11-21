import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLICZNE = ["/admin/login", "/api/admin/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PUBLICZNE.some((p) => pathname.startsWith(p))) return NextResponse.next();

  if (request.cookies.get("admin_sesja")?.value !== "biegi_slask_admin") {
    // API admina bez logowania → 401, strony → ekran logowania
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Brak dostępu" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
