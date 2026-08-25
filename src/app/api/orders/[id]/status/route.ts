import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser, apiErrorResponse, ApiError } from "@/lib/api-auth";
import type { OrderStatus } from "@prisma/client";

// Строгий порядок статусов по ТЗ — только вперёд, без пропусков и без
// произвольных прыжков. Кто именно может выполнить переход — тоже фиксировано.
const PROVIDER_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus>> = {
  NEW: "CONFIRMED",
  CONFIRMED: "PROVIDER_EN_ROUTE",
  PROVIDER_EN_ROUTE: "WORK_STARTED",
  WORK_STARTED: "WORK_COMPLETED",
};

const schema = z.object({
  action: z.enum(["CONFIRMED", "PROVIDER_EN_ROUTE", "WORK_STARTED", "WORK_COMPLETED"]),
  note: z.string().trim().max(500).optional(),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const orderId = Number(id);
    const body = schema.parse(await req.json());

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new ApiError(404, "Заказ не найден");

    const isOwnerProvider = user.role === "PROVIDER" && order.providerId === user.provider?.id;
    if (!isOwnerProvider && user.role !== "ADMIN") {
      throw new ApiError(403, "Менять статус выполнения заказа может только исполнитель или админ");
    }
    if (order.status === "DISPUTED" || order.status === "CANCELLED" || order.status === "COMPLETED") {
      throw new ApiError(409, `Заказ в статусе ${order.status} — статус выполнения менять нельзя`);
    }

    const expectedNext = PROVIDER_TRANSITIONS[order.status];
    if (expectedNext !== body.action) {
      throw new ApiError(
        409,
        `Недопустимый переход: из ${order.status} нельзя перейти в ${body.action} (ожидался ${expectedNext ?? "конечный статус"})`
      );
    }

    // "Работа завершена" сразу переводит в ожидание подтверждения клиентом —
    // это два разных статуса из ТЗ, фиксируем оба перехода в истории отдельно.
    const finalStatus: OrderStatus = body.action === "WORK_COMPLETED" ? "AWAITING_CLIENT_CONFIRMATION" : body.action;

    const updated = await prisma.$transaction(async (tx) => {
      await tx.orderStatusHistory.create({
        data: { orderId, status: body.action, changedById: user.id, note: body.note },
      });
      if (finalStatus !== body.action) {
        await tx.orderStatusHistory.create({
          data: { orderId, status: finalStatus, changedById: user.id, note: "Ожидание подтверждения клиентом" },
        });
      }
      return tx.order.update({ where: { id: orderId }, data: { status: finalStatus } });
    });

    return NextResponse.json({ order: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
    }
    return apiErrorResponse(error);
  }
}
