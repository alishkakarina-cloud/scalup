import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, requireRole, apiErrorResponse } from "@/lib/api-auth";

/** Полный список исполнителей для админа — без фильтра "есть активные услуги". */
export async function GET() {
  try {
    requireRole(await requireUser(), ["ADMIN"]);
    const providers = await prisma.provider.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, businessName: true, city: true, verified: true, ratingAvg: true },
    });
    return NextResponse.json({ providers });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
