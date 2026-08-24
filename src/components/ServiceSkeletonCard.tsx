import { Wrench, MapPin, Phone, CalendarCheck } from "lucide-react";

export function ServiceSkeletonCard() {
  return (
    <div className="flex flex-col rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-4">
      <div className="flex h-32 w-full items-center justify-center rounded-xl bg-white/[0.03] text-paper/20">
        <Wrench size={30} strokeWidth={1.5} />
      </div>

      <div className="mt-3 flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded bg-white/10" />
        <p className="text-sm text-paper/30">Название услуги</p>

        <div className="flex items-baseline gap-1.5 pt-1">
          <span className="text-lg font-bold text-paper/20">от $--</span>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-paper/25">
          <MapPin size={12} strokeWidth={1.5} /> Название СТО · адрес
        </p>
        <p className="text-xs text-paper/20">★ рейтинг СТО</p>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          disabled
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/10 py-2 text-sm font-bold text-paper/25 cursor-not-allowed"
        >
          <CalendarCheck size={14} strokeWidth={1.5} /> Записаться
        </button>
        <button
          disabled
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-paper/20 cursor-not-allowed"
          aria-label="Позвонить"
        >
          <Phone size={15} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
