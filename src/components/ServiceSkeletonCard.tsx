import { Wrench, MapPin, Phone, CalendarCheck } from "lucide-react";

export function ServiceSkeletonCard() {
  return (
    <div className="flex flex-col rounded-2xl border border-dashed border-paper/15 bg-paper/[0.02] p-4">
      <div className="flex h-32 w-full items-center justify-center rounded-xl border border-dashed border-paper/10 text-paper/40">
        <Wrench size={30} strokeWidth={1.5} />
      </div>

      <div className="mt-3 flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded bg-paper/10" />
        <p className="text-sm text-paper/60">Название услуги</p>

        <div className="flex items-baseline gap-1.5 pt-1">
          <span className="text-lg font-bold text-paper/60">от $--</span>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-paper/60">
          <MapPin size={12} strokeWidth={1.5} /> Название СТО · адрес
        </p>
        <p className="text-xs text-paper/60">★ рейтинг СТО</p>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          disabled
          aria-disabled="true"
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-paper/15 py-2 text-sm font-bold text-paper/60 cursor-not-allowed"
        >
          <CalendarCheck size={14} strokeWidth={1.5} /> Записаться
        </button>
        <button
          disabled
          aria-disabled="true"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-paper/15 text-paper/60 cursor-not-allowed"
          aria-label="Позвонить"
        >
          <Phone size={15} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
