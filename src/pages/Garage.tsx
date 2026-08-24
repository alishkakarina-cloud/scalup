import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Car as CarIcon, Trash2, ArrowRight } from "lucide-react";
import { useGarage } from "../context/GarageContext";
import { garageOffers, carBrands } from "../data/mock";

const inputClass =
  "w-full rounded-xl border border-paper/15 bg-paper/[0.03] px-3.5 py-2.5 text-sm text-paper outline-none focus:border-lime-500 transition-colors";

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
      <h1 className="text-2xl sm:text-3xl font-bold text-paper">Мой гараж</h1>
      <p className="mt-2 text-paper/60">
        Добавьте свой автомобиль, чтобы видеть подходящие товары и услуги.
      </p>

      {!car ? (
        <form
          onSubmit={handleSubmit}
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-paper/10 bg-ink-900 p-6"
        >
          <div>
            <label className="block text-sm font-bold text-paper/60 mb-1.5">Марка</label>
            <select
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className={inputClass}
            >
              {carBrands.map((b) => (
                <option key={b} value={b} className="bg-ink-900">{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-paper/60 mb-1.5">Модель</label>
            <input
              required
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              placeholder="Camry"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-paper/60 mb-1.5">Год выпуска</label>
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
            <label className="block text-sm font-bold text-paper/60 mb-1.5">Двигатель</label>
            <input
              required
              value={form.engine}
              onChange={(e) => setForm({ ...form, engine: e.target.value })}
              placeholder="2.5 л, бензин"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-paper/60 mb-1.5">Госномер</label>
            <input
              required
              value={form.plate}
              onChange={(e) => setForm({ ...form, plate: e.target.value })}
              placeholder="01KG123ABC"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-paper/60 mb-1.5">
              VIN <span className="text-paper/60 font-normal">(необязательно)</span>
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
              className="inline-flex items-center gap-1.5 rounded-xl bg-lime-500 px-6 py-3 text-sm font-bold text-ink-950 hover:bg-lime-600 transition-colors disabled:bg-paper/10 disabled:text-paper/30 disabled:hover:bg-paper/10"
            >
              Добавить автомобиль
              <ArrowRight size={15} strokeWidth={2.5} />
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-8 space-y-6">
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-paper/10 bg-ink-900 p-6">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-paper/10 text-lime-500">
                <CarIcon size={26} strokeWidth={1.5} />
              </span>
              <div>
                <h3 className="text-lg font-bold text-paper">{car.brand} {car.model}</h3>
                <p className="text-sm text-paper/60">
                  {car.year} г. · {car.engine} · Госномер {car.plate}
                </p>
                {car.vin && <p className="text-xs text-paper/60 mt-0.5">VIN: {car.vin}</p>}
              </div>
            </div>
            <button
              onClick={clearCar}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/15 text-paper/60 hover:bg-paper/5 transition-colors shrink-0"
              aria-label="Удалить автомобиль"
            >
              <Trash2 size={16} strokeWidth={1.5} />
            </button>
          </div>

          <div>
            <h3 className="text-lg font-bold text-paper">Подходит для вашего авто</h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {garageOffers.map((offer) => (
                <div
                  key={offer.label}
                  className="rounded-2xl border border-paper/10 bg-ink-900 p-5 transition-all hover:border-lime-500/30 hover:shadow-[0_0_32px_-10px_rgba(183,229,0,0.35)]"
                >
                  <p className="text-sm text-paper/60">{offer.label}</p>
                  <p className="mt-1 text-2xl font-bold text-lime-500">${offer.price}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-1.5 rounded-xl bg-lime-500 px-5 py-2.5 text-sm font-bold text-ink-950 hover:bg-lime-600 transition-colors"
              >
                Смотреть каталог товаров <ArrowRight size={15} strokeWidth={2.5} />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-1.5 rounded-xl border border-paper/15 px-5 py-2.5 text-sm font-bold text-paper hover:bg-paper/5 transition-colors"
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
