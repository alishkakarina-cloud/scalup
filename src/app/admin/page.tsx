import { prisma } from "../../lib/db";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [totalOrders, activeDisputes, pendingPayouts, totalProviders, totalClients, commissionAgg] = await Promise.all([
    prisma.order.count(),
    prisma.dispute.count({ where: { status: "OPEN" } }),
    prisma.payout.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { role: "PROVIDER" } }),
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.order.aggregate({ where: { status: "COMPLETED" }, _sum: { commissionAmount: true, orderAmount: true } }),
  ]);

  const cards = [
    { label: "Всего заказов", value: totalOrders },
    { label: "Открытых споров", value: activeDisputes },
    { label: "Заявок на выплату", value: pendingPayouts },
    { label: "Исполнителей", value: totalProviders },
    { label: "Клиентов", value: totalClients },
    { label: "Комиссия SCALUP заработана", value: `$${commissionAgg._sum.commissionAmount?.toString() ?? "0"}` },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-cream">Обзор</h1>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-cream/10 bg-surface-alt p-5">
            <p className="text-sm text-sage-100">{c.label}</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight text-cream">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
