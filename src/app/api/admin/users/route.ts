import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, requireRole, apiErrorResponse } from "@/lib/api-auth";

export async function GET() {
  try {
    requireRole(await requireUser(), ["ADMIN"]);
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        city: true,
        createdAt: true,
        provider: { select: { businessName: true, verified: true } },
      },
      take: 200,
    });
    return NextResponse.json({ users });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
