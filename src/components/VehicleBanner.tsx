"use client";

import { useState } from "react";
import Link from "next/link";
import { Car as CarIcon, ChevronDown } from "lucide-react";
import { useGarage } from "../context/GarageContext";

/** Плашка выбранного авто из "Моего гаража" — переиспользуется на /catalog и /services. */
export function VehicleBanner({ contextLabel }: { contextLabel: string }) {
  const { vehicles, selectedVehicle, selectVehicle, loading } = useGarage();
  const [switcherOpen, setSwitcherOpen] = useState(false);

  if (loading) return null;

  return (
    <div className="relative flex flex-wrap items-center gap-3 rounded-xl border border-cream/10 bg-surface-alt px-4 py-3 text-sm">
      <CarIcon size={16} strokeWidth={1.75} className="text-cream/75 shrink-0" />
      {selectedVehicle ? (
        <>
          <span className="text-cream/90">
            {contextLabel} <span className="font-bold text-cream">{selectedVehicle.brand} {selectedVehicle.model} {selectedVehicle.year}</span>
          </span>
          <div className="relative ml-auto">
            <button
              onClick={() => setSwitcherOpen((v) => !v)}
              className="inline-flex items-center gap-1 rounded-lg border border-cream/15 px-3 py-1.5 text-xs font-bold text-cream hover:bg-cream/5 transition-colors"
            >
              Изменить авто <ChevronDown size={13} strokeWidth={2.5} />
            </button>
            {switcherOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-xl border border-cream/10 bg-surface-alt p-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                {vehicles.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => { selectVehicle(v.id); setSwitcherOpen(false); }}
                    className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      v.id === selectedVehicle.id ? "bg-accent/15 text-cream font-bold" : "text-cream/90 hover:bg-cream/5"
                    }`}
                  >
                    {v.brand} {v.model}
                  </button>
                ))}
                <Link
                  href="/garage"
                  className="block rounded-lg px-3 py-2 text-sm text-sage-100 hover:bg-cream/5 transition-colors border-t border-cream/10 mt-1 pt-2.5"
                >
                  + Добавить авто
                </Link>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <span className="text-cream/90">Добавьте авто, чтобы видеть подходящие товары и услуги</span>
          <Link
            href="/garage"
            className="ml-auto inline-flex items-center gap-1 rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-surface hover:bg-accent-hover transition-colors shrink-0"
          >
            Добавить авто
          </Link>
        </>
      )}
    </div>
  );
}
