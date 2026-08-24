import { useState } from "react";
import { serviceCategories } from "../data/mock";
import { ServiceSkeletonCard } from "../components/ServiceSkeletonCard";

export function Services() {
  const [active, setActive] = useState(serviceCategories[0]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">Каталог услуг</h1>
      <p className="mt-1 text-navy-900/60">
        Выберите категорию услуги СТО рядом с вами.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {serviceCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              active === cat
                ? "bg-accent-500 text-white"
                : "bg-white border border-black/10 text-navy-900/70 hover:bg-navy-950/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-black/5 bg-amber-50/60 px-4 py-3 text-sm text-amber-800">
        Раздел «{active}» пока в разработке — партнёры СТО добавят свои услуги позже.
        Ниже показан пример структуры карточки услуги.
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <ServiceSkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
