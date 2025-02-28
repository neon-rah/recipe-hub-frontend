// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import {verifyRefreshToken} from "@/config/api";


export async function middleware(req: NextRequest) {
    const refreshToken = req.cookies.get("refreshToken")?.value;
    const publicRoutes = ["/register", "/login", "/api/set-cookie"]; // Ajout de /api/set-cookie

    console.log("Middleware - Chemin demandé:", req.nextUrl.pathname);
    console.log("Middleware - refreshToken dans cookies:", refreshToken);

    if (publicRoutes.includes(req.nextUrl.pathname)) {
        console.log("Middleware - Route publique, accès autorisé sans vérification");
        return NextResponse.next();
    }

    if (!refreshToken) {
        console.log("Middleware - Aucun refreshToken, redirection vers /login");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const isValid = await verifyRefreshToken();
    console.log("Middleware - Validité du refreshToken:", isValid);
    if (!isValid) {
        console.log("Middleware - refreshToken invalide, redirection vers /login");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    console.log("Middleware - Token valide, accès autorisé");
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!register|login|api\\/set-cookie|_next/static|_next/image|favicon.ico).*)"], // Mise à jour du matcher
};