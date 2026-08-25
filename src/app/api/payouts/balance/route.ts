import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireUser, requireRole, apiErrorResponse, ApiError } from "@/lib/api-auth";

function sum(values: Prisma.Decimal[]) {
  return values.reduce((acc, v) => acc.add(v), new Prisma.Decimal(0));
}

/** Три статьи баланса, как требует ТЗ: Доступно / В обработке / Выплачено. */
export async function GET() {
  try {
    const user = requireRole(await requireUser(), ["PROVIDER"]);
    if (!user.provider) throw new ApiError(400, "Профиль исполнителя не найден");

    const orders = await prisma.order.findMany({
      where: { providerId: user.provider.id, payoutStatus: { in: ["AVAILABLE", "REQUESTED", "PAID"] } },
      select: { providerAmount: true, payoutStatus: true, commissionAmount: true, orderAmount: true },
    });

    const available = sum(orders.filter((o) => o.payoutStatus === "AVAILABLE").map((o) => o.providerAmount));
    const inProcessing = sum(orders.filter((o) => o.payoutStatus === "REQUESTED").map((o) => o.providerAmount));
    const paid = sum(orders.filter((o) => o.payoutStatus === "PAID").map((o) => o.providerAmount));

    return NextResponse.json({
      available: available.toString(),
      inProcessing: inProcessing.toString(),
      paid: paid.toString(),
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
