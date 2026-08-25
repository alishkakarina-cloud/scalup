import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser, apiErrorResponse, ApiError } from "@/lib/api-auth";
import { hashPassword, verifyPassword } from "@/lib/auth";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = schema.parse(await req.json());

    const valid = await verifyPassword(body.currentPassword, user.passwordHash);
    if (!valid) throw new ApiError(401, "Текущий пароль указан неверно");

    const passwordHash = await hashPassword(body.newPassword);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Новый пароль должен быть не короче 8 символов" }, { status: 400 });
    }
    return apiErrorResponse(error);
  }
}
