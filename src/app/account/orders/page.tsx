import Link from "next/link";
import { prisma } from "../../../lib/db";
import { getCurrentUser } from "../../../lib/session";
import { OrderStatusBadge } from "../../../components/OrderStatusBadge";

export const dynamic = "force-dynamic";

export default async function ClientOrdersPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const orders = await prisma.order.findMany({
    where: { clientId: user.id },
    include: { service: { select: { name: true } }, provider: { select: { businessName: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-cream">Мои заказы</h1>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-cream/15 p-12 text-center text-cream/90">
          Заказов пока нет — <Link href="/providers" className="underline">найдите исполнителя</Link>.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/account/orders/${o.id}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-cream/10 bg-surface-alt p-4 hover:border-accent/30 transition-colors"
            >
              <div>
                <p className="font-bold text-cream">{o.code} · {o.service.name}</p>
                <p className="text-sm text-sage-100">{o.provider.businessName} · {o.scheduledDate} {o.scheduledTime}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-extrabold text-cream">${o.orderAmount.toString()}</span>
                <OrderStatusBadge status={o.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
