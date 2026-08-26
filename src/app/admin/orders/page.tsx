import Link from "next/link";
import { prisma } from "../../../lib/db";
import { OrderStatusBadge } from "../../../components/OrderStatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { service: { select: { name: true } }, provider: { select: { businessName: true } }, client: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-cream">Все заказы</h1>
      <div className="mt-6 space-y-2">
        {orders.map((o) => (
          <Link
            key={o.id}
            href={`/account/orders/${o.id}`}
            className="flex items-center justify-between gap-4 rounded-xl border border-cream/10 bg-surface-alt px-4 py-3 hover:border-accent/30 transition-colors"
          >
            <div>
              <p className="font-bold text-cream text-sm">{o.code} · {o.service.name}</p>
              <p className="text-xs text-sage-100">{o.client.name} → {o.provider.businessName}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm font-extrabold text-cream">${o.orderAmount.toString()}</span>
              <OrderStatusBadge status={o.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
