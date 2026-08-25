import Link from "next/link";
import { ArrowUpRight, Target, ShieldCheck, Award, Plus } from "lucide-react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { HomeSearch } from "../components/HomeSearch";
import { SERVICE_CATEGORIES } from "../lib/categories";

const pitchPoints = [
  { icon: Target, text: "Точный подбор под ваш авто" },
  { icon: ShieldCheck, text: "Проверенные СТО-партнёры" },
  { icon: Award, text: "Гарантия качества запчастей" },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-cream">
        <div
          className="pointer-events-none absolute -top-10 -right-10 h-56 w-56 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, #2e3824 1.5px, transparent 1.5px)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="pointer-events-none absolute top-24 left-[38%] h-px w-24 -rotate-45 bg-surface/10 hidden lg:block" />
        <div className="pointer-events-none absolute bottom-16 left-[42%] h-px w-16 -rotate-45 bg-surface/10 hidden lg:block" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-center">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-surface/30" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-surface">
                  О платформе
                </span>
              </div>

              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-surface">
                Найдите <span className="text-accent">специалиста</span>
                <br />
                для своего автомобиля
              </h1>

              <p className="mt-5 text-surface text-base sm:text-lg max-w-md">
                Запчасти, масла, шины и услуги проверенных СТО — подобранные точно под твой автомобиль.
              </p>

              <HomeSearch />

              <div className="mt-10 space-y-4">
                {pitchPoints.map((point) => (
                  <div key={point.text} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-surface/15 text-surface/80">
                      <point.icon size={16} strokeWidth={1.5} />
                    </span>
                    <span className="text-sm font-bold text-surface">{point.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-6 lg:mt-0">
              <span className="absolute -left-5 top-[38%] z-20 hidden sm:flex h-14 w-14 items-center justify-center rounded-full bg-accent text-cream shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                <Plus size={24} strokeWidth={2.5} />
              </span>

              <div className="relative overflow-hidden rounded-3xl bg-surface-alt aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full blur-[50px]"
                  style={{
                    background: "radial-gradient(circle, #E8825A 0%, #C25B3A 45%, rgba(143,63,38,0) 75%)",
                  }}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-14 bottom-6 h-44 w-44 rounded-full blur-[40px] opacity-80"
                  style={{
                    background: "radial-gradient(circle, #E8825A 0%, #C25B3A 50%, rgba(143,63,38,0) 75%)",
                  }}
                />
                <div className="vignette" />
                <svg
                  viewBox="0 0 400 200"
                  aria-hidden="true"
                  className="absolute inset-0 m-auto w-3/4 h-auto text-cream/[0.14]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M40 140 L40 120 Q40 100 60 95 L110 80 Q140 55 180 55 L260 55 Q300 55 320 80 L350 95 Q370 100 370 120 L370 140" />
                  <path d="M40 140 L370 140" />
                  <path d="M120 95 L150 65 L230 65 L255 95 Z" />
                  <circle cx="100" cy="140" r="22" />
                  <circle cx="300" cy="140" r="22" />
                </svg>

                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 inline-flex items-center gap-2 rounded-full border border-cream/10 bg-surface-alt px-3 py-1.5">
                  <ShieldCheck size={14} strokeWidth={1.5} className="text-cream" />
                  <span className="text-[11px] font-bold text-cream">Гарантия качества</span>
                </div>

                <div className="hidden sm:flex absolute top-6 right-6 flex-col items-end gap-1 text-right">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-cream">Точно</span>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-cream/90">Быстро</span>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-cream/80">Надёжно</span>
                </div>

                <div className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 w-[170px] rounded-2xl border border-cream/10 bg-surface-alt p-4">
                  <p className="text-xs text-cream/75">Точность подбора</p>
                  <p className="mt-1 text-lg font-extrabold text-cream">98%</p>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-cream/10">
                    <div className="h-full w-[98%] rounded-full bg-accent" />
                  </div>
                </div>

                <div className="hidden sm:block absolute right-6 bottom-6 w-[150px] rounded-2xl border border-cream/10 bg-surface-alt p-4">
                  <p className="text-2xl font-extrabold text-cream">1500+</p>
                  <p className="mt-0.5 text-[11px] text-cream/75">авто в базе</p>
                  <span className="mt-2 inline-block rounded bg-cream/10 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-cream/80">
                    TODO: реальная цифра
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-cream">Категории</h2>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {SERVICE_CATEGORIES.map((cat, i) => {
            const Icon = (Icons as unknown as Record<string, LucideIcon>)[cat.icon];
            const href = cat.slug === "parts" ? "/catalog" : `/providers?category=${cat.slug}`;
            return (
              <Link
                key={cat.slug}
                href={href}
                style={{ animationDelay: `${i * 40}ms` }}
                className="reveal group flex flex-col items-center gap-3 rounded-2xl border border-cream/10 bg-surface-alt p-5 text-center transition-all hover:border-accent/30 hover:shadow-[0_0_32px_-10px_rgba(194,91,58,0.35)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-cream/10 text-cream/75 group-hover:bg-accent group-hover:text-cream group-hover:border-accent transition-colors">
                  <Icon size={22} strokeWidth={1.5} />
                </span>
                <span className="text-sm font-bold text-cream">{cat.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-cream/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-cream">
              Не нашли нужную деталь или услугу?
            </h2>
            <p className="mt-1 text-cream/90">
              Посмотрите полный каталог товаров или найдите исполнителя рядом с вами.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-cream hover:bg-accent-hover transition-colors"
            >
              Каталог товаров
              <ArrowUpRight size={15} strokeWidth={2.5} />
            </Link>
            <Link
              href="/providers"
              className="inline-flex items-center gap-1.5 rounded-xl border border-cream/15 px-5 py-2.5 text-sm font-bold text-cream hover:bg-cream/5 transition-colors"
            >
              Найти исполнителя
              <ArrowUpRight size={15} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
