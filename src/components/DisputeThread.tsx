"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  disputeId: string;
  isAdmin: boolean;
  resolved: boolean;
  orderAmount: string;
}

export function DisputeThread({ disputeId, isAdmin, resolved, orderAmount }: Props) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [resolution, setResolution] = useState<"FULL_REFUND_CLIENT" | "FULL_PAY_PROVIDER" | "SPLIT">("FULL_REFUND_CLIENT");
  const [clientRefundAmount, setClientRefundAmount] = useState("");
  const [providerPayAmount, setProviderPayAmount] = useState("");
  const [note, setNote] = useState("");

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/disputes/${disputeId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, evidenceUrls: [] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Не удалось отправить сообщение");
      setText("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  }

  async function resolveDispute(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const body: Record<string, unknown> = { resolution, note };
      if (resolution === "SPLIT") {
        body.clientRefundAmount = Number(clientRefundAmount);
        body.providerPayAmount = Number(providerPayAmount);
      }
      const res = await fetch(`/api/disputes/${disputeId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Не удалось разрешить спор");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {!resolved && (
        <form onSubmit={sendMessage} className="rounded-2xl border border-cream/10 bg-surface-alt p-4 space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ваш ответ / доказательства…"
            rows={3}
            className="w-full rounded-lg border border-cream/15 bg-surface-light px-3 py-2 text-sm text-cream outline-none focus:border-accent"
          />
          <button disabled={loading} className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-surface hover:bg-accent-hover disabled:opacity-60">
            Отправить
          </button>
        </form>
      )}

      {isAdmin && !resolved && (
        <form onSubmit={resolveDispute} className="rounded-2xl border border-cream/10 bg-surface-alt p-4 space-y-3">
          <h3 className="font-extrabold tracking-tight text-cream">Решение администратора</h3>
          <p className="text-xs text-sage-100">Сумма заказа: ${orderAmount}</p>
          <div className="flex flex-col gap-2">
            {[
              { value: "FULL_REFUND_CLIENT", label: "Вернуть 100% клиенту" },
              { value: "FULL_PAY_PROVIDER", label: "Выплатить исполнителю полностью" },
              { value: "SPLIT", label: "Разделить сумму" },
            ].map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm text-cream/90">
                <input
                  type="radio"
                  name="resolution"
                  checked={resolution === opt.value}
                  onChange={() => setResolution(opt.value as typeof resolution)}
                  className="accent-accent"
                />
                {opt.label}
              </label>
            ))}
          </div>
          {resolution === "SPLIT" && (
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                step="0.01"
                placeholder="Клиенту"
                value={clientRefundAmount}
                onChange={(e) => setClientRefundAmount(e.target.value)}
                className="rounded-lg border border-cream/15 bg-surface-light px-3 py-2 text-sm text-cream outline-none focus:border-accent"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Исполнителю"
                value={providerPayAmount}
                onChange={(e) => setProviderPayAmount(e.target.value)}
                className="rounded-lg border border-cream/15 bg-surface-light px-3 py-2 text-sm text-cream outline-none focus:border-accent"
              />
            </div>
          )}
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Комментарий к решению (необязательно)"
            className="w-full rounded-lg border border-cream/15 bg-surface-light px-3 py-2 text-sm text-cream outline-none focus:border-accent"
          />
          <button disabled={loading} className="w-full rounded-lg bg-accent py-2.5 text-sm font-bold text-surface hover:bg-accent-hover disabled:opacity-60">
            Разрешить спор
          </button>
        </form>
      )}

      {error && <p className="text-sm text-accent-glow">{error}</p>}
    </div>
  );
}
