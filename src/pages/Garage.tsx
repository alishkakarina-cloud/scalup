import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Car as CarIcon, Trash2, ArrowRight } from "lucide-react";
import { useGarage } from "../context/GarageContext";
import { garageOffers, carBrands } from "../data/mock";

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.model || !form.year || !form.engine || !form.plate) return;
    setCar({ ...form });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">Мой гараж</h1>
      <p className="mt-2 text-navy-900/60">
        Добавьте свой автомобиль, чтобы видеть подходящие товары и услуги.
      </p>

      {!car ? (
        <form
          onSubmit={handleSubmit}
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
        >
          <div>
            <label className="block text-sm font-medium text-navy-900/70 mb-1.5">Марка</label>
            <select
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent-500"
            >
              {carBrands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-900/70 mb-1.5">Модель</label>
            <input
              required
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              placeholder="Camry"
              className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-900/70 mb-1.5">Год выпуска</label>
            <input
              required
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              placeholder="2018"
              inputMode="numeric"
              className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-900/70 mb-1.5">Двигатель</label>
            <input
              required
              value={form.engine}
              onChange={(e) => setForm({ ...form, engine: e.target.value })}
              placeholder="2.5 л, бензин"
              className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-900/70 mb-1.5">Госномер</label>
            <input
              required
              value={form.plate}
              onChange={(e) => setForm({ ...form, plate: e.target.value })}
              placeholder="01KG123ABC"
              className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-900/70 mb-1.5">
              VIN <span className="text-navy-900/40 font-normal">(необязательно)</span>
            </label>
            <input
              value={form.vin}
              onChange={(e) => setForm({ ...form, vin: e.target.value })}
              placeholder="JTDKN3DU..."
              className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>

          <div className="sm:col-span-2 mt-2">
            <button
              type="submit"
              className="rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white hover:bg-accent-600 transition-colors"
            >
              Добавить автомобиль
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-8 space-y-6">
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                <CarIcon size={26} />
              </span>
              <div>
                <h3 className="text-lg font-bold text-navy-900">{car.brand} {car.model}</h3>
                <p className="text-sm text-navy-900/60">
                  {car.year} г. · {car.engine} · Госномер {car.plate}
                </p>
                {car.vin && <p className="text-xs text-navy-900/40 mt-0.5">VIN: {car.vin}</p>}
              </div>
            </div>
            <button
              onClick={clearCar}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-navy-900/50 hover:bg-navy-950/5 transition-colors shrink-0"
              aria-label="Удалить автомобиль"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div>
            <h3 className="text-lg font-bold text-navy-900">Подходит для вашего авто</h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {garageOffers.map((offer) => (
                <div
                  key={offer.label}
                  className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"
                >
                  <p className="text-sm text-navy-900/60">{offer.label}</p>
                  <p className="mt-1 text-2xl font-extrabold text-navy-900">${offer.price}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-600 transition-colors"
              >
                Смотреть каталог товаров <ArrowRight size={15} />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-navy-900 hover:bg-navy-950/5 transition-colors"
              >
                Смотреть услуги СТО <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
