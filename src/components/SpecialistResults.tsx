"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Star, ShieldCheck, MapPin, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { useGarage } from "../context/GarageContext";
import { DISTRICTS, districtDistanceKm, formatDistance, type District } from "../lib/districtDistance";
import { formatDuration } from "../lib/format";

export interface MatchedProvider {
  id: string;
  businessName: string;
  verified: boolean;
  district: string | null;
  ratingAvg: number;
  reviewCount: number;
  service: { id: string; price: string; durationMinutes: number | null } | null;
}

export function SpecialistResults({
  categoryLabel,
  providers,
}: {
  categoryLabel: string;
  providers: MatchedProvider[];
}) {
  const { selectedVehicle } = useGarage();
  const [myDistrict, setMyDistrict] = useState<District>(DISTRICTS[0]);

  const ranked = useMemo(() => {
    return providers
      .map((p) => ({ ...p, distanceKm: districtDistanceKm(myDistrict, p.district) }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [providers, myDistrict]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Link href="/services" className="inline-flex items-center gap-1 text-xs font-bold text-sage-100 hover:text-cream transition-colors">
            <ArrowLeft size={13} strokeWidth={2.5} /> Назад к категориям
          </Link>
          <h1 className="font-display mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-cream">
            Специалисты: {categoryLabel}
          </h1>
          <p className="mt-1 text-cream/90">
            Найдено {ranked.length} {ranked.length === 1 ? "исполнитель" : "исполнителей"}
            {selectedVehicle ? <> для <span className="font-bold text-cream">{selectedVehicle.brand} {selectedVehicle.model}</span></> : null}
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <span className="text-sage-100">Ваш район:</span>
          <select
            value={myDistrict}
            onChange={(e) => setMyDistrict(e.target.value as District)}
            className="rounded-xl border border-cream/15 bg-surface-light px-3 py-2 text-sm text-cream outline-none focus:border-accent transition-colors"
          >
            {DISTRICTS.map((d) => (
              <option key={d} value={d} className="bg-surface-alt">{d}</option>
            ))}
          </select>
        </label>
      </div>

      {ranked.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-cream/15 p-12 text-center text-cream/90">
          Пока нет исполнителей по категории «{categoryLabel}».
          <div className="mt-4">
            <Link
              href="/providers"
              className="inline-flex items-center gap-1.5 rounded-xl border border-cream/15 px-5 py-2.5 text-sm font-bold text-cream hover:bg-cream/5 transition-colors"
            >
              Смотреть всех исполнителей <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {ranked.map((p, i) => (
            <div
              key={p.id}
              className="reveal card-lift flex flex-col rounded-2xl border border-cream/10 bg-surface-alt p-5"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-extrabold tracking-tight text-cream">{p.businessName}</h3>
                {p.verified && (
                  <span className="flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-bold text-cream shrink-0">
                    <ShieldCheck size={12} /> Проверенный
                  </span>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-sage-100">Цена от</p>
                  <p className="mt-0.5 font-display text-lg text-cream">
                    {p.service ? `$${p.service.price}` : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-sage-100">Рейтинг</p>
                  <p className="mt-0.5 flex items-center gap-1 font-bold text-cream">
                    <Star size={14} className="fill-cream text-cream" /> {p.ratingAvg.toFixed(1)}
                    <span className="text-xs font-normal text-sage-100">({p.reviewCount})</span>
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-sage-100">Расстояние</p>
                  <p className="mt-0.5 flex items-center gap-1 font-bold text-cream">
                    <MapPin size={13} strokeWidth={1.75} /> {formatDistance(p.distanceKm)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-sage-100">Время</p>
                  <p className="mt-0.5 flex items-center gap-1 font-bold text-cream">
                    <Clock size={13} strokeWidth={1.75} /> {formatDuration(p.service?.durationMinutes)}
                  </p>
                </div>
              </div>

              <Link
                href={`/providers/${p.id}${p.service ? `?serviceId=${p.service.id}` : ""}`}
                className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent py-2.5 text-sm font-bold text-surface hover:bg-accent-hover transition-colors"
              >
                Выбрать <ArrowRight size={15} strokeWidth={2.5} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
