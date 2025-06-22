import { NextResponse } from "next/server";

export function middleware() {
  // No authentication middleware needed, handled in app logic
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
