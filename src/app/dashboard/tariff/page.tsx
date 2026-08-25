import { DEFAULT_COMMISSION_PERCENT } from "../../../lib/finance";

export default function TariffPage() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-cream">Тариф</h1>
      <div className="mt-6 max-w-md rounded-2xl border border-cream/10 bg-surface-alt p-6">
        <p className="text-sm text-sage-100">Комиссия SCALUP с каждого заказа</p>
        <p className="mt-1 text-4xl font-extrabold tracking-tight text-cream">{DEFAULT_COMMISSION_PERCENT.toString()}%</p>
        <p className="mt-4 text-sm text-sage-100">
          Например, заказ на $50 → комиссия ${(50 * Number(DEFAULT_COMMISSION_PERCENT)) / 100} → вы получаете $
          {50 - (50 * Number(DEFAULT_COMMISSION_PERCENT)) / 100}.
        </p>
        <p className="mt-4 text-xs text-cream/75">
          Процент фиксирован и рассчитывается сервером на каждом заказе — изменить его через интерфейс нельзя.
        </p>
      </div>
    </div>
  );
}
