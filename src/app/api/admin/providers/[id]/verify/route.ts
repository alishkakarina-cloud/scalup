import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser, requireRole, apiErrorResponse, ApiError } from "@/lib/api-auth";
import { logAudit } from "@/lib/audit";

const schema = z.object({ verified: z.boolean() });

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = requireRole(await requireUser(), ["ADMIN"]);
    const { id } = await params;
    const body = schema.parse(await req.json());

    const provider = await prisma.provider.findUnique({ where: { id } });
    if (!provider) throw new ApiError(404, "Исполнитель не найден");

    const updated = await prisma.provider.update({ where: { id }, data: { verified: body.verified } });

    await logAudit({
      actorId: admin.id,
      action: body.verified ? "provider.verify" : "provider.unverify",
      entityType: "Provider",
      entityId: id,
      before: { verified: provider.verified },
      after: { verified: body.verified },
    });

    return NextResponse.json({ provider: updated });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
