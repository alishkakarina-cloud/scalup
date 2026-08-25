const LABELS: Record<string, string> = {
  NEW: "Новый",
  CONFIRMED: "Подтверждён",
  PROVIDER_EN_ROUTE: "Исполнитель в пути",
  WORK_STARTED: "Работа начата",
  WORK_COMPLETED: "Работа завершена",
  AWAITING_CLIENT_CONFIRMATION: "Ожидает подтверждения клиента",
  PAYOUT: "Выплата",
  COMPLETED: "Завершён",
  CANCELLED: "Отменён",
  DISPUTED: "Спор",
};

export function orderStatusLabel(status: string) {
  return LABELS[status] ?? status;
}

export function OrderStatusBadge({ status }: { status: string }) {
  const isTerminalGood = status === "COMPLETED";
  const isBad = status === "CANCELLED" || status === "DISPUTED";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${
        isBad
          ? "bg-accent/15 text-cream"
          : isTerminalGood
            ? "bg-cream/15 text-cream"
            : "border border-cream/15 text-cream/90"
      }`}
    >
      {orderStatusLabel(status)}
    </span>
  );
}
