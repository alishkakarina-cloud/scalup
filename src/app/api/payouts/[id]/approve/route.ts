import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, requireRole, apiErrorResponse, ApiError } from "@/lib/api-auth";
import { paymentProvider } from "@/lib/payments";
import { logAudit } from "@/lib/audit";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = requireRole(await requireUser(), ["ADMIN"]);
    const { id } = await params;

    const payout = await prisma.payout.findUnique({ where: { id } });
    if (!payout) throw new ApiError(404, "Заявка на выплату не найдена");
    if (payout.status !== "PENDING") throw new ApiError(409, `Заявка уже в статусе ${payout.status}`);

    const result = await paymentProvider.payout(payout.id, payout.amount, payout.requisites);
    if (!result.success) throw new ApiError(502, "Платёжный провайдер отклонил выплату");

    const updated = await prisma.$transaction(async (tx) => {
      const p = await tx.payout.update({
        where: { id },
        data: { status: "PAID", processedAt: new Date(), processedById: admin.id },
      });
      await tx.order.updateMany({ where: { payoutId: id }, data: { payoutStatus: "PAID" } });
      return p;
    });

    await logAudit({
      actorId: admin.id,
      action: "payout.approve",
      entityType: "Payout",
      entityId: id,
      before: { status: "PENDING" },
      after: { status: "PAID", reference: result.reference },
    });

    return NextResponse.json({ payout: updated });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
