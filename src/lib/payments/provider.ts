import type { Prisma } from "@prisma/client";

/**
 * Интерфейс платёжного провайдера. Бизнес-логика заказов/выплат работает
 * ТОЛЬКО через этот интерфейс и никогда не обращается к конкретному
 * провайдеру напрямую — чтобы заменить провайдера, достаточно написать
 * новый класс, реализующий этот интерфейс, и подставить его в
 * `src/lib/payments/index.ts`.
 *
 * Сейчас подключена только MockPaymentProvider (см. mock.ts) — реального
 * движения денег нет. Для реального провайдера (например, локального для
 * Кыргызстана) нужно реализовать этот же интерфейс с настоящими вызовами API.
 */
export interface PaymentResult {
  success: boolean;
  reference: string;
  raw?: unknown;
}

export interface PaymentProvider {
  /** Заморозить сумму заказа на стороне клиента (эскроу-холд). */
  holdFunds(orderCode: string, amount: Prisma.Decimal): Promise<PaymentResult>;
  /** Перевести замороженную сумму исполнителю после подтверждения клиентом. */
  releaseFunds(orderCode: string, amount: Prisma.Decimal): Promise<PaymentResult>;
  /** Вернуть (полностью или частично) сумму клиенту. */
  refund(orderCode: string, amount: Prisma.Decimal): Promise<PaymentResult>;
  /** Выплатить исполнителю по одобренной заявке на вывод средств. */
  payout(payoutId: string, amount: Prisma.Decimal, requisites: string): Promise<PaymentResult>;
}
