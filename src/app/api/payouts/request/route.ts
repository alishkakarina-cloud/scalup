import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireUser, requireRole, apiErrorResponse, ApiError } from "@/lib/api-auth";
import { MIN_PAYOUT_AMOUNT } from "@/lib/finance";

const schema = z.object({
  requisites: z.string().trim().min(4).max(300),
});

/**
 * Заявка на вывод забирает ВЕСЬ текущий доступный баланс (без частичного
 * вывода — см. README) и сумма всегда пересчитывается сервером из заказов
 * в БД, а не берётся из тела запроса.
 *
 * Защита от гонки: сумма и захват заказов происходят в одной транзакции.
 * `updateMany` с условием `payoutStatus: AVAILABLE` в WHERE не даст двум
 * параллельным заявкам захватить одни и те же заказы — Postgres
 * сериализует конкурентные UPDATE на одних строках блокировкой на уровне
 * строк, второй запрос увидит уже нулевой доступный баланс.
 */
export async function POST(req: Request) {
  try {
    const user = requireRole(await requireUser(), ["PROVIDER"]);
    if (!user.provider) throw new ApiError(400, "Профиль исполнителя не найден");
    const body = schema.parse(await req.json());
    const providerId = user.provider.id;

    const payout = await prisma.$transaction(async (tx) => {
      const availableOrders = await tx.order.findMany({
        where: { providerId, payoutStatus: "AVAILABLE" },
        select: { id: true, providerAmount: true },
      });

      const total = availableOrders.reduce((acc, o) => acc.add(o.providerAmount), new Prisma.Decimal(0));

      if (total.lessThan(MIN_PAYOUT_AMOUNT)) {
        throw new ApiError(
          400,
          `Минимальная сумма вывода — ${MIN_PAYOUT_AMOUNT} сом, сейчас доступно: ${total.toString()} сом`
        );
      }

      const created = await tx.payout.create({
        data: { providerId, amount: total, requisites: body.requisites, status: "PENDING" },
      });

      const claimed = await tx.order.updateMany({
        where: { id: { in: availableOrders.map((o) => o.id) }, payoutStatus: "AVAILABLE" },
        data: { payoutStatus: "REQUESTED", payoutId: created.id },
      });

      // Если под конкурентной гонкой захватили меньше заказов, чем ожидали —
      // откатываем: лучше явная ошибка, чем платёж на неверную сумму.
      if (claimed.count !== availableOrders.length) {
        throw new ApiError(409, "Баланс изменился во время оформления заявки, попробуйте снова");
      }

      return created;
    });

    return NextResponse.json({ payout }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Укажите корректные реквизиты" }, { status: 400 });
    }
    return apiErrorResponse(error);
  }
}
