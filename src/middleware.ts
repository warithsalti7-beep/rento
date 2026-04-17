import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/admin")) {
    if (!req.auth?.user) {
      const url = new URL("/auth/sign-in", req.url);
      url.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(url);
    }
  }

  if (path.startsWith("/account")) {
    if (!req.auth?.user) {
      return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
