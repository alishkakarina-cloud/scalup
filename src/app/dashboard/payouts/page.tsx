"use client";

import { useEffect, useState, type FormEvent } from "react";

interface Balance {
  available: string;
}

interface Payout {
  id: string;
  amount: string;
  status: string;
  requisites: string;
  createdAt: string;
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: "На рассмотрении",
  APPROVED: "Одобрено",
  REJECTED: "Отклонено",
  PAID: "Выплачено",
};

export default function PayoutsPage() {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [requisites, setRequisites] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function load() {
    fetch("/api/payouts/balance").then((r) => r.json()).then(setBalance);
    fetch("/api/payouts").then((r) => r.json()).then((d) => setPayouts(d.payouts ?? []));
  }

  useEffect(load, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/payouts/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requisites }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Не удалось создать заявку");
      setRequisites("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-cream">Выплаты</h1>

      <form onSubmit={handleSubmit} className="mt-6 max-w-md rounded-2xl border border-cream/10 bg-surface-alt p-5 space-y-3">
        <p className="text-sm text-sage-100">Доступно к выводу: <span className="font-extrabold text-cream">${balance?.available ?? "…"}</span></p>
        <p className="text-xs text-sage-100">Минимальная сумма вывода — $500. Заявка выводит весь доступный баланс целиком.</p>
        <input
          required
          value={requisites}
          onChange={(e) => setRequisites(e.target.value)}
          placeholder="Реквизиты для выплаты (карта / счёт)"
          className="w-full rounded-xl border border-cream/15 bg-surface-light px-3.5 py-2.5 text-sm text-cream outline-none focus:border-accent"
        />
        {error && <p className="text-sm text-accent-glow">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-accent py-2.5 text-sm font-bold text-surface hover:bg-accent-hover transition-colors disabled:opacity-60"
        >
          {loading ? "Отправляем…" : "Вывести деньги"}
        </button>
      </form>

      <h2 className="mt-8 text-lg font-extrabold tracking-tight text-cream">История заявок</h2>
      <div className="mt-3 space-y-2">
        {payouts.length === 0 ? (
          <p className="text-sage-100">Заявок пока не было.</p>
        ) : (
          payouts.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4 rounded-xl border border-cream/10 bg-surface-alt px-4 py-3">
              <div>
                <p className="font-bold text-cream">${p.amount}</p>
                <p className="text-xs text-sage-100">{new Date(p.createdAt).toLocaleString("ru-RU")} · {p.requisites}</p>
              </div>
              <span className="rounded-full border border-cream/15 px-2.5 py-1 text-[11px] font-bold text-cream/90 shrink-0">
                {STATUS_LABEL[p.status] ?? p.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
