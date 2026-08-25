"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import type { CurrentUser } from "../lib/useCurrentUser";

interface ServiceOption {
  id: string;
  name: string;
  price: string;
}

interface Vehicle {
  id: string;
  brand: string;
  model: string;
}

const inputClass =
  "w-full rounded-xl border border-cream/15 bg-cream/[0.03] px-3.5 py-2.5 text-sm text-cream outline-none focus:border-accent transition-colors";

export function BookingForm({ services, user }: { services: ServiceOption[]; user: CurrentUser | null }) {
  const router = useRouter();
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [vehicleId, setVehicleId] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === "CLIENT") {
      fetch("/api/vehicles")
        .then((r) => r.json())
        .then((data) => setVehicles(data.vehicles ?? []))
        .catch(() => {});
    }
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!user) {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (user.role !== "CLIENT") {
      setError("Заказать услугу может только клиент — войдите под аккаунтом клиента");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          vehicleId: vehicleId || undefined,
          scheduledDate,
          scheduledTime,
          address,
          comment: comment || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Не удалось создать заказ");
      setSuccess(data.order.code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-cream/10 bg-surface-alt p-5 text-center">
        <p className="text-lg font-extrabold tracking-tight text-cream">Заказ {success} создан!</p>
        <p className="mt-1 text-sm text-sage-100">Средства заморожены (тестовый режим). Следите за статусом в личном кабинете.</p>
        <button
          onClick={() => router.push("/account/orders")}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-cream hover:bg-accent-hover transition-colors"
        >
          Мои заказы <ArrowRight size={15} strokeWidth={2.5} />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-cream/10 bg-surface-alt p-5">
      <h3 className="font-extrabold tracking-tight text-cream">Записаться</h3>

      <div>
        <label className="block text-sm font-bold text-cream/75 mb-1.5">Услуга</label>
        <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} className={inputClass} required>
          {services.map((s) => (
            <option key={s.id} value={s.id} className="bg-surface-alt">
              {s.name} — от ${s.price}
            </option>
          ))}
        </select>
      </div>

      {user?.role === "CLIENT" && vehicles.length > 0 && (
        <div>
          <label className="block text-sm font-bold text-cream/75 mb-1.5">
            Автомобиль <span className="text-cream/75 font-normal">(необязательно)</span>
          </label>
          <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} className={inputClass}>
            <option value="" className="bg-surface-alt">Не указывать</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id} className="bg-surface-alt">
                {v.brand} {v.model}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-bold text-cream/75 mb-1.5">Дата</label>
          <input required type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-bold text-cream/75 mb-1.5">Время</label>
          <input required type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-cream/75 mb-1.5">Адрес</label>
        <input required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Куда приехать / где вы находитесь" className={inputClass} />
      </div>

      <div>
        <label className="block text-sm font-bold text-cream/75 mb-1.5">
          Комментарий <span className="text-cream/75 font-normal">(необязательно)</span>
        </label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={2} className={inputClass} />
      </div>

      {error && <p className="text-sm text-accent-glow">{error}</p>}

      <button
        type="submit"
        disabled={loading || !serviceId}
        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent py-3 text-sm font-bold text-cream hover:bg-accent-hover transition-colors disabled:opacity-60"
      >
        {loading ? "Оформляем…" : "Записаться"}
        <ArrowRight size={15} strokeWidth={2.5} />
      </button>
      <p className="text-center text-xs text-cream/75">
        Оплата тестовая (mock) — комиссия SCALUP 10% рассчитывается автоматически.
      </p>
    </form>
  );
}
