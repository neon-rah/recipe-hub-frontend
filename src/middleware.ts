import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken } from "@/lib/api/authApi";

export async function middleware(req: NextRequest) {
    const publicRoutes = ["/register", "/login"];
    const refreshToken = req.cookies.get("refreshToken")?.value;

    console.log("Middleware - Chemin demandé:", req.nextUrl.pathname);
    console.log("Middleware - refreshToken dans cookies:", refreshToken || "non présent");

    // Autoriser l'accès aux routes publiques
    if (publicRoutes.includes(req.nextUrl.pathname)) {
        console.log("Middleware - Route publique, accès autorisé sans vérification");
        return NextResponse.next();
    }

    // Vérification du refreshToken
    if (!refreshToken) {
        console.log("Middleware - Aucun refreshToken, redirection vers /login");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        const isValid = await verifyRefreshToken(refreshToken);
        console.log("Middleware - Validité du refreshToken:", isValid);

        if (!isValid) {
            console.log("Middleware - refreshToken invalide, redirection vers /login");
            return NextResponse.redirect(new URL("/login", req.url));
        }

        console.log("Middleware - Token valide, accès autorisé");
        return NextResponse.next();
    } catch (error) {
        console.error("Middleware - Erreur lors de la vérification du refreshToken:", error);
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: [
        "/((?!register|login|api|_next/static|_next/image|assets/.*|favicon.ico).*)",
    ],
};
