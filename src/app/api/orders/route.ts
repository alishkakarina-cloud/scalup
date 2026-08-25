import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser, requireRole, apiErrorResponse, ApiError } from "@/lib/api-auth";
import { computeOrderFinancials } from "@/lib/finance";
import { formatOrderCode } from "@/lib/orderCode";
import { paymentProvider } from "@/lib/payments";

// Клиент присылает ТОЛЬКО идентификаторы выбора (serviceId, vehicleId,
// дата/время/адрес). Цену и сумму заказа сервер вычисляет заново из
// Service.price в БД — сумма из тела запроса, если она там окажется,
// игнорируется и нигде не читается.
const schema = z.object({
  serviceId: z.string().min(1),
  vehicleId: z.string().min(1).optional(),
  scheduledDate: z.string().min(1),
  scheduledTime: z.string().min(1),
  address: z.string().trim().min(3).max(300),
  comment: z.string().trim().max(1000).optional(),
});

export async function POST(req: Request) {
  try {
    const user = requireRole(await requireUser(), ["CLIENT"]);
    const body = schema.parse(await req.json());

    const service = await prisma.service.findUnique({ where: { id: body.serviceId } });
    if (!service || !service.active) throw new ApiError(404, "Услуга не найдена или недоступна");

    if (body.vehicleId) {
      const vehicle = await prisma.vehicle.findUnique({ where: { id: body.vehicleId } });
      if (!vehicle || vehicle.userId !== user.id) {
        throw new ApiError(403, "Этот автомобиль вам не принадлежит");
      }
    }

    // orderAmount выводится ИСКЛЮЧИТЕЛЬНО из текущей цены услуги в БД.
    const financials = computeOrderFinancials(service.price);

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          code: "PENDING", // временное значение, заменим кодом на основе PK ниже
          clientId: user.id,
          providerId: service.providerId,
          serviceId: service.id,
          vehicleId: body.vehicleId,
          scheduledDate: body.scheduledDate,
          scheduledTime: body.scheduledTime,
          address: body.address,
          comment: body.comment,
          orderAmount: financials.orderAmount,
          commissionPercent: financials.commissionPercent,
          commissionAmount: financials.commissionAmount,
          providerAmount: financials.providerAmount,
          status: "NEW",
        },
      });

      const withCode = await tx.order.update({
        where: { id: created.id },
        data: { code: formatOrderCode(created.id) },
      });

      await tx.orderStatusHistory.create({
        data: { orderId: created.id, status: "NEW", changedById: user.id, note: "Заказ создан" },
      });

      return withCode;
    });

    // Заморозка средств клиента (mock) — учебный эскроу-холд, реальных денег нет.
    const hold = await paymentProvider.holdFunds(order.code, order.orderAmount);
    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: hold.success ? "HELD" : "PENDING" },
    });

    return NextResponse.json({ order: updated }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Некорректные данные" }, { status: 400 });
    }
    return apiErrorResponse(error);
  }
}

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where =
      user.role === "ADMIN"
        ? {}
        : user.role === "PROVIDER"
          ? { providerId: user.provider?.id ?? "__none__" }
          : { clientId: user.id };

    const orders = await prisma.order.findMany({
      where: { ...where, ...(status ? { status: status as never } : {}) },
      include: {
        service: { select: { name: true, category: true } },
        provider: { select: { businessName: true } },
        client: { select: { name: true, phone: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ orders });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
