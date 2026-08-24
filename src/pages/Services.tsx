import { useState } from "react";
import { serviceCategories } from "../data/mock";
import { ServiceSkeletonCard } from "../components/ServiceSkeletonCard";

export function Services() {
  const [active, setActive] = useState(serviceCategories[0]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <h1 className="text-2xl sm:text-3xl font-bold text-cream">Каталог услуг</h1>
      <p className="mt-1 text-cream/90">
        Выберите категорию услуги СТО рядом с вами.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {serviceCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            aria-pressed={active === cat}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              active === cat
                ? "bg-accent text-cream"
                : "border border-cream/15 text-cream/90 hover:bg-cream/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-cream/10 border-l-2 border-l-accent bg-surface-alt px-4 py-3 text-sm text-cream/75">
        Раздел «{active}» пока в разработке — партнёры СТО добавят свои услуги позже.
        Ниже показан пример структуры карточки услуги.
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="reveal" style={{ animationDelay: `${i * 40}ms` }}>
            <ServiceSkeletonCard />
          </div>
        ))}
      </div>
    </div>
  );
}
