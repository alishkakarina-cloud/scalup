import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, apiErrorResponse, ApiError } from "@/lib/api-auth";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const dispute = await prisma.dispute.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            service: { select: { name: true } },
            client: { select: { name: true } },
            provider: { select: { businessName: true, userId: true } },
          },
        },
        openedBy: { select: { name: true, role: true } },
        messages: { orderBy: { createdAt: "asc" }, include: { author: { select: { name: true, role: true } } } },
      },
    });
    if (!dispute) throw new ApiError(404, "Спор не найден");

    const isParty =
      user.role === "ADMIN" ||
      dispute.order.clientId === user.id ||
      dispute.order.provider.userId === user.id;
    if (!isParty) throw new ApiError(403, "У вас нет доступа к этому спору");

    return NextResponse.json({ dispute });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
