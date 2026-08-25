import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser, requireRole, apiErrorResponse, ApiError } from "@/lib/api-auth";
import { logAudit } from "@/lib/audit";

const schema = z.object({ note: z.string().trim().max(500).optional() });

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = requireRole(await requireUser(), ["ADMIN"]);
    const { id } = await params;
    const body = schema.parse(await req.json().catch(() => ({})));

    const payout = await prisma.payout.findUnique({ where: { id } });
    if (!payout) throw new ApiError(404, "Заявка на выплату не найдена");
    if (payout.status !== "PENDING") throw new ApiError(409, `Заявка уже в статусе ${payout.status}`);

    const updated = await prisma.$transaction(async (tx) => {
      const p = await tx.payout.update({
        where: { id },
        data: { status: "REJECTED", processedAt: new Date(), processedById: admin.id },
      });
      // Возвращаем заказы обратно в доступный баланс — деньги никуда не делись.
      // payoutId НЕ обнуляем: при новой заявке он всё равно будет перезаписан
      // (см. /api/payouts/request), а до этого момента ссылка на отклонённую
      // заявку нужна для истории на странице админки.
      await tx.order.updateMany({ where: { payoutId: id }, data: { payoutStatus: "AVAILABLE" } });
      return p;
    });

    await logAudit({
      actorId: admin.id,
      action: "payout.reject",
      entityType: "Payout",
      entityId: id,
      before: { status: "PENDING" },
      after: { status: "REJECTED", note: body.note },
    });

    return NextResponse.json({ payout: updated });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
