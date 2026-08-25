import "server-only";
import type { PaymentProvider } from "./provider";
import { MockPaymentProvider } from "./mock";

/**
 * Единая точка получения активного платёжного провайдера. Чтобы подключить
 * реального провайдера — реализовать PaymentProvider (см. provider.ts) и
 * поменять инстанс здесь. Больше нигде в коде провайдер не импортируется
 * напрямую.
 */
export const paymentProvider: PaymentProvider = new MockPaymentProvider();
