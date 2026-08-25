import Link from "next/link";
import { requireRole } from "../../../lib/api-auth";
import { requireUser } from "../../../lib/api-auth";
import { prisma } from "../../../lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDisputesPage() {
  requireRole(await requireUser(), ["ADMIN"]);

  const disputes = await prisma.dispute.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      order: { include: { client: { select: { name: true } }, provider: { select: { businessName: true } } } },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-cream">Споры</h1>
      <div className="mt-6 space-y-2">
        {disputes.length === 0 ? (
          <p className="text-sage-100">Споров нет.</p>
        ) : (
          disputes.map((d) => (
            <Link
              key={d.id}
              href={`/disputes/${d.id}`}
              className="flex items-center justify-between gap-4 rounded-xl border border-cream/10 bg-surface-alt px-4 py-3 hover:border-accent/30 transition-colors"
            >
              <div>
                <p className="font-bold text-cream text-sm">{d.order.code} · {d.reason}</p>
                <p className="text-xs text-sage-100">{d.order.client.name} vs {d.order.provider.businessName}</p>
              </div>
              <span className="rounded-full border border-cream/15 px-2.5 py-1 text-[11px] font-bold text-cream/90 shrink-0">
                {d.status === "OPEN" ? "Открыт" : "Решён"}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
