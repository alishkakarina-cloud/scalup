import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, requireRole, apiErrorResponse } from "@/lib/api-auth";

/** Очередь споров — только админ (у клиента/исполнителя есть спор внутри их заказа). */
export async function GET() {
  try {
    requireRole(await requireUser(), ["ADMIN"]);
    const disputes = await prisma.dispute.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        order: {
          include: {
            client: { select: { name: true } },
            provider: { select: { businessName: true } },
          },
        },
        openedBy: { select: { name: true, role: true } },
      },
    });
    return NextResponse.json({ disputes });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
