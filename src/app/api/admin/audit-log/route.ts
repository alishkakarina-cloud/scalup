import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, requireRole, apiErrorResponse } from "@/lib/api-auth";

export async function GET(req: Request) {
  try {
    requireRole(await requireUser(), ["ADMIN"]);
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");

    const entries = await prisma.auditLog.findMany({
      take: 50,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { createdAt: "desc" },
      include: { actor: { select: { name: true, role: true, email: true } } },
    });

    return NextResponse.json({ entries, nextCursor: entries.at(-1)?.id ?? null });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
