"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Car as CarIcon, Trash2, ArrowRight, Plus, Check } from "lucide-react";
import { useGarage } from "../../context/GarageContext";
import { carBrands } from "../../data/mock";

const inputClass =
  "w-full rounded-xl border border-cream/15 bg-surface-light px-3.5 py-2.5 text-sm text-cream outline-none focus:border-accent transition-colors";

const emptyForm = { brand: carBrands[0], model: "", year: "", engine: "", plate: "", vin: "" };

export default function GaragePage() {
  const { vehicles, loading, selectedVehicleId, selectVehicle, refresh } = useGarage();
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isValid = Boolean(form.model && form.year && form.engine && form.plate);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Не удалось добавить автомобиль");
      await refresh();
      selectVehicle(data.vehicle.id);
      setForm(emptyForm);
      setFormOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
      await refresh();
      if (selectedVehicleId === id) selectVehicle(null);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-cream">Мой гараж</h1>
      <p className="mt-2 text-cream/90">
        Добавьте свои автомобили, чтобы видеть подходящие товары и услуги — и быстро переключаться между ними.
      </p>

      {loading ? (
        <div className="mt-8 h-32 animate-pulse rounded-2xl border border-cream/10 bg-surface-alt" />
      ) : (
        <div className="mt-8 space-y-3">
          {vehicles.map((v) => {
            const active = v.id === selectedVehicleId;
            return (
              <div
                key={v.id}
                className={`card-lift flex items-center justify-between gap-4 rounded-2xl border p-5 ${
                  active ? "border-accent/50 bg-surface-alt" : "border-cream/10 bg-surface-alt"
                }`}
              >
                <button
                  onClick={() => selectVehicle(v.id)}
                  className="flex flex-1 items-center gap-4 text-left"
                >
                  <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent text-surface">
                    <CarIcon size={26} strokeWidth={1.5} />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-extrabold tracking-tight text-cream">{v.brand} {v.model}</h3>
                      {active && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-bold text-cream">
                          <Check size={11} strokeWidth={2.5} /> Активно
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-sage-100">
                      {v.year} г. · {v.engine} · Госномер {v.plate}
                    </p>
                    {v.vin && <p className="text-xs text-cream/75 mt-0.5">VIN: {v.vin}</p>}
                  </div>
                </button>
                <button
                  onClick={() => handleDelete(v.id)}
                  disabled={deletingId === v.id}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cream/15 text-cream/75 hover:bg-cream/5 transition-colors disabled:opacity-50"
                  aria-label="Удалить автомобиль"
                >
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              </div>
            );
          })}

          {!formOpen ? (
            <button
              onClick={() => setFormOpen(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-cream/20 p-5 text-sm font-bold text-cream/90 hover:border-accent/40 hover:bg-cream/5 transition-colors"
            >
              <Plus size={16} strokeWidth={2.5} />
              Добавить автомобиль
            </button>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-cream/10 bg-surface-alt p-6"
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
                <input required value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="Camry" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-bold text-cream/75 mb-1.5">Год выпуска</label>
                <input required value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2018" inputMode="numeric" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-bold text-cream/75 mb-1.5">Двигатель</label>
                <input required value={form.engine} onChange={(e) => setForm({ ...form, engine: e.target.value })} placeholder="2.5 л, бензин" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-bold text-cream/75 mb-1.5">Госномер</label>
                <input required value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} placeholder="01KG123ABC" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-bold text-cream/75 mb-1.5">
                  VIN <span className="text-cream/75 font-normal">(необязательно)</span>
                </label>
                <input value={form.vin} onChange={(e) => setForm({ ...form, vin: e.target.value })} placeholder="JTDKN3DU..." className={inputClass} />
              </div>

              {error && <p className="sm:col-span-2 text-sm text-accent-glow">{error}</p>}

              <div className="sm:col-span-2 mt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={!isValid || saving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-surface hover:bg-accent-hover transition-colors disabled:bg-cream/10 disabled:text-cream/30 disabled:hover:bg-cream/10"
                >
                  {saving ? "Сохраняем…" : "Добавить автомобиль"}
                  <ArrowRight size={15} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => { setFormOpen(false); setError(null); }}
                  className="rounded-xl border border-cream/15 px-6 py-3 text-sm font-bold text-cream/90 hover:bg-cream/5 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          )}

          {vehicles.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-surface hover:bg-accent-hover transition-colors"
              >
                Смотреть каталог товаров <ArrowRight size={15} strokeWidth={2.5} />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 rounded-xl border border-cream/15 px-5 py-2.5 text-sm font-bold text-cream hover:bg-cream/5 transition-colors"
              >
                Найти услугу <ArrowRight size={15} strokeWidth={2.5} />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
