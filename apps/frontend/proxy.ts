import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    if(pathname.startsWith('/my-list')) {
        const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

        if(!token) {
            const url = new URL('/', req.url);
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/my-list/:path*']
}