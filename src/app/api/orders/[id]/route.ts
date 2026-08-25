import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, apiErrorResponse, ApiError } from "@/lib/api-auth";

async function loadOrderForUser(id: number, user: Awaited<ReturnType<typeof requireUser>>) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      service: true,
      provider: { select: { id: true, businessName: true, userId: true } },
      client: { select: { id: true, name: true, phone: true } },
      vehicle: true,
      statusHistory: { orderBy: { createdAt: "asc" }, include: { changedBy: { select: { name: true, role: true } } } },
      dispute: true,
      review: true,
    },
  });
  if (!order) throw new ApiError(404, "Заказ не найден");

  // Владение: клиент видит только свой заказ, исполнитель — только свой,
  // админ — любой. Проверка на уровне API, а не только скрытая кнопка в UI.
  const isOwner =
    user.role === "ADMIN" ||
    order.clientId === user.id ||
    order.providerId === user.provider?.id;
  if (!isOwner) throw new ApiError(403, "У вас нет доступа к этому заказу");

  return order;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const order = await loadOrderForUser(Number(id), user);
    return NextResponse.json({ order });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
