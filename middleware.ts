import { type NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  let cookie = request.cookies.get("jwt");
  if (!(cookie?.value))
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|auth/sign-in|auth/sign-up).*)"]
}