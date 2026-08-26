import { prisma } from "../../lib/db";
import { getCurrentUser } from "../../lib/session";

export const dynamic = "force-dynamic";

export default async function DashboardHomePage() {
  const user = await getCurrentUser();
  if (!user?.provider) return null;

  const [todayOrders, activeOrders, avgRating] = await Promise.all([
    prisma.order.count({
      where: { providerId: user.provider.id, scheduledDate: new Date().toISOString().slice(0, 10) },
    }),
    prisma.order.count({
      where: {
        providerId: user.provider.id,
        status: { in: ["NEW", "CONFIRMED", "PROVIDER_EN_ROUTE", "WORK_STARTED", "AWAITING_CLIENT_CONFIRMATION"] },
      },
    }),
    prisma.provider.findUnique({ where: { id: user.provider.id }, select: { ratingAvg: true, ratingCount: true } }),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-cream">Здравствуйте, {user.name}</h1>
      <p className="mt-1 text-cream/90">{user.provider.businessName}</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-cream/10 bg-surface-alt p-5">
          <p className="text-sm text-sage-100">Заказы сегодня</p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-cream">{todayOrders}</p>
        </div>
        <div className="rounded-2xl border border-cream/10 bg-surface-alt p-5">
          <p className="text-sm text-sage-100">Активные заказы</p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-cream">{activeOrders}</p>
        </div>
        <div className="rounded-2xl border border-cream/10 bg-surface-alt p-5">
          <p className="text-sm text-sage-100">Рейтинг</p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-cream">
            {avgRating?.ratingAvg.toFixed(1) ?? "0.0"} <span className="text-sm text-sage-100">({avgRating?.ratingCount ?? 0})</span>
          </p>
        </div>
      </div>
    </div>
  );
}
