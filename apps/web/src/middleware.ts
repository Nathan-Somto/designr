import { NextRequest, NextResponse } from "next/server";
import { LINKS } from "./constants/links";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
    const pathname = request.nextUrl.pathname;
    console.log("session cookie: ", sessionCookie);
    const protectedPaths = [
        LINKS.DASHBOARD,
        LINKS.COMMUNITY,
        LINKS.SETTINGS,
        LINKS.FAVOURITES,
    ];

    const isProtected = protectedPaths.some((path) =>
        pathname.startsWith(path)
    );

    if (!sessionCookie && isProtected) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}


export const config = {
    //runtime: "nodejs",
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};