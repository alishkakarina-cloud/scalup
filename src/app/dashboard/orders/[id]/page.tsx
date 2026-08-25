import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/db";
import { getCurrentUser } from "../../../../lib/session";
import { OrderDetailView } from "../../../../components/OrderDetailView";

export const dynamic = "force-dynamic";

export default async function ProviderOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user?.provider) return null;

  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: {
      service: true,
      provider: true,
      client: true,
      vehicle: true,
      dispute: true,
      review: true,
      statusHistory: { orderBy: { createdAt: "asc" }, include: { changedBy: { select: { name: true, role: true } } } },
    },
  });

  if (!order || order.providerId !== user.provider.id) notFound();

  return <OrderDetailView order={order} viewerRole="PROVIDER" />;
}
