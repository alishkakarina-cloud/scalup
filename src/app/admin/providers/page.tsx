"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, ShieldOff } from "lucide-react";

interface ProviderRow {
  id: string;
  businessName: string;
  city: string | null;
  verified: boolean;
  ratingAvg: number;
}

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<ProviderRow[]>([]);

  function load() {
    fetch("/api/admin/providers").then((r) => r.json()).then((d) => setProviders(d.providers ?? []));
  }
  useEffect(load, []);

  async function toggleVerify(id: string, verified: boolean) {
    await fetch(`/api/admin/providers/${id}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified: !verified }),
    });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-cream">Исполнители</h1>
      <div className="mt-6 space-y-2">
        {providers.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-4 rounded-xl border border-cream/10 bg-surface-alt px-4 py-3">
            <div>
              <p className="font-bold text-cream text-sm">{p.businessName}</p>
              <p className="text-xs text-sage-100">{p.city ?? "город не указан"} · рейтинг {p.ratingAvg.toFixed(1)}</p>
            </div>
            <button
              onClick={() => toggleVerify(p.id, p.verified)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                p.verified ? "bg-accent/15 text-cream" : "border border-cream/15 text-cream/75 hover:bg-cream/5"
              }`}
            >
              {p.verified ? <ShieldCheck size={14} /> : <ShieldOff size={14} />}
              {p.verified ? "Проверенный" : "Подтвердить"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
