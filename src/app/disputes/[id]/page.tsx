import { notFound } from "next/navigation";
import { prisma } from "../../../lib/db";
import { getCurrentUser } from "../../../lib/session";
import { DisputeThread } from "../../../components/DisputeThread";

export const dynamic = "force-dynamic";

const RESOLUTION_LABEL: Record<string, string> = {
  FULL_REFUND_CLIENT: "Возврат 100% клиенту",
  FULL_PAY_PROVIDER: "Выплата исполнителю полностью",
  PARTIAL_REFUND: "Частичный возврат",
  SPLIT: "Разделение суммы",
};

export default async function DisputeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return null;

  const dispute = await prisma.dispute.findUnique({
    where: { id },
    include: {
      order: {
        include: {
          service: { select: { name: true } },
          client: { select: { id: true, name: true } },
          provider: { select: { businessName: true, userId: true } },
        },
      },
      openedBy: { select: { name: true, role: true } },
      messages: { orderBy: { createdAt: "asc" }, include: { author: { select: { name: true, role: true } } } },
    },
  });

  if (!dispute) notFound();

  const isParty = dispute.order.clientId === user.id || dispute.order.provider.userId === user.id;
  if (!isParty && user.role !== "ADMIN") notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-cream">
        Спор по заказу {dispute.order.code}
      </h1>
      <p className="mt-1 text-cream/90">{dispute.order.service.name}</p>

      <div className="mt-4 rounded-2xl border border-cream/10 bg-surface-alt p-4">
        <p className="text-sm font-bold text-cream">{dispute.reason}</p>
        <p className="mt-1 text-sm text-sage-100">{dispute.description}</p>
        <p className="mt-2 text-xs text-sage-100">Открыл(а): {dispute.openedBy.name} ({dispute.openedBy.role})</p>
      </div>

      {dispute.status === "RESOLVED" && (
        <div className="mt-4 rounded-2xl border border-cream/10 bg-surface-alt p-4">
          <p className="font-bold text-cream">Решение: {RESOLUTION_LABEL[dispute.resolution ?? ""] ?? dispute.resolution}</p>
          <p className="mt-1 text-sm text-sage-100">
            Клиенту: ${dispute.clientRefundAmount?.toString() ?? "0"} · Исполнителю: ${dispute.providerPayAmount?.toString() ?? "0"}
          </p>
          {dispute.resolutionNote && <p className="mt-1 text-sm text-sage-100">{dispute.resolutionNote}</p>}
        </div>
      )}

      <div className="mt-6 space-y-3">
        {dispute.messages.map((m) => (
          <div key={m.id} className="rounded-xl border border-cream/10 bg-surface-alt px-4 py-3">
            <p className="text-xs font-bold text-cream">{m.author.name} ({m.author.role})</p>
            <p className="mt-1 text-sm text-sage-100">{m.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <DisputeThread
          disputeId={dispute.id}
          isAdmin={user.role === "ADMIN"}
          resolved={dispute.status === "RESOLVED"}
          orderAmount={dispute.order.orderAmount.toString()}
        />
      </div>
    </div>
  );
}
