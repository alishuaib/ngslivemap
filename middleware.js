// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
// This function can be marked `async` if using `await` inside
export function middleware(request) {
    if (request.headers.get("authorization")!==process.env.API_KEY){
        // return NextResponse.redirect(new URL('/api/auth/unauthorized',req.url))
        return new NextResponse(
          JSON.stringify({ success: false, message: 'unauthorized' }),
          { status: 401, headers: { 'content-type': 'application/json' } }
        )
    }
    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/map/:path*',
}
