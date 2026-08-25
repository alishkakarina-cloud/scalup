import "server-only";
import type { Prisma } from "@prisma/client";
import type { PaymentProvider, PaymentResult } from "./provider";

/**
 * Заглушка платёжного провайдера для MVP-этапа: реального движения денег
 * нет, только имитация успеха с уникальной ссылкой операции. Заменяется на
 * реальный провайдер без изменений в бизнес-логике заказов/выплат — вся
 * логика обращается только к интерфейсу PaymentProvider.
 */
export class MockPaymentProvider implements PaymentProvider {
  private ref(kind: string) {
    return `mock_${kind}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }

  async holdFunds(orderCode: string, amount: Prisma.Decimal): Promise<PaymentResult> {
    return { success: true, reference: this.ref("hold"), raw: { orderCode, amount: amount.toString() } };
  }

  async releaseFunds(orderCode: string, amount: Prisma.Decimal): Promise<PaymentResult> {
    return { success: true, reference: this.ref("release"), raw: { orderCode, amount: amount.toString() } };
  }

  async refund(orderCode: string, amount: Prisma.Decimal): Promise<PaymentResult> {
    return { success: true, reference: this.ref("refund"), raw: { orderCode, amount: amount.toString() } };
  }

  async payout(payoutId: string, amount: Prisma.Decimal, requisites: string): Promise<PaymentResult> {
    return { success: true, reference: this.ref("payout"), raw: { payoutId, amount: amount.toString(), requisites } };
  }
}
