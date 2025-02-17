import { getSessionCookie } from 'better-auth'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const sessionCookie = getSessionCookie(req)

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/sign-in', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|sign-in|sign-up|two-factor|api|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
}
