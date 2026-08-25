import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/db";
import { getCurrentUser } from "../../../../lib/session";
import { OrderDetailView } from "../../../../components/OrderDetailView";

export const dynamic = "force-dynamic";

export default async function ClientOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return null;

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

  if (!order) notFound();
  const isOwner = order.clientId === user.id;
  if (!isOwner && user.role !== "ADMIN") notFound();

  return <OrderDetailView order={order} viewerRole={user.role === "ADMIN" ? "ADMIN" : "CLIENT"} />;
}
