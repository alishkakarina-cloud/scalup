import { Link } from "react-router-dom";
import { Search, ArrowRight, ArrowUpRight, Target, ShieldCheck, Award } from "lucide-react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { categories } from "../data/mock";

const pitchPoints = [
  { icon: Target, text: "Точный подбор под ваш авто" },
  { icon: ShieldCheck, text: "Проверенные СТО-партнёры" },
  { icon: Award, text: "Гарантия качества запчастей" },
];

export function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-ink-950">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(600px circle at 15% 10%, rgba(183,229,0,0.16), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-paper/50">
                <span className="text-lime-500">Точный</span> подбор запчастей и услуг
              </p>
              <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight leading-tight text-paper">
                SCALUP — всё для твоего автомобиля
              </h1>
              <p className="mt-4 text-paper/50 text-base sm:text-lg">
                Запчасти, масла, шины и услуги СТО, подобранные точно под твой автомобиль.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <label className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-paper/30" size={18} strokeWidth={1.5} />
                  <input
                    type="text"
                    placeholder="Что ищете? Запчасть, масло, СТО, услугу"
                    className="w-full rounded-xl border border-white/15 bg-white/[0.03] pl-11 pr-4 py-3.5 text-sm text-paper placeholder:text-paper/30 outline-none focus:border-lime-500 transition-colors"
                  />
                </label>
                <Link
                  to="/garage"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-500 px-6 py-3.5 text-sm font-bold text-ink-950 hover:bg-lime-600 transition-colors shrink-0"
                >
                  Добавить авто
                  <ArrowRight size={16} strokeWidth={2.5} />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-ink-900 p-5 shrink-0">
              <p className="text-3xl sm:text-4xl font-bold text-lime-500">1500+</p>
              <p className="mt-1 text-sm text-paper/50">автомобилей в базе подбора</p>
              <span className="mt-3 inline-block rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-paper/30">
                TODO: реальная цифра
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {pitchPoints.map((point) => (
            <div key={point.text} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-lime-500">
                <point.icon size={20} strokeWidth={1.5} />
              </span>
              <span className="text-sm font-bold text-paper">{point.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-xl sm:text-2xl font-bold text-paper">Категории</h2>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const Icon = (Icons as unknown as Record<string, LucideIcon>)[cat.icon];
            const to = cat.name === "СТО" ? "/services" : "/catalog";
            return (
              <Link
                key={cat.name}
                to={to}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-ink-900 p-5 text-center transition-all hover:border-lime-500/30 hover:shadow-[0_0_32px_-10px_rgba(183,229,0,0.35)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 text-paper/60 group-hover:bg-lime-500 group-hover:text-ink-950 group-hover:border-lime-500 transition-colors">
                  <Icon size={22} strokeWidth={1.5} />
                </span>
                <span className="text-sm font-bold text-paper">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-paper">
              Не нашли нужную деталь или услугу?
            </h2>
            <p className="mt-1 text-paper/50">
              Посмотрите полный каталог товаров или запишитесь на услугу в СТО.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-1.5 rounded-xl bg-lime-500 px-5 py-2.5 text-sm font-bold text-ink-950 hover:bg-lime-600 transition-colors"
            >
              Каталог товаров
              <ArrowUpRight size={15} strokeWidth={2.5} />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-5 py-2.5 text-sm font-bold text-paper hover:bg-white/5 transition-colors"
            >
              Каталог услуг
              <ArrowUpRight size={15} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
