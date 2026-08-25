import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, apiErrorResponse, ApiError } from "@/lib/api-auth";

export async function GET() {
  try {
    const user = await requireUser();

    const where =
      user.role === "ADMIN"
        ? {}
        : user.role === "PROVIDER"
          ? { providerId: user.provider?.id ?? "__none__" }
          : (() => {
              throw new ApiError(403, "Только исполнитель или админ могут смотреть выплаты");
            })();

    const payouts = await prisma.payout.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { provider: { select: { businessName: true } }, orders: { select: { id: true, code: true } } },
    });

    return NextResponse.json({ payouts });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
