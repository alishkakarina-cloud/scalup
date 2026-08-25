import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser, requireRole, apiErrorResponse, ApiError } from "@/lib/api-auth";

const schema = z.object({
  orderId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  text: z.string().trim().max(2000).optional(),
});

export async function POST(req: Request) {
  try {
    const user = requireRole(await requireUser(), ["CLIENT"]);
    const body = schema.parse(await req.json());

    const order = await prisma.order.findUnique({ where: { id: body.orderId }, include: { review: true } });
    if (!order) throw new ApiError(404, "Заказ не найден");
    if (order.clientId !== user.id) throw new ApiError(403, "Это не ваш заказ");
    if (order.status !== "COMPLETED") throw new ApiError(409, "Оставить отзыв можно только после завершения заказа");
    if (order.review) throw new ApiError(409, "Отзыв по этому заказу уже оставлен");

    const review = await prisma.$transaction(async (tx) => {
      const created = await tx.review.create({
        data: {
          orderId: order.id,
          clientId: user.id,
          providerId: order.providerId,
          rating: body.rating,
          text: body.text,
        },
      });

      const agg = await tx.review.aggregate({
        where: { providerId: order.providerId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await tx.provider.update({
        where: { id: order.providerId },
        data: { ratingAvg: agg._avg.rating ?? 0, ratingCount: agg._count.rating },
      });

      return created;
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
    }
    return apiErrorResponse(error);
  }
}
