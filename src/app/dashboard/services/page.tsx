"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { SERVICE_CATEGORIES } from "../../../lib/categories";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: string;
  category: string;
  active: boolean;
}

const inputClass =
  "w-full rounded-xl border border-cream/15 bg-surface-light px-3.5 py-2.5 text-sm text-cream outline-none focus:border-accent transition-colors";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<{ category: string; name: string; price: string; description: string }>({
    category: SERVICE_CATEGORIES[0].slug,
    name: "",
    price: "",
    description: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data) => setServices(data.services ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Не удалось добавить услугу");
      setForm({ category: SERVICE_CATEGORIES[0].slug, name: "", price: "", description: "" });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  }

  async function deactivate(id: string) {
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-cream">Мои услуги</h1>

      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-cream/10 bg-surface-alt p-5">
        <div>
          <label className="block text-sm font-bold text-cream/75 mb-1.5">Категория</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
            {SERVICE_CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug} className="bg-surface-alt">{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-cream/75 mb-1.5">Название услуги</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-bold text-cream/75 mb-1.5">Цена, $</label>
          <input required type="number" min={1} step={0.01} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-bold text-cream/75 mb-1.5">Описание (необязательно)</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={inputClass} />
        </div>
        {error && <p className="sm:col-span-2 text-sm text-accent-glow">{error}</p>}
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-surface hover:bg-accent-hover transition-colors disabled:opacity-60"
          >
            <Plus size={15} /> Добавить услугу
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="text-sage-100">Загрузка…</p>
        ) : services.length === 0 ? (
          <p className="text-sage-100">Вы ещё не добавили ни одной услуги.</p>
        ) : (
          services.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-4 rounded-2xl border border-cream/10 bg-surface-alt p-4">
              <div>
                <p className="font-bold text-cream">{s.name} {!s.active && <span className="text-sage-100 font-normal">(скрыта)</span>}</p>
                {s.description && <p className="text-sm text-sage-100">{s.description}</p>}
                <p className="text-sm text-sage-100">от <span className="text-cream font-extrabold">${s.price}</span></p>
              </div>
              {s.active && (
                <button onClick={() => deactivate(s.id)} className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/75 hover:bg-cream/5 shrink-0" aria-label="Скрыть услугу">
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
