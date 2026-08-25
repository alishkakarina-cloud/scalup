"use client";

import { useEffect, useState } from "react";

interface Balance {
  available: string;
  inProcessing: string;
  paid: string;
}

export default function BalancePage() {
  const [balance, setBalance] = useState<Balance | null>(null);

  useEffect(() => {
    fetch("/api/payouts/balance").then((r) => r.json()).then(setBalance);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-cream">Баланс</h1>
      <p className="mt-1 text-cream/90">Комиссия SCALUP (10%) уже вычтена из сумм ниже — это то, что причитается вам.</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-cream/10 bg-surface-alt p-5">
          <p className="text-sm text-sage-100">Доступно</p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-cream">${balance?.available ?? "…"}</p>
        </div>
        <div className="rounded-2xl border border-cream/10 bg-surface-alt p-5">
          <p className="text-sm text-sage-100">В обработке</p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-cream">${balance?.inProcessing ?? "…"}</p>
        </div>
        <div className="rounded-2xl border border-cream/10 bg-surface-alt p-5">
          <p className="text-sm text-sage-100">Выплачено</p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-cream">${balance?.paid ?? "…"}</p>
        </div>
      </div>
    </div>
  );
}
