"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: string;
  engine: string;
  plate: string;
  vin: string | null;
}

interface GarageContextValue {
  vehicles: Vehicle[];
  loading: boolean;
  selectedVehicleId: string | null;
  selectedVehicle: Vehicle | null;
  selectVehicle: (id: string | null) => void;
  refresh: () => Promise<void>;
}

const GarageContext = createContext<GarageContextValue | null>(null);
const SELECTED_KEY = "scalup:selectedVehicleId";

// Гараж хранится в базе данных (Vehicle, привязан к вошедшему клиенту) — этот
// контекст лишь кеширует список в памяти вкладки и запоминает, какое авто
// сейчас "активно" для фильтров каталога/услуг (сам выбор — только localStorage,
// не персональные данные). Для неавторизованных /api/vehicles вернёт 401 —
// это ожидаемо, гараж в таком случае просто пуст.
export function GarageProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/vehicles");
      if (!res.ok) {
        setVehicles([]);
        return;
      }
      const data = await res.json();
      const list: Vehicle[] = data.vehicles ?? [];
      setVehicles(list);
    } catch {
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setSelectedVehicleId(localStorage.getItem(SELECTED_KEY));
    refresh();
  }, [refresh]);

  // Если сохранённого выбора нет или он больше не существует — берём первое авто.
  useEffect(() => {
    if (loading) return;
    if (vehicles.length === 0) return;
    if (selectedVehicleId && vehicles.some((v) => v.id === selectedVehicleId)) return;
    setSelectedVehicleId(vehicles[0].id);
  }, [vehicles, loading, selectedVehicleId]);

  const selectVehicle = (id: string | null) => {
    setSelectedVehicleId(id);
    if (id) localStorage.setItem(SELECTED_KEY, id);
    else localStorage.removeItem(SELECTED_KEY);
  };

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) ?? null;

  return (
    <GarageContext.Provider value={{ vehicles, loading, selectedVehicleId, selectedVehicle, selectVehicle, refresh }}>
      {children}
    </GarageContext.Provider>
  );
}

export function useGarage() {
  const ctx = useContext(GarageContext);
  if (!ctx) throw new Error("useGarage must be used within GarageProvider");
  return ctx;
}
