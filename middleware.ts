import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";
import aj, { createMiddleware, detectBot, shield } from "./lib/arcjet";
export async function middleware(request:NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session){
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next();
}

const validate = aj
    .withRule(shield({mode:'LIVE'}))
    .withRule(detectBot({mode:'LIVE', allow:['CATEGORY:SEARCH_ENGINE','G00G1E_CRAWLER']}))

    export default createMiddleware(validate)

export const config = {
     matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|assets).*)"],
}