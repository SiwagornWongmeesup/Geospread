import { NextResponse } from 'next/server';

export function middleware(request) {
    const userCookie = request.cookies.get('user'); // เช็คคุกกี้
    const { pathname } = request.nextUrl;

    // รายชื่อหน้าที่จะดัก (ห้ามเข้าถ้าไม่ Login)
    const protectedPaths = ['/sos', '/report', '/profile', '/requests', '/admin-panel'];

    // เช็คว่าหน้าปัจจุบันอยู่ในรายการที่ต้องดักไหม
    const isProtected = protectedPaths.some(path => pathname.startsWith(path));

    if (isProtected && !userCookie) {
        // 🚨 ถ้าพยายามเข้าหน้าพวกนี้แต่ไม่มีคุกกี้ ให้ดีดไปหน้าแรก
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// กำหนดให้ Middleware ทำงานเฉพาะหน้าเว็บ
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};