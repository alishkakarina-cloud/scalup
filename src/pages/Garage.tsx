import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Car as CarIcon, Trash2, ArrowRight } from "lucide-react";
import { useGarage } from "../context/GarageContext";
import { garageOffers, carBrands } from "../data/mock";

const inputClass =
  "w-full rounded-xl border border-cream/15 bg-cream/[0.03] px-3.5 py-2.5 text-sm text-cream outline-none focus:border-accent transition-colors";

export function Garage() {
  const { car, setCar, clearCar } = useGarage();
  const [form, setForm] = useState({
    brand: carBrands[0],
    model: "",
    year: "",
    engine: "",
    plate: "",
    vin: "",
  });

  const isValid = Boolean(form.model && form.year && form.engine && form.plate);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setCar({ ...form });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <h1 className="text-2xl sm:text-3xl font-bold text-cream">Мой гараж</h1>
      <p className="mt-2 text-cream/90">
        Добавьте свой автомобиль, чтобы видеть подходящие товары и услуги.
      </p>

      {!car ? (
        <form
          onSubmit={handleSubmit}
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-cream/10 bg-surface-alt p-6"
        >
          <div>
            <label className="block text-sm font-bold text-cream/75 mb-1.5">Марка</label>
            <select
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className={inputClass}
            >
              {carBrands.map((b) => (
                <option key={b} value={b} className="bg-surface-alt">{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-cream/75 mb-1.5">Модель</label>
            <input
              required
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              placeholder="Camry"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-cream/75 mb-1.5">Год выпуска</label>
            <input
              required
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              placeholder="2018"
              inputMode="numeric"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-cream/75 mb-1.5">Двигатель</label>
            <input
              required
              value={form.engine}
              onChange={(e) => setForm({ ...form, engine: e.target.value })}
              placeholder="2.5 л, бензин"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-cream/75 mb-1.5">Госномер</label>
            <input
              required
              value={form.plate}
              onChange={(e) => setForm({ ...form, plate: e.target.value })}
              placeholder="01KG123ABC"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-cream/75 mb-1.5">
              VIN <span className="text-cream/75 font-normal">(необязательно)</span>
            </label>
            <input
              value={form.vin}
              onChange={(e) => setForm({ ...form, vin: e.target.value })}
              placeholder="JTDKN3DU..."
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2 mt-2">
            <button
              type="submit"
              disabled={!isValid}
              className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-cream hover:bg-accent-hover transition-colors disabled:bg-cream/10 disabled:text-cream/30 disabled:hover:bg-cream/10"
            >
              Добавить автомобиль
              <ArrowRight size={15} strokeWidth={2.5} />
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-8 space-y-6">
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-cream/10 bg-surface-alt p-6">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent text-cream">
                <CarIcon size={26} strokeWidth={1.5} />
              </span>
              <div>
                <h3 className="text-lg font-bold text-cream">{car.brand} {car.model}</h3>
                <p className="text-sm text-cream/75">
                  {car.year} г. · {car.engine} · Госномер {car.plate}
                </p>
                {car.vin && <p className="text-xs text-cream/75 mt-0.5">VIN: {car.vin}</p>}
              </div>
            </div>
            <button
              onClick={clearCar}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/75 hover:bg-cream/5 transition-colors shrink-0"
              aria-label="Удалить автомобиль"
            >
              <Trash2 size={16} strokeWidth={1.5} />
            </button>
          </div>

          <div>
            <h3 className="text-lg font-bold text-cream">Подходит для вашего авто</h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {garageOffers.map((offer) => (
                <div
                  key={offer.label}
                  className="rounded-2xl border border-cream/10 bg-surface-alt p-5 transition-all hover:border-accent/30 hover:shadow-[0_0_32px_-10px_rgba(193,87,58,0.35)]"
                >
                  <p className="text-sm text-cream/75">{offer.label}</p>
                  <p className="mt-1 text-2xl font-bold text-cream">${offer.price}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-cream hover:bg-accent-hover transition-colors"
              >
                Смотреть каталог товаров <ArrowRight size={15} strokeWidth={2.5} />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-1.5 rounded-xl border border-cream/15 px-5 py-2.5 text-sm font-bold text-cream hover:bg-cream/5 transition-colors"
              >
                Смотреть услуги СТО <ArrowRight size={15} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
