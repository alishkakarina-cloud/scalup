import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, requireRole, apiErrorResponse } from "@/lib/api-auth";

export async function GET() {
  try {
    requireRole(await requireUser(), ["ADMIN"]);

    const [totalOrders, activeDisputes, pendingPayouts, totalProviders, totalClients, commissionAgg] =
      await Promise.all([
        prisma.order.count(),
        prisma.dispute.count({ where: { status: "OPEN" } }),
        prisma.payout.count({ where: { status: "PENDING" } }),
        prisma.user.count({ where: { role: "PROVIDER" } }),
        prisma.user.count({ where: { role: "CLIENT" } }),
        prisma.order.aggregate({
          where: { status: "COMPLETED" },
          _sum: { commissionAmount: true, orderAmount: true },
        }),
      ]);

    return NextResponse.json({
      totalOrders,
      activeDisputes,
      pendingPayouts,
      totalProviders,
      totalClients,
      totalCommission: commissionAgg._sum.commissionAmount?.toString() ?? "0",
      totalRevenue: commissionAgg._sum.orderAmount?.toString() ?? "0",
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
