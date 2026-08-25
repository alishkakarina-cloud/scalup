import { Star } from "lucide-react";
import { prisma } from "../../../lib/db";
import { getCurrentUser } from "../../../lib/session";

export const dynamic = "force-dynamic";

export default async function ProviderReviewsPage() {
  const user = await getCurrentUser();
  if (!user?.provider) return null;

  const reviews = await prisma.review.findMany({
    where: { providerId: user.provider.id },
    include: { client: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-cream">Отзывы</h1>
      {reviews.length === 0 ? (
        <p className="mt-6 text-sage-100">Отзывов пока нет.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-cream/10 bg-surface-alt p-4">
              <div className="flex items-center justify-between">
                <p className="font-bold text-cream text-sm">{r.client.name}</p>
                <span className="flex items-center gap-1 text-sm font-bold text-cream">
                  <Star size={14} className="fill-cream text-cream" /> {r.rating}
                </span>
              </div>
              {r.text && <p className="mt-2 text-sm text-sage-100">{r.text}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
