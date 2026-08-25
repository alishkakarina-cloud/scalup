import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "./auth";
import { prisma } from "./db";
import type { Role } from "@prisma/client";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * Достаёт и проверяет сессию из cookie запроса. Бросает 401, если пользователь
 * не аутентифицирован — вызывать в начале каждого защищённого route handler'а.
 */
export async function requireUser() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) throw new ApiError(401, "Не авторизован");

  const session = await verifySession(token);
  if (!session) throw new ApiError(401, "Сессия недействительна");

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    include: { provider: true },
  });
  if (!user) throw new ApiError(401, "Пользователь не найден");

  return user;
}

/**
 * Проверяет роль ПОСЛЕ аутентификации. Разграничение доступа по ролям (RBAC) —
 * недостаточно скрыть кнопку в UI, каждый API-роут обязан перепроверять роль сам.
 */
export function requireRole<T extends { role: Role }>(user: T, roles: Role[]): T {
  if (!roles.includes(user.role)) {
    throw new ApiError(403, "Недостаточно прав для этого действия");
  }
  return user;
}

export function apiErrorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error("Unhandled API error:", error);
  return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
}
