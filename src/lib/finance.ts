import "server-only";
import { Prisma } from "@prisma/client";

/**
 * ФИНАНСОВОЕ ЯДРО — единственное место в приложении, где считается комиссия.
 *
 * КРИТИЧНО: этот модуль импортируется только серверным кодом (route handlers).
 * Frontend не должен и не может передать сюда готовую сумму комиссии — она
 * всегда выводится заново из цены услуги, которая сама берётся из БД
 * (Service.price), а не из тела запроса клиента.
 */

export const DEFAULT_COMMISSION_PERCENT = new Prisma.Decimal(10);
export const MIN_PAYOUT_AMOUNT = new Prisma.Decimal(500);

export interface OrderFinancials {
  orderAmount: Prisma.Decimal;
  commissionPercent: Prisma.Decimal;
  commissionAmount: Prisma.Decimal;
  providerAmount: Prisma.Decimal;
}

function round2(value: Prisma.Decimal): Prisma.Decimal {
  return value.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
}

export function computeOrderFinancials(
  orderAmount: Prisma.Decimal | number,
  commissionPercent: Prisma.Decimal | number = DEFAULT_COMMISSION_PERCENT
): OrderFinancials {
  const amount = new Prisma.Decimal(orderAmount);
  const percent = new Prisma.Decimal(commissionPercent);

  if (amount.lessThanOrEqualTo(0)) {
    throw new Error("Сумма заказа должна быть положительной");
  }

  const commissionAmount = round2(amount.mul(percent).div(100));
  const providerAmount = round2(amount.sub(commissionAmount));

  return {
    orderAmount: round2(amount),
    commissionPercent: percent,
    commissionAmount,
    providerAmount,
  };
}

/**
 * Пересчитывает сумму сплита при разрешении спора и проверяет, что она
 * сходится с суммой заказа — админ не может "потерять" или "создать" деньги.
 */
export function validateSplit(
  orderAmount: Prisma.Decimal,
  clientRefundAmount: Prisma.Decimal,
  providerPayAmount: Prisma.Decimal
) {
  const total = round2(clientRefundAmount.add(providerPayAmount));
  if (!total.equals(round2(orderAmount))) {
    throw new Error(
      `Сумма возврата клиенту (${clientRefundAmount}) и выплаты исполнителю (${providerPayAmount}) не равна сумме заказа (${orderAmount})`
    );
  }
}
