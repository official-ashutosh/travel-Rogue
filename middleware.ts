import { NextResponse } from "next/server";

// Remove Clerk middleware, export a no-op middleware to fix the error
export function middleware() {
  // No authentication middleware needed, handled in app logic
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
