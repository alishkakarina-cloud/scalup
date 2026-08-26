import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Car, ShieldCheck, Award, Lock, Tag, Star, Wrench, Droplets, CircleDot, Cog } from "lucide-react";
import { LeadForm } from "../components/LeadForm";

const stats = [
  { icon: Car, value: "1500+", label: "авто в базе" },
  { icon: ShieldCheck, value: "Проверенные", label: "СТО-партнёры" },
  { icon: Award, value: "Гарантия", label: "качества" },
];

const categoryCards = [
  {
    number: "01",
    icon: Wrench,
    title: "СТО",
    description: "Диагностика, ремонт и комплексное обслуживание автомобиля.",
    href: "/providers?category=sto",
  },
  {
    number: "02",
    icon: Droplets,
    title: "Замена масла",
    description: "Регламентная замена масла и технических жидкостей.",
    href: "/providers?category=oil",
  },
  {
    number: "03",
    icon: CircleDot,
    title: "Шиномонтаж",
    description: "Шиномонтаж, балансировка и сезонное хранение шин.",
    href: "/providers?category=tires",
  },
  {
    number: "04",
    icon: Cog,
    title: "Запчасти",
    description: "Оригинальные и аналоговые запчасти под ваш автомобиль.",
    href: "/catalog",
  },
];

const advantages = [
  {
    icon: ShieldCheck,
    title: "Проверенные исполнители",
    description: "Каждый СТО проходит проверку перед публикацией на платформе.",
  },
  {
    icon: Lock,
    title: "Честная оплата",
    description: "Деньги переводятся исполнителю только после вашего подтверждения работы.",
  },
  {
    icon: Tag,
    title: "Понятные цены",
    description: "Комиссия платформы известна заранее — никаких скрытых доплат.",
  },
];

export default function Home() {
  return (
    <div>
      {/* Блок 1 — hero: тёмная карточка, текст+кнопки+статистика слева, фото Porsche справа */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="relative overflow-hidden rounded-3xl border border-cream/10 bg-surface-alt">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full blur-[80px] opacity-40"
            style={{ background: "radial-gradient(circle, #F5F5F5 0%, rgba(245,245,245,0) 70%)" }}
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center p-6 sm:p-10 lg:p-14">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08]">
                <span className="block font-normal text-cream">Найдите специалиста</span>
                <span className="block font-extrabold text-cream">для своего автомобиля</span>
              </h1>

              <p className="mt-5 text-sage-100 text-base sm:text-lg max-w-md">
                Запчасти, масла, шины и услуги проверенных СТО — подобранные точно под твой автомобиль.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#booking"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-surface hover:bg-accent-hover transition-colors"
                >
                  Записаться
                  <ArrowRight size={15} strokeWidth={2.5} />
                </a>
                <Link
                  href="/providers"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-sage-100 px-6 py-3 text-sm font-bold text-cream hover:bg-cream/5 transition-colors"
                >
                  Услуги
                  <ArrowRight size={15} strokeWidth={2.5} />
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-5">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-sage-100/40 text-cream">
                      <stat.icon size={18} strokeWidth={1.5} />
                    </span>
                    <div>
                      <p className="text-sm font-extrabold text-cream leading-tight">{stat.value}</p>
                      <p className="text-xs text-sage-100 leading-tight">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-2 lg:mt-0">
              <span className="absolute -left-4 -top-4 z-20 hidden sm:flex h-14 w-14 items-center justify-center rounded-full bg-accent text-surface shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
                <ShieldCheck size={22} strokeWidth={2} />
              </span>
              <div className="relative overflow-hidden rounded-2xl aspect-[4/3] sm:aspect-[5/4]">
                <Image
                  src="/images/hero-porsche.jpg"
                  alt="Чёрный спортивный автомобиль — студийное фото"
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Блок 2 — "Категории": единственная светлая секция на сайте */}
      <section className="mt-14 sm:mt-20 bg-accent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-surface/60">Услуги</span>
                <span className="h-px w-8 bg-surface/30" />
              </div>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-surface">Категории</h2>
            </div>
            <Link
              href="/providers"
              className="inline-flex items-center gap-1.5 rounded-xl border border-surface/20 px-5 py-2.5 text-sm font-bold text-surface hover:bg-surface/5 transition-colors"
            >
              Смотреть все услуги
              <ArrowUpRight size={15} strokeWidth={2.5} />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {categoryCards.map((card, i) => (
              <Link
                key={card.number}
                href={card.href}
                style={{ animationDelay: `${i * 40}ms` }}
                className="reveal group flex flex-col overflow-hidden rounded-2xl border border-cream/10 bg-surface-alt transition-all hover:border-accent/50 hover:shadow-[0_0_32px_-10px_rgba(232,232,232,0.14)]"
              >
                <div className="relative flex h-32 items-center justify-center bg-surface">
                  <span className="absolute left-3 top-3 text-2xl font-extrabold text-cream/25">{card.number}</span>
                  <card.icon size={40} strokeWidth={1.25} className="text-cream/80" />
                </div>
                <div className="p-5">
                  <div className="h-0.5 w-6 bg-accent" />
                  <h3 className="mt-3 font-extrabold tracking-tight text-cream">{card.title}</h3>
                  <p className="mt-1.5 text-sm text-sage-100">{card.description}</p>
                  <ArrowUpRight size={16} strokeWidth={2} className="mt-3 text-cream/50 group-hover:text-cream transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Блок 3 — "Почему мы" + форма записи */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-sage-100">Почему мы</span>
              <span className="h-px w-8 bg-sage-100/40" />
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-cream">
              Сервис, которому доверяют
            </h2>
            <p className="mt-4 text-sage-100 max-w-md">
              Мы ценим ваше время и доверие. Держим слово, работаем прозрачно и на результат.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {advantages.map((item) => (
                <div key={item.title}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-sage-100/40 text-cream">
                    <item.icon size={18} strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-3 font-extrabold tracking-tight text-cream text-sm">{item.title}</h3>
                  <p className="mt-1.5 text-sm text-sage-100">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-cream/10 bg-surface-alt p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-sage-100/40 text-cream text-sm font-extrabold">
                  G
                </span>
                <div>
                  <p className="text-lg font-extrabold text-cream leading-tight">4,9</p>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className="fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-[11px] text-sage-100 mt-0.5">на основе 312 отзывов (пример)</p>
                </div>
              </div>
              <div className="sm:border-l sm:border-cream/10 sm:pl-4">
                <p className="text-sm text-cream/90">«Отличный сервис! Быстро нашли проблему, всё объяснили и сделали раньше срока.»</p>
                <p className="mt-1 text-xs text-sage-100">— Клиент SCALUP, пример отзыва</p>
              </div>
            </div>
          </div>

          <LeadForm />
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
              className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-surface hover:bg-accent-hover transition-colors"
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
