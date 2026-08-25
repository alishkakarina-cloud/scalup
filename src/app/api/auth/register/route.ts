import { NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { hashPassword, signSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { apiErrorResponse, ApiError } from "@/lib/api-auth";
import { checkRateLimit, clientIpFrom } from "@/lib/rateLimit";

// Публичная регистрация допускает только CLIENT/PROVIDER — роль ADMIN
// назначается только вручную (seed/другим админом), никогда через этот роут.
const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8, "Минимум 8 символов"),
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(5).max(30).optional(),
  role: z.enum(["CLIENT", "PROVIDER"]),
  businessName: z.string().trim().min(2).max(160).optional(),
});

export async function POST(req: Request) {
  try {
    if (!checkRateLimit(`register:${clientIpFrom(req)}`, 5, 60_000)) {
      throw new ApiError(429, "Слишком много попыток регистрации, попробуйте позже");
    }

    const body = schema.parse(await req.json());

    if (body.role === "PROVIDER" && !body.businessName) {
      throw new ApiError(400, "Укажите название бизнеса для регистрации исполнителя");
    }

    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) {
      throw new ApiError(409, "Пользователь с таким email уже зарегистрирован");
    }

    const passwordHash = await hashPassword(body.password);

    // MVP пока работает только по Бишкеку — выбор города убран из UI,
    // город хардкодится на бэкенде. Поле city в схеме не удаляем, чтобы
    // в будущем было легко вернуть выбор города.
    const user = await prisma.user.create({
      data: {
        email: body.email,
        passwordHash,
        name: body.name,
        phone: body.phone,
        city: "Бишкек",
        role: body.role,
        provider:
          body.role === "PROVIDER"
            ? { create: { businessName: body.businessName!, city: "Бишкек", categories: [] } }
            : undefined,
      },
    });

    const token = await signSession({ sub: user.id, role: user.role });
    (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions);

    return NextResponse.json({ id: user.id, role: user.role, name: user.name });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Некорректные данные" }, { status: 400 });
    }
    return apiErrorResponse(error);
  }
}
