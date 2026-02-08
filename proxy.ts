import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";

import { checkSession } from "@/lib/api/serverApi";
import type { User } from "@/types/user";

const privateRoutes = ["/profile", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

function applySetCookies(response: NextResponse, setCookie: string[]) {
  for (const c of setCookie) response.headers.append("set-cookie", c);
}

function mergeCookieHeader(currentCookieHeader: string, setCookie: string[]) {
  const jar = parse(currentCookieHeader || "");

  for (const setCookieStr of setCookie) {
    const firstPart = setCookieStr.split(";")[0] ?? "";
    const parsed = parse(firstPart);

    for (const [name, value] of Object.entries(parsed)) {
      jar[name] = value;
    }
  }

  return Object.entries(jar)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}

function isSessionOk(data: unknown): boolean {
  if (!data) return false;
  if (typeof data === "string") return false;
  if (typeof data !== "object") return false;

  // формат { success: boolean }
  if ("success" in data) return Boolean((data as { success: boolean }).success);

  // формат User
  return true;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let isAuthenticated = Boolean(accessToken);

  let setCookieFromSession: string[] = [];
  let updatedCookieHeader: string | null = null;

  // якщо accessToken нема, але є refreshToken — пробуємо оновити сесію
  if (!accessToken && refreshToken) {
    const cookieHeader = request.headers.get("cookie") ?? "";

    try {
      const res = await checkSession(cookieHeader);

      if (isSessionOk(res.data)) {
        isAuthenticated = true;

        const raw = res.headers?.["set-cookie"];
        setCookieFromSession = Array.isArray(raw) ? raw : raw ? [raw] : [];

        if (setCookieFromSession.length) {
          updatedCookieHeader = mergeCookieHeader(
            cookieHeader,
            setCookieFromSession,
          );
        }
      } else {
        isAuthenticated = false;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // неавторизований -> приватний маршрут => /sign-in
  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // авторизований -> auth маршрут => на головну (/)
  if (isAuthRoute && isAuthenticated) {
    const response = NextResponse.redirect(new URL("/", request.url));
    if (setCookieFromSession.length)
      applySetCookies(response, setCookieFromSession);
    return response;
  }

  // якщо оновили cookieHeader — прокидуємо оновлені cookies у request до SSR
  if (updatedCookieHeader) {
    const headers = new Headers(request.headers);
    headers.set("cookie", updatedCookieHeader);

    const response = NextResponse.next({ request: { headers } });
    if (setCookieFromSession.length)
      applySetCookies(response, setCookieFromSession);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
