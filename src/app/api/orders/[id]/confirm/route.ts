import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, requireRole, apiErrorResponse, ApiError } from "@/lib/api-auth";
import { paymentProvider } from "@/lib/payments";

/**
 * КЛЮЧЕВАЯ операция эскроу: только клиент подтверждает, что работа
 * выполнена, и только в этот момент деньги перестают быть "замороженными"
 * и становятся доступны исполнителю к выводу (payoutStatus=AVAILABLE).
 */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = requireRole(await requireUser(), ["CLIENT"]);
    const { id } = await params;
    const orderId = Number(id);

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new ApiError(404, "Заказ не найден");
    if (order.clientId !== user.id) throw new ApiError(403, "Это не ваш заказ");
    if (order.status !== "AWAITING_CLIENT_CONFIRMATION") {
      throw new ApiError(409, `Подтвердить можно только заказ в статусе "Ожидает подтверждения", сейчас: ${order.status}`);
    }

    const release = await paymentProvider.releaseFunds(order.code, order.providerAmount);

    const updated = await prisma.$transaction(async (tx) => {
      await tx.orderStatusHistory.create({
        data: { orderId, status: "PAYOUT", changedById: user.id, note: "Клиент подтвердил выполнение работы" },
      });
      await tx.orderStatusHistory.create({
        data: { orderId, status: "COMPLETED", changedById: user.id },
      });
      return tx.order.update({
        where: { id: orderId },
        data: {
          status: "COMPLETED",
          paymentStatus: release.success ? "RELEASED" : order.paymentStatus,
          payoutStatus: release.success ? "AVAILABLE" : order.payoutStatus,
        },
      });
    });

    return NextResponse.json({ order: updated });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
