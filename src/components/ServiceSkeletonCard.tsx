import { Wrench, MapPin, Phone, CalendarCheck } from "lucide-react";

export function ServiceSkeletonCard() {
  return (
    <div className="flex flex-col rounded-2xl border border-dashed border-black/15 bg-navy-950/[0.02] p-4">
      <div className="flex h-32 w-full items-center justify-center rounded-xl bg-black/5 text-navy-900/25">
        <Wrench size={30} strokeWidth={1.5} />
      </div>

      <div className="mt-3 flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded bg-black/10" />
        <p className="text-sm text-navy-900/40">Название услуги</p>

        <div className="flex items-baseline gap-1.5 pt-1">
          <span className="text-lg font-extrabold text-navy-900/25">от $--</span>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-navy-900/35">
          <MapPin size={12} /> Название СТО · адрес
        </p>
        <p className="text-xs text-navy-900/30">★ рейтинг СТО</p>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          disabled
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-black/10 py-2 text-sm font-semibold text-navy-900/35 cursor-not-allowed"
        >
          <CalendarCheck size={14} /> Записаться
        </button>
        <button
          disabled
          className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-navy-900/30 cursor-not-allowed"
          aria-label="Позвонить"
        >
          <Phone size={15} />
        </button>
      </div>
    </div>
  );
}
