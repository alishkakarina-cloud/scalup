import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { products, districts, carBrands } from "../data/mock";
import { ProductCard } from "../components/ProductCard";
import type { ProductCategory } from "../types";

const categoryOptions: ProductCategory[] = ["Запчасти", "Масла", "Шины", "Аксессуары"];

export function Catalog() {
  const [brand, setBrand] = useState<string>("Все");
  const [category, setCategory] = useState<string>("Все");
  const [district, setDistrict] = useState<string>("Все");
  const [maxPrice, setMaxPrice] = useState(100);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (brand !== "Все" && !p.brandFit.includes(brand) && p.brandFit !== "Универсальное") return false;
      if (category !== "Все" && p.category !== category) return false;
      if (district !== "Все" && p.district !== district) return false;
      if (p.price > maxPrice) return false;
      if (inStockOnly && !p.inStock) return false;
      return true;
    });
  }, [brand, category, district, maxPrice, inStockOnly]);

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-navy-900/40 mb-2">
          Марка авто
        </label>
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent-500"
        >
          <option>Все</option>
          {carBrands.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-navy-900/40 mb-2">
          Категория
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent-500"
        >
          <option>Все</option>
          {categoryOptions.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-navy-900/40 mb-2">
          Район
        </label>
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent-500"
        >
          <option>Все</option>
          {districts.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-navy-900/40 mb-2">
          <span>Цена до</span>
          <span className="text-navy-900 normal-case text-sm font-bold">${maxPrice}</span>
        </label>
        <input
          type="range"
          min={10}
          max={100}
          step={5}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-accent-500"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-navy-900/80">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="h-4 w-4 rounded accent-accent-500"
        />
        Только в наличии
      </label>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">Каталог товаров</h1>
          <p className="mt-1 text-navy-900/60">Найдено: {filtered.length}</p>
        </div>
        <button
          onClick={() => setFiltersOpen(true)}
          className="lg:hidden inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-navy-900"
        >
          <SlidersHorizontal size={15} /> Фильтры
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        <aside className="hidden lg:block rounded-2xl border border-black/5 bg-white p-5 h-fit sticky top-24">
          <h2 className="font-bold text-navy-900 mb-4">Фильтры</h2>
          {filterPanel}
        </aside>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-black/10 p-12 text-center text-navy-900/50">
            Ничего не найдено по заданным фильтрам.
          </div>
        )}
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-navy-900">Фильтры</h2>
              <button onClick={() => setFiltersOpen(false)} aria-label="Закрыть">
                <X size={20} />
              </button>
            </div>
            {filterPanel}
            <button
              onClick={() => setFiltersOpen(false)}
              className="mt-6 w-full rounded-full bg-accent-500 py-3 text-sm font-semibold text-white"
            >
              Показать {filtered.length} товаров
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
