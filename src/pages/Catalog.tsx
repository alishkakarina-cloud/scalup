import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { products, districts, carBrands, carModels } from "../data/mock";
import { ProductCard } from "../components/ProductCard";
import type { ProductCategory } from "../types";

const categoryOptions: ProductCategory[] = ["Запчасти", "Масла", "Шины", "Аксессуары"];
const selectClass =
  "w-full rounded-xl border border-paper/15 bg-paper/[0.03] px-3 py-2 text-sm text-paper outline-none focus:border-lime-500 transition-colors";

export function Catalog() {
  const [brand, setBrand] = useState<string>("Все");
  const [model, setModel] = useState<string>("Все");
  const [category, setCategory] = useState<string>("Все");
  const [district, setDistrict] = useState<string>("Все");
  const [maxPrice, setMaxPrice] = useState(100);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (brand !== "Все" && !p.brandFit.includes(brand) && p.brandFit !== "Универсальное") return false;
      if (model !== "Все" && p.model && p.model !== model) return false;
      if (category !== "Все" && p.category !== category) return false;
      if (district !== "Все" && p.district !== district) return false;
      if (p.price > maxPrice) return false;
      if (inStockOnly && !p.inStock) return false;
      return true;
    });
  }, [brand, model, category, district, maxPrice, inStockOnly]);

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-paper/60 mb-2">
          Марка авто
        </label>
        <select value={brand} onChange={(e) => setBrand(e.target.value)} className={selectClass}>
          <option className="bg-ink-900">Все</option>
          {carBrands.map((b) => (
            <option key={b} className="bg-ink-900">{b}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-paper/60 mb-2">
          Модель
        </label>
        <select value={model} onChange={(e) => setModel(e.target.value)} className={selectClass}>
          <option className="bg-ink-900">Все</option>
          {carModels.map((m) => (
            <option key={m} className="bg-ink-900">{m}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-paper/60 mb-2">
          Категория
        </label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
          <option className="bg-ink-900">Все</option>
          {categoryOptions.map((c) => (
            <option key={c} className="bg-ink-900">{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-paper/60 mb-2">
          Район
        </label>
        <select value={district} onChange={(e) => setDistrict(e.target.value)} className={selectClass}>
          <option className="bg-ink-900">Все</option>
          {districts.map((d) => (
            <option key={d} className="bg-ink-900">{d}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-paper/60 mb-2">
          <span>Цена до</span>
          <span className="text-paper normal-case text-sm font-bold">${maxPrice}</span>
        </label>
        <input
          type="range"
          min={10}
          max={100}
          step={5}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-lime-500"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-paper/70">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="h-4 w-4 rounded accent-lime-500"
        />
        Только в наличии
      </label>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-paper">Каталог товаров</h1>
          <p className="mt-1 text-paper/60">Найдено: {filtered.length}</p>
        </div>
        <button
          onClick={() => setFiltersOpen(true)}
          className="lg:hidden inline-flex items-center gap-2 rounded-xl border border-paper/15 px-4 py-2 text-sm font-bold text-paper"
        >
          <SlidersHorizontal size={15} strokeWidth={1.5} /> Фильтры
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        <aside className="hidden lg:block rounded-2xl border border-paper/10 bg-ink-900 p-5 h-fit sticky top-24">
          <h2 className="font-bold text-paper mb-4">Фильтры</h2>
          {filterPanel}
        </aside>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {filtered.map((p, i) => (
              <div key={p.id} className="reveal h-full" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-paper/15 p-12 text-center text-paper/60">
            Ничего не найдено по заданным фильтрам.
          </div>
        )}
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-950/80" onClick={() => setFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-paper/10 bg-ink-950 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-paper">Фильтры</h2>
              <button onClick={() => setFiltersOpen(false)} aria-label="Закрыть" className="text-paper">
                <X size={20} />
              </button>
            </div>
            {filterPanel}
            <button
              onClick={() => setFiltersOpen(false)}
              className="mt-6 w-full rounded-xl bg-lime-500 py-3 text-sm font-bold text-ink-950 hover:bg-lime-600 transition-colors"
            >
              Показать {filtered.length} товаров
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
