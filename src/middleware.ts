import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "./lib/auth";

/**
 * Первый (не единственный!) уровень RBAC — гейтует доступ к страницам по
 * префиксу пути. Каждый API-роут ДОПОЛНИТЕЛЬНО перепроверяет роль и
 * владение ресурсом сам (см. lib/api-auth.ts) — middleware защищает только
 * UI-страницы от захода не той роли, а не является источником истины по
 * безопасности данных.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  const requireAuth = (roles?: Array<"CLIENT" | "PROVIDER" | "ADMIN">) => {
    if (!session) {
      const url = new URL("/login", req.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    if (roles && !roles.includes(session.role)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  };

  if (pathname.startsWith("/admin")) return requireAuth(["ADMIN"]);
  if (pathname.startsWith("/dashboard")) return requireAuth(["PROVIDER"]);
  if (pathname.startsWith("/account")) return requireAuth(["CLIENT", "PROVIDER", "ADMIN"]);

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/account/:path*"],
};
