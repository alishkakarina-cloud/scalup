import Link from "next/link";
import { MapPin, ShieldCheck, Star } from "lucide-react";
import { prisma } from "../../lib/db";
import { SERVICE_CATEGORIES, SERVICE_CATEGORY_LABELS } from "../../lib/categories";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ category?: string; city?: string; q?: string; minRating?: string; mobileOnly?: string }>;
}

export default async function ProvidersPage({ searchParams }: Props) {
  const params = await searchParams;

  const providers = await prisma.provider.findMany({
    where: {
      ...(params.category ? { categories: { has: params.category } } : {}),
      ...(params.city ? { city: { equals: params.city, mode: "insensitive" } } : {}),
      ...(params.minRating ? { ratingAvg: { gte: Number(params.minRating) } } : {}),
      ...(params.mobileOnly === "true" ? { mobileService: true } : {}),
      ...(params.q
        ? {
            OR: [
              { businessName: { contains: params.q, mode: "insensitive" } },
              { services: { some: { name: { contains: params.q, mode: "insensitive" } } } },
            ],
          }
        : {}),
    },
    include: { services: { where: { active: true }, orderBy: { price: "asc" }, take: 1 }, _count: { select: { reviews: true } } },
    orderBy: [{ verified: "desc" }, { ratingAvg: "desc" }],
    take: 60,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-cream">Исполнители</h1>
      <p className="mt-1 text-cream/90">Найдено: {providers.length}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/providers"
          className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
            !params.category ? "bg-accent text-surface" : "border border-cream/15 text-cream/90 hover:bg-cream/5"
          }`}
        >
          Все категории
        </Link>
        {SERVICE_CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/providers?category=${c.slug}`}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              params.category === c.slug ? "bg-accent text-surface" : "border border-cream/15 text-cream/90 hover:bg-cream/5"
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {providers.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-cream/15 p-12 text-center text-cream/90">
          Пока нет исполнителей по этому запросу.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {providers.map((p) => (
            <Link
              key={p.id}
              href={`/providers/${p.id}`}
              className="flex flex-col rounded-2xl border border-cream/10 bg-surface-alt p-4 transition-all hover:border-accent/30 hover:shadow-[0_0_32px_-10px_rgba(232,232,232,0.14)]"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-extrabold tracking-tight text-cream">{p.businessName}</h3>
                {p.verified && (
                  <span className="flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-bold text-cream shrink-0">
                    <ShieldCheck size={12} /> Проверенный
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs text-sage-100">
                {p.city && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={12} /> {p.city}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Star size={12} className="fill-cream text-cream" /> {p.ratingAvg.toFixed(1)} ({p._count.reviews})
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.categories.slice(0, 3).map((cat) => (
                  <span key={cat} className="rounded-full border border-cream/10 px-2 py-0.5 text-[11px] text-sage-100">
                    {SERVICE_CATEGORY_LABELS[cat] ?? cat}
                  </span>
                ))}
              </div>
              {p.services[0] && (
                <p className="mt-3 text-sm text-cream/90">
                  от <span className="font-extrabold text-cream">${p.services[0].price.toString()}</span>
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
