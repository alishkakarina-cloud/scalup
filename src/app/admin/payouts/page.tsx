"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

interface Payout {
  id: string;
  amount: string;
  status: string;
  requisites: string;
  createdAt: string;
  provider: { businessName: string };
  orders: { id: number; code: string }[];
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: "На рассмотрении",
  APPROVED: "Одобрено",
  REJECTED: "Отклонено",
  PAID: "Выплачено",
};

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  function load() {
    fetch("/api/payouts").then((r) => r.json()).then((d) => setPayouts(d.payouts ?? []));
  }
  useEffect(load, []);

  async function act(id: string, action: "approve" | "reject") {
    setBusy(id);
    await fetch(`/api/payouts/${id}/${action}`, { method: "POST" });
    setBusy(null);
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-cream">Заявки на выплату</h1>
      <div className="mt-6 space-y-3">
        {payouts.length === 0 ? (
          <p className="text-sage-100">Заявок нет.</p>
        ) : (
          payouts.map((p) => (
            <div key={p.id} className="rounded-2xl border border-cream/10 bg-surface-alt p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-cream">{p.provider.businessName} · ${p.amount}</p>
                  <p className="text-xs text-sage-100 mt-0.5">
                    {new Date(p.createdAt).toLocaleString("ru-RU")} · реквизиты: {p.requisites}
                  </p>
                  <p className="text-xs text-sage-100 mt-0.5">Заказы: {p.orders.map((o) => o.code).join(", ")}</p>
                </div>
                <span className="rounded-full border border-cream/15 px-2.5 py-1 text-[11px] font-bold text-cream/90 shrink-0">
                  {STATUS_LABEL[p.status] ?? p.status}
                </span>
              </div>
              {p.status === "PENDING" && (
                <div className="mt-3 flex gap-2">
                  <button
                    disabled={busy === p.id}
                    onClick={() => act(p.id, "approve")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-bold text-cream hover:bg-accent-hover disabled:opacity-60"
                  >
                    <Check size={14} /> Одобрить и выплатить
                  </button>
                  <button
                    disabled={busy === p.id}
                    onClick={() => act(p.id, "reject")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-cream/15 px-4 py-2 text-sm font-bold text-cream hover:bg-cream/5 disabled:opacity-60"
                  >
                    <X size={14} /> Отклонить
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
