import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, ShieldCheck, Star, ArrowRight } from "lucide-react";
import { prisma } from "../../../lib/db";
import { getCurrentUser } from "../../../lib/session";
import { BookingForm } from "../../../components/BookingForm";
import { SERVICE_CATEGORY_LABELS } from "../../../lib/categories";

export const dynamic = "force-dynamic";

export default async function ProviderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [provider, user] = await Promise.all([
    prisma.provider.findUnique({
      where: { id },
      include: {
        services: { where: { active: true }, orderBy: { price: "asc" } },
        reviews: { orderBy: { createdAt: "desc" }, take: 10, include: { client: { select: { name: true } } } },
      },
    }),
    getCurrentUser(),
  ]);

  if (!provider) notFound();

  const publicUser = user
    ? {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        city: user.city,
        providerId: user.provider?.id ?? null,
      }
    : null;

  return (
    <div>
      <section className="relative overflow-hidden bg-surface border-b border-cream/10">
        <div className="vignette" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="relative shrink-0">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-3 rounded-full blur-2xl"
                style={{ background: "radial-gradient(circle, #F5F5F5 0%, #A8A8AC 50%, rgba(168,168,172,0) 75%)" }}
              />
              <span className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-accent text-surface text-2xl font-extrabold">
                {provider.businessName.slice(0, 1).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cream">{provider.businessName}</h1>
                {provider.verified && (
                  <span className="flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-xs font-bold text-cream">
                    <ShieldCheck size={13} /> Проверенный
                  </span>
                )}
              </div>
              <p className="mt-2 text-cream/90 max-w-2xl">{provider.description ?? "Описание пока не заполнено."}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {provider.categories.map((cat) => (
                  <span key={cat} className="rounded-full border border-cream/10 px-2 py-0.5 text-[11px] text-sage-100">
                    {SERVICE_CATEGORY_LABELS[cat] ?? cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-8 border-t border-cream/10 pt-6">
            <div className="border-l-2 border-accent pl-3">
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cream">{provider.ratingAvg.toFixed(1)}</p>
              <p className="text-xs text-cream/90 mt-0.5">рейтинг</p>
            </div>
            <div className="border-l-2 border-accent pl-3">
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cream">{provider.ratingCount}</p>
              <p className="text-xs text-cream/90 mt-0.5">отзывов</p>
            </div>
            <div className="border-l-2 border-accent pl-3">
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cream">{provider.services.length}</p>
              <p className="text-xs text-cream/90 mt-0.5">услуг</p>
            </div>
          </div>
        </div>
      </section>

      {provider.city && (
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-2xl border border-cream/10 bg-surface-alt p-5 flex items-start gap-3 max-w-sm">
            <MapPin size={18} strokeWidth={1.5} className="text-cream shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-cream">Город</p>
              <p className="text-sm text-sage-100 mt-0.5">{provider.city}</p>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-cream">Услуги и цены</h2>
          {provider.services.length === 0 ? (
            <p className="mt-4 text-sage-100">Исполнитель пока не добавил услуги.</p>
          ) : (
            <div className="mt-4 divide-y divide-cream/10 rounded-2xl border border-cream/10 bg-surface-alt">
              {provider.services.map((s) => (
                <div key={s.id} className="p-4">
                  <p className="font-bold text-cream">{s.name}</p>
                  {s.description && <p className="mt-0.5 text-sm text-sage-100">{s.description}</p>}
                  <p className="mt-1 text-sm text-sage-100">
                    от <span className="text-cream font-extrabold">${s.price.toString()}</span>
                  </p>
                </div>
              ))}
            </div>
          )}

          <h2 className="mt-10 text-xl font-extrabold tracking-tight text-cream">Отзывы</h2>
          {provider.reviews.length === 0 ? (
            <p className="mt-4 text-sage-100">Пока нет отзывов.</p>
          ) : (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {provider.reviews.map((r) => (
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

        <div>
          {provider.services.length > 0 ? (
            <BookingForm
              services={provider.services.map((s) => ({ id: s.id, name: s.name, price: s.price.toString() }))}
              user={publicUser}
            />
          ) : (
            <div className="rounded-2xl border border-cream/10 bg-surface-alt p-5 text-center text-sage-100">
              У исполнителя пока нет активных услуг для записи.
            </div>
          )}
          <Link
            href="/cart"
            className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-cream/15 px-5 py-2.5 text-sm font-bold text-cream hover:bg-cream/5 transition-colors"
          >
            Перейти в корзину товаров <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
        </div>
      </section>
    </div>
  );
}
