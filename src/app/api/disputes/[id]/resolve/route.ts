import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireUser, requireRole, apiErrorResponse, ApiError } from "@/lib/api-auth";
import { validateSplit } from "@/lib/finance";
import { paymentProvider } from "@/lib/payments";
import { logAudit } from "@/lib/audit";

const schema = z.object({
  resolution: z.enum(["FULL_REFUND_CLIENT", "FULL_PAY_PROVIDER", "PARTIAL_REFUND", "SPLIT"]),
  clientRefundAmount: z.number().nonnegative().optional(),
  providerPayAmount: z.number().nonnegative().optional(),
  note: z.string().trim().max(1000).optional(),
});

/**
 * Разрешение спора — только админ. Любая сумма пересчитывается и
 * проверяется сервером (validateSplit): админ не может "потерять" или
 * "создать" деньги — возврат клиенту + выплата исполнителю всегда равны
 * сумме заказа. Каждое решение пишется в audit log с состоянием до/после.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = requireRole(await requireUser(), ["ADMIN"]);
    const { id } = await params;
    const body = schema.parse(await req.json());

    const dispute = await prisma.dispute.findUnique({ where: { id }, include: { order: true } });
    if (!dispute) throw new ApiError(404, "Спор не найден");
    if (dispute.status === "RESOLVED") throw new ApiError(409, "Спор уже разрешён");

    const order = dispute.order;
    let clientRefundAmount: Prisma.Decimal;
    let providerPayAmount: Prisma.Decimal;

    switch (body.resolution) {
      case "FULL_REFUND_CLIENT":
        clientRefundAmount = order.orderAmount;
        providerPayAmount = new Prisma.Decimal(0);
        break;
      case "FULL_PAY_PROVIDER":
        clientRefundAmount = new Prisma.Decimal(0);
        providerPayAmount = order.providerAmount;
        break;
      case "PARTIAL_REFUND":
      case "SPLIT":
        if (body.clientRefundAmount === undefined || body.providerPayAmount === undefined) {
          throw new ApiError(400, "Для частичного возврата/сплита нужно указать обе суммы");
        }
        clientRefundAmount = new Prisma.Decimal(body.clientRefundAmount);
        providerPayAmount = new Prisma.Decimal(body.providerPayAmount);
        // Бросит ApiError-совместимое исключение, если суммы не сходятся с заказом.
        validateSplit(order.orderAmount, clientRefundAmount, providerPayAmount);
        break;
    }

    const before = {
      status: order.status,
      paymentStatus: order.paymentStatus,
      payoutStatus: order.payoutStatus,
      refundStatus: order.refundStatus,
    };

    if (clientRefundAmount.greaterThan(0)) {
      await paymentProvider.refund(order.code, clientRefundAmount);
    }
    if (providerPayAmount.greaterThan(0)) {
      await paymentProvider.releaseFunds(order.code, providerPayAmount);
    }

    const refundStatus = clientRefundAmount.equals(0)
      ? "NONE"
      : clientRefundAmount.equals(order.orderAmount)
        ? "FULL"
        : "PARTIAL";

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: order.id },
        data: {
          status: "COMPLETED",
          paymentStatus: clientRefundAmount.greaterThan(0) ? "PARTIALLY_REFUNDED" : "RELEASED",
          payoutStatus: providerPayAmount.greaterThan(0) ? "AVAILABLE" : "NOT_ELIGIBLE",
          refundStatus,
          providerAmount: providerPayAmount,
        },
      });

      await tx.dispute.update({
        where: { id },
        data: {
          status: "RESOLVED",
          resolution: body.resolution,
          resolutionNote: body.note,
          clientRefundAmount,
          providerPayAmount,
          resolvedById: admin.id,
          resolvedAt: new Date(),
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: "COMPLETED",
          changedById: admin.id,
          note: `Спор разрешён: ${body.resolution}`,
        },
      });

      return updated;
    });

    await logAudit({
      actorId: admin.id,
      action: `dispute.resolve.${body.resolution}`,
      entityType: "Dispute",
      entityId: id,
      before,
      after: {
        status: "COMPLETED",
        clientRefundAmount: clientRefundAmount.toString(),
        providerPayAmount: providerPayAmount.toString(),
      },
    });

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes("не равна сумме заказа")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return apiErrorResponse(error);
  }
}
