import { NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { verifyPassword, signSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { apiErrorResponse, ApiError } from "@/lib/api-auth";
import { checkRateLimit, clientIpFrom } from "@/lib/rateLimit";

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    if (!checkRateLimit(`login:${clientIpFrom(req)}`, 10, 60_000)) {
      throw new ApiError(429, "Слишком много попыток входа, попробуйте позже");
    }

    const body = schema.parse(await req.json());

    const user = await prisma.user.findUnique({ where: { email: body.email } });
    // Намеренно одинаковое сообщение для "нет юзера" и "неверный пароль" —
    // чтобы не давать атакующему подтверждение существования email.
    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      throw new ApiError(401, "Неверный email или пароль");
    }

    const token = await signSession({ sub: user.id, role: user.role });
    (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions);

    return NextResponse.json({ id: user.id, role: user.role, name: user.name });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
    }
    return apiErrorResponse(error);
  }
}
