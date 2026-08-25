"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, AlertTriangle, Star } from "lucide-react";
import { orderStatusLabel } from "./OrderStatusBadge";

const NEXT_ACTION: Record<string, string> = {
  NEW: "CONFIRMED",
  CONFIRMED: "PROVIDER_EN_ROUTE",
  PROVIDER_EN_ROUTE: "WORK_STARTED",
  WORK_STARTED: "WORK_COMPLETED",
};

const DISPUTABLE = ["WORK_STARTED", "WORK_COMPLETED", "AWAITING_CLIENT_CONFIRMATION", "PAYOUT", "COMPLETED"];
const CANCELLABLE = ["NEW", "CONFIRMED"];

interface Props {
  orderId: number;
  status: string;
  viewerRole: "CLIENT" | "PROVIDER" | "ADMIN";
  hasDispute: boolean;
  disputeId?: string | null;
  hasReview: boolean;
}

async function post(url: string, body?: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Ошибка запроса");
  return data;
}

export function OrderActions({ orderId, status, viewerRole, hasDispute, disputeId, hasReview }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  async function run(action: () => Promise<unknown>) {
    setError(null);
    setLoading(true);
    try {
      await action();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  }

  const nextAction = viewerRole === "PROVIDER" ? NEXT_ACTION[status] : undefined;

  return (
    <div className="space-y-3">
      {error && (
        <p className="flex items-center gap-1.5 text-sm text-accent-glow">
          <AlertTriangle size={14} /> {error}
        </p>
      )}

      {hasDispute && disputeId && (
        <Link
          href={`/disputes/${disputeId}`}
          className="block rounded-xl border border-cream/15 px-4 py-2.5 text-sm font-bold text-cream hover:bg-cream/5 transition-colors text-center"
        >
          Открыт спор — перейти к деталям
        </Link>
      )}

      {nextAction && (
        <button
          disabled={loading}
          onClick={() => run(() => post(`/api/orders/${orderId}/status`, { action: nextAction }))}
          className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent py-2.5 text-sm font-bold text-cream hover:bg-accent-hover transition-colors disabled:opacity-60"
        >
          {orderStatusLabel(nextAction)} <ArrowRight size={15} />
        </button>
      )}

      {viewerRole === "CLIENT" && status === "AWAITING_CLIENT_CONFIRMATION" && (
        <button
          disabled={loading}
          onClick={() => run(() => post(`/api/orders/${orderId}/confirm`))}
          className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent py-2.5 text-sm font-bold text-cream hover:bg-accent-hover transition-colors disabled:opacity-60"
        >
          Подтвердить выполнение работы <ArrowRight size={15} />
        </button>
      )}

      {CANCELLABLE.includes(status) && (viewerRole === "CLIENT" || viewerRole === "PROVIDER") && (
        <button
          disabled={loading}
          onClick={() => run(() => post(`/api/orders/${orderId}/cancel`))}
          className="w-full rounded-xl border border-cream/15 py-2.5 text-sm font-bold text-cream hover:bg-cream/5 transition-colors disabled:opacity-60"
        >
          Отменить заказ
        </button>
      )}

      {!hasDispute && DISPUTABLE.includes(status) && (viewerRole === "CLIENT" || viewerRole === "PROVIDER") && (
        <>
          {!disputeOpen ? (
            <button
              onClick={() => setDisputeOpen(true)}
              className="w-full rounded-xl border border-cream/15 py-2.5 text-sm font-bold text-cream hover:bg-cream/5 transition-colors"
            >
              Открыть спор
            </button>
          ) : (
            <div className="rounded-xl border border-cream/15 p-4 space-y-3">
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Причина спора"
                className="w-full rounded-lg border border-cream/15 bg-cream/[0.03] px-3 py-2 text-sm text-cream outline-none focus:border-accent"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Опишите проблему подробно"
                rows={3}
                className="w-full rounded-lg border border-cream/15 bg-cream/[0.03] px-3 py-2 text-sm text-cream outline-none focus:border-accent"
              />
              <div className="flex gap-2">
                <button
                  disabled={loading || !reason || description.length < 10}
                  onClick={() =>
                    run(async () => {
                      const data = await post(`/api/orders/${orderId}/dispute`, { reason, description, evidenceUrls: [] });
                      router.push(`/disputes/${data.dispute.id}`);
                    })
                  }
                  className="flex-1 rounded-lg bg-accent py-2 text-sm font-bold text-cream hover:bg-accent-hover disabled:opacity-60"
                >
                  Отправить
                </button>
                <button onClick={() => setDisputeOpen(false)} className="rounded-lg border border-cream/15 px-4 py-2 text-sm text-cream/75">
                  Отмена
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {viewerRole === "CLIENT" && status === "COMPLETED" && !hasReview && (
        <>
          {!reviewOpen ? (
            <button
              onClick={() => setReviewOpen(true)}
              className="w-full rounded-xl border border-cream/15 py-2.5 text-sm font-bold text-cream hover:bg-cream/5 transition-colors"
            >
              Оставить отзыв
            </button>
          ) : (
            <div className="rounded-xl border border-cream/15 p-4 space-y-3">
              <div className="flex gap-1 justify-center">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setRating(n)}>
                    <Star size={22} className={n <= rating ? "fill-cream text-cream" : "text-cream/30"} />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Как всё прошло?"
                rows={3}
                className="w-full rounded-lg border border-cream/15 bg-cream/[0.03] px-3 py-2 text-sm text-cream outline-none focus:border-accent"
              />
              <button
                disabled={loading}
                onClick={() => run(() => post("/api/reviews", { orderId, rating, text: reviewText || undefined }))}
                className="w-full rounded-lg bg-accent py-2 text-sm font-bold text-cream hover:bg-accent-hover disabled:opacity-60"
              >
                Отправить отзыв
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
