// middleware.ts  (root of project)
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabase, supabaseResponse } = createClient(request);

  // This refreshes the session cookie on every request
  // Never use getSession() here - it's not secure on the server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  
  // Public routes that unauthenticated users CAN access
  const isAuthRoute = pathname.startsWith("/auth");
  const isTasksRoute = pathname.startsWith("/tasks");
  const isHomePage = pathname === "/";
  
  const isPublicRoute = isAuthRoute || isTasksRoute || isHomePage;

  // If user is NOT logged in and tries to access a non-public route
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // If user IS logged in and tries to access auth pages, send them to home
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Run middleware on all routes except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
