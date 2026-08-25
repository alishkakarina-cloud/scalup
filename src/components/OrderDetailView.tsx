import { OrderStatusBadge, orderStatusLabel } from "./OrderStatusBadge";
import { OrderActions } from "./OrderActions";

interface OrderDetailViewProps {
  order: {
    id: number;
    code: string;
    status: string;
    scheduledDate: string;
    scheduledTime: string;
    address: string;
    comment: string | null;
    orderAmount: { toString(): string };
    commissionAmount: { toString(): string };
    providerAmount: { toString(): string };
    paymentStatus: string;
    payoutStatus: string;
    refundStatus: string;
    service: { name: string };
    provider: { businessName: string };
    client: { name: string; phone: string | null };
    vehicle: { brand: string; model: string } | null;
    dispute: { id: string } | null;
    review: { id: string } | null;
    statusHistory: { id: string; status: string; createdAt: Date; note: string | null; changedBy: { name: string; role: string } }[];
  };
  viewerRole: "CLIENT" | "PROVIDER" | "ADMIN";
}

export function OrderDetailView({ order, viewerRole }: OrderDetailViewProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-extrabold tracking-tight text-cream">{order.code}</h1>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-cream/10 bg-surface-alt p-5">
          <p className="text-sm font-bold text-cream">Услуга</p>
          <p className="mt-1 text-sm text-sage-100">{order.service.name}</p>
          <p className="mt-3 text-sm font-bold text-cream">Исполнитель</p>
          <p className="mt-1 text-sm text-sage-100">{order.provider.businessName}</p>
          <p className="mt-3 text-sm font-bold text-cream">Клиент</p>
          <p className="mt-1 text-sm text-sage-100">{order.client.name}{order.client.phone ? ` · ${order.client.phone}` : ""}</p>
          {order.vehicle && (
            <>
              <p className="mt-3 text-sm font-bold text-cream">Автомобиль</p>
              <p className="mt-1 text-sm text-sage-100">{order.vehicle.brand} {order.vehicle.model}</p>
            </>
          )}
          <p className="mt-3 text-sm font-bold text-cream">Дата и адрес</p>
          <p className="mt-1 text-sm text-sage-100">{order.scheduledDate} {order.scheduledTime} · {order.address}</p>
          {order.comment && (
            <>
              <p className="mt-3 text-sm font-bold text-cream">Комментарий</p>
              <p className="mt-1 text-sm text-sage-100">{order.comment}</p>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-cream/10 bg-surface-alt p-5">
          <p className="text-sm font-bold text-cream">Финансы</p>
          <div className="mt-2 space-y-1.5 text-sm text-sage-100">
            <p className="flex justify-between"><span>Сумма заказа</span><span className="font-extrabold text-cream">${order.orderAmount.toString()}</span></p>
            <p className="flex justify-between"><span>Комиссия SCALUP</span><span>${order.commissionAmount.toString()}</span></p>
            <p className="flex justify-between"><span>К выплате исполнителю</span><span className="font-extrabold text-cream">${order.providerAmount.toString()}</span></p>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="rounded-full border border-cream/10 px-2 py-0.5 text-[11px] text-sage-100">Оплата: {order.paymentStatus}</span>
            <span className="rounded-full border border-cream/10 px-2 py-0.5 text-[11px] text-sage-100">Выплата: {order.payoutStatus}</span>
            {order.refundStatus !== "NONE" && (
              <span className="rounded-full border border-cream/10 px-2 py-0.5 text-[11px] text-sage-100">Возврат: {order.refundStatus}</span>
            )}
          </div>

          <div className="mt-4">
            <OrderActions
              orderId={order.id}
              status={order.status}
              viewerRole={viewerRole}
              hasDispute={!!order.dispute}
              disputeId={order.dispute?.id}
              hasReview={!!order.review}
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-extrabold tracking-tight text-cream">История статусов</h2>
        <div className="mt-3 space-y-2">
          {order.statusHistory.map((h) => (
            <div key={h.id} className="flex items-start justify-between gap-4 rounded-xl border border-cream/10 bg-surface-alt px-4 py-3">
              <div>
                <p className="text-sm font-bold text-cream">{orderStatusLabel(h.status)}</p>
                {h.note && <p className="text-xs text-sage-100 mt-0.5">{h.note}</p>}
                <p className="text-xs text-sage-100 mt-0.5">{h.changedBy.name} ({h.changedBy.role})</p>
              </div>
              <span className="text-xs text-cream/75 shrink-0">{new Date(h.createdAt).toLocaleString("ru-RU")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
