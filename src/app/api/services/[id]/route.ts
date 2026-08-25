import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser, requireRole, apiErrorResponse, ApiError } from "@/lib/api-auth";

const schema = z.object({
  name: z.string().trim().min(2).max(160).optional(),
  description: z.string().trim().max(2000).optional(),
  price: z.number().positive().max(1_000_000).optional(),
  photoUrl: z.string().url().max(500).optional(),
  active: z.boolean().optional(),
});

async function loadOwnedService(id: string, providerId: string) {
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) throw new ApiError(404, "Услуга не найдена");
  // Владение проверяем явно — исполнитель не должен трогать чужие услуги.
  if (service.providerId !== providerId) throw new ApiError(403, "Это не ваша услуга");
  return service;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = requireRole(await requireUser(), ["PROVIDER"]);
    if (!user.provider) throw new ApiError(400, "Профиль исполнителя не найден");
    const { id } = await params;
    await loadOwnedService(id, user.provider.id);

    const body = schema.parse(await req.json());
    const service = await prisma.service.update({ where: { id }, data: body });

    return NextResponse.json({ service });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Некорректные данные" }, { status: 400 });
    }
    return apiErrorResponse(error);
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = requireRole(await requireUser(), ["PROVIDER"]);
    if (!user.provider) throw new ApiError(400, "Профиль исполнителя не найден");
    const { id } = await params;
    await loadOwnedService(id, user.provider.id);

    // Мягкое удаление — не рвём ссылочную целостность с уже существующими заказами.
    await prisma.service.update({ where: { id }, data: { active: false } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
