import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { categories } from "../data/mock";

export function Home() {
  return (
    <div>
      <section className="bg-navy-950 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              SCALUP — всё для твоего автомобиля
            </h1>
            <p className="mt-4 text-white/60 text-base sm:text-lg">
              Запчасти, масла, шины и услуги СТО, подобранные точно под твой автомобиль.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <label className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-900/40" size={18} />
                <input
                  type="text"
                  placeholder="Что ищете? Запчасть, масло, СТО, услугу"
                  className="w-full rounded-full bg-white pl-11 pr-4 py-3.5 text-sm text-navy-900 placeholder:text-navy-900/40 outline-none ring-2 ring-transparent focus:ring-accent-500"
                />
              </label>
              <Link
                to="/garage"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-6 py-3.5 text-sm font-semibold text-white hover:bg-accent-600 transition-colors shrink-0"
              >
                Добавить авто
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-xl sm:text-2xl font-bold text-navy-900">Категории</h2>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const Icon = (Icons as unknown as Record<string, LucideIcon>)[cat.icon];
            const to = cat.name === "СТО" ? "/services" : "/catalog";
            return (
              <Link
                key={cat.name}
                to={to}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-black/5 bg-white p-5 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50 text-accent-600 group-hover:bg-accent-500 group-hover:text-white transition-colors">
                  <Icon size={22} strokeWidth={1.75} />
                </span>
                <span className="text-sm font-semibold text-navy-900">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-white border-t border-black/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-navy-900">
              Не нашли нужную деталь или услугу?
            </h2>
            <p className="mt-1 text-navy-900/60">
              Посмотрите полный каталог товаров или запишитесь на услугу в СТО.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              to="/catalog"
              className="rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-600 transition-colors"
            >
              Каталог товаров
            </Link>
            <Link
              to="/services"
              className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-navy-900 hover:bg-navy-950/5 transition-colors"
            >
              Каталог услуг
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
