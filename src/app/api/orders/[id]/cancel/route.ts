import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, apiErrorResponse, ApiError } from "@/lib/api-auth";
import { paymentProvider } from "@/lib/payments";

const CANCELLABLE_STATUSES = ["NEW", "CONFIRMED"] as const;

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const orderId = Number(id);

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new ApiError(404, "Заказ не найден");

    const isParty =
      user.role === "ADMIN" || order.clientId === user.id || order.providerId === user.provider?.id;
    if (!isParty) throw new ApiError(403, "У вас нет доступа к этому заказу");

    if (!CANCELLABLE_STATUSES.includes(order.status as (typeof CANCELLABLE_STATUSES)[number])) {
      throw new ApiError(409, `Заказ в статусе ${order.status} отменить уже нельзя — работа уже начата`);
    }

    // Если деньги были заморожены — возвращаем клиенту при отмене.
    const shouldRefund = order.paymentStatus === "HELD";
    const refund = shouldRefund
      ? await paymentProvider.refund(order.code, order.orderAmount)
      : { success: true };

    const updated = await prisma.$transaction(async (tx) => {
      await tx.orderStatusHistory.create({
        data: { orderId, status: "CANCELLED", changedById: user.id },
      });
      return tx.order.update({
        where: { id: orderId },
        data: {
          status: "CANCELLED",
          paymentStatus: shouldRefund && refund.success ? "REFUNDED" : order.paymentStatus,
          refundStatus: shouldRefund && refund.success ? "FULL" : order.refundStatus,
        },
      });
    });

    return NextResponse.json({ order: updated });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
