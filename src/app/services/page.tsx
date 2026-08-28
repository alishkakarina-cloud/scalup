import Link from "next/link";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { prisma } from "../../lib/db";
import { SERVICE_CATEGORIES } from "../../lib/categories";
import { VehicleBanner } from "../../components/VehicleBanner";
import { SpecialistResults, type MatchedProvider } from "../../components/SpecialistResults";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function ServicesPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const activeCategory = SERVICE_CATEGORIES.find((c) => c.slug === category);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {!activeCategory ? (
        <>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-cream">Найти услугу</h1>
          <p className="mt-1 text-cream/90">Выберите, что нужно сделать с автомобилем — покажем 3-5 подходящих специалистов.</p>

          <div className="mt-5">
            <VehicleBanner contextLabel="Подбираем услуги для" />
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {SERVICE_CATEGORIES.map((c, i) => {
              const Icon = (Icons as unknown as Record<string, LucideIcon>)[c.icon] ?? Icons.Wrench;
              return (
                <Link
                  key={c.slug}
                  href={`/services?category=${c.slug}`}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className="reveal card-lift group flex items-center gap-4 rounded-2xl border border-cream/10 bg-surface-alt p-5 hover:border-accent/40"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-sage-100/40 text-cream">
                    <Icon size={22} strokeWidth={1.5} />
                  </span>
                  <span className="font-extrabold tracking-tight text-cream">{c.label}</span>
                  <Icons.ChevronRight size={18} className="ml-auto text-cream/40 group-hover:text-cream transition-colors" />
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <ResultsForCategory slug={activeCategory.slug} label={activeCategory.label} />
      )}
    </div>
  );
}

async function ResultsForCategory({ slug, label }: { slug: string; label: string }) {
  const providers = await prisma.provider.findMany({
    where: { categories: { has: slug } },
    include: {
      services: { where: { active: true, category: slug }, orderBy: { price: "asc" }, take: 1 },
      _count: { select: { reviews: true } },
    },
    orderBy: [{ verified: "desc" }, { ratingAvg: "desc" }],
    take: 5,
  });

  const matched: MatchedProvider[] = providers.map((p) => ({
    id: p.id,
    businessName: p.businessName,
    verified: p.verified,
    district: p.district,
    ratingAvg: p.ratingAvg,
    reviewCount: p._count.reviews,
    service: p.services[0]
      ? { id: p.services[0].id, price: p.services[0].price.toString(), durationMinutes: p.services[0].durationMinutes }
      : null,
  }));

  return <SpecialistResults categoryLabel={label} providers={matched} />;
}
