import Link from "next/link";
import { prisma } from "../../../lib/db";
import { getCurrentUser } from "../../../lib/session";
import { OrderStatusBadge } from "../../../components/OrderStatusBadge";

export const dynamic = "force-dynamic";

export default async function ProviderOrdersPage() {
  const user = await getCurrentUser();
  if (!user?.provider) return null;

  const orders = await prisma.order.findMany({
    where: { providerId: user.provider.id },
    include: { service: { select: { name: true } }, client: { select: { name: true, phone: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-cream">Заказы</h1>
      {orders.length === 0 ? (
        <p className="mt-6 text-sage-100">Заказов пока нет.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/dashboard/orders/${o.id}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-cream/10 bg-surface-alt p-4 hover:border-accent/30 transition-colors"
            >
              <div>
                <p className="font-bold text-cream">{o.code} · {o.service.name}</p>
                <p className="text-sm text-sage-100">{o.client.name} · {o.scheduledDate} {o.scheduledTime}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-extrabold text-cream">${o.providerAmount.toString()}</span>
                <OrderStatusBadge status={o.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
