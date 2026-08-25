import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser, apiErrorResponse, ApiError } from "@/lib/api-auth";

const schema = z.object({
  reason: z.string().trim().min(3).max(200),
  description: z.string().trim().min(10).max(3000),
  evidenceUrls: z.array(z.string().url()).max(10).default([]),
});

const DISPUTABLE_STATUSES = ["WORK_STARTED", "WORK_COMPLETED", "AWAITING_CLIENT_CONFIRMATION", "PAYOUT", "COMPLETED"];

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const orderId = Number(id);
    const body = schema.parse(await req.json());

    const order = await prisma.order.findUnique({ where: { id: orderId }, include: { dispute: true } });
    if (!order) throw new ApiError(404, "Заказ не найден");

    const isParty = order.clientId === user.id || order.providerId === user.provider?.id;
    if (!isParty) throw new ApiError(403, "Открыть спор может только клиент или исполнитель по этому заказу");
    if (order.dispute) throw new ApiError(409, "По этому заказу уже открыт спор");
    if (!DISPUTABLE_STATUSES.includes(order.status)) {
      throw new ApiError(409, `Спор нельзя открыть на статусе ${order.status}`);
    }
    if (order.payoutStatus === "PAID") {
      // Деньги уже фактически выведены исполнителю — автоматическая блокировка
      // здесь ничего не заблокирует. Такой случай MVP не покрывает и требует
      // ручного разбора вне системы (см. README, "Известные упрощения").
      throw new ApiError(
        409,
        "По этому заказу выплата уже произведена — открытие спора через систему сейчас недоступно, обратитесь в поддержку напрямую"
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const dispute = await tx.dispute.create({
        data: {
          orderId,
          openedById: user.id,
          reason: body.reason,
          description: body.description,
          evidenceUrls: body.evidenceUrls,
        },
      });

      // Автоматическая блокировка выплаты по заказу — исполнитель не может
      // получить эти деньги, пока админ не разрешит спор.
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: "DISPUTED",
          payoutStatus: order.payoutStatus === "AVAILABLE" ? "NOT_ELIGIBLE" : order.payoutStatus,
        },
      });
      await tx.orderStatusHistory.create({
        data: { orderId, status: "DISPUTED", changedById: user.id, note: body.reason },
      });

      return dispute;
    });

    return NextResponse.json({ dispute: result }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Некорректные данные" }, { status: 400 });
    }
    return apiErrorResponse(error);
  }
}
