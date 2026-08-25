import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser, apiErrorResponse, ApiError } from "@/lib/api-auth";

const schema = z.object({
  text: z.string().trim().min(1).max(3000),
  evidenceUrls: z.array(z.string().url()).max(10).default([]),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const body = schema.parse(await req.json());

    const dispute = await prisma.dispute.findUnique({ where: { id }, include: { order: true } });
    if (!dispute) throw new ApiError(404, "Спор не найден");

    const isParty =
      user.role === "ADMIN" ||
      dispute.order.clientId === user.id ||
      dispute.order.providerId === user.provider?.id;
    if (!isParty) throw new ApiError(403, "У вас нет доступа к этому спору");
    if (dispute.status === "RESOLVED") throw new ApiError(409, "Спор уже закрыт");

    const message = await prisma.disputeMessage.create({
      data: { disputeId: id, authorId: user.id, text: body.text, evidenceUrls: body.evidenceUrls },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
    }
    return apiErrorResponse(error);
  }
}
