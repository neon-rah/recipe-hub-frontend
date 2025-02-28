import {NextRequest, NextResponse} from "next/server";



// app/api/set-cookie/route.ts
export async function POST(req: NextRequest) {
    const { refreshToken } = await req.json();
    if (!refreshToken) {
        return NextResponse.json({ error: "No refresh token provided" }, { status: 400 });
    }

    const response = NextResponse.json({ message: "Cookie set successfully" });
    response.cookies.set({
        name: "refreshToken",
        value: refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // False en local, true en prod avec HTTPS
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
        sameSite: "lax",
    });

    console.log("API interne: Cookie refreshToken défini:", refreshToken);
    return response;
}