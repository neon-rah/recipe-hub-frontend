import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("refreshToken")?.value;

    // Définis les routes protégées avec des patrons dynamiques pour inclure toutes les sous-routes
    const protectedRoutes = ["/dashboard/:path*", "/personal/:path*"];

    // Vérifie si la route actuelle correspond à une route protégée
    if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route.split(":")[0])) && !token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/personal/:path*"],
};