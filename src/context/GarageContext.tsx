"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Car } from "../types";

interface GarageContextValue {
  car: Car | null;
  setCar: (car: Car) => void;
  clearCar: () => void;
}

const GarageContext = createContext<GarageContextValue | null>(null);
const STORAGE_KEY = "scalup:car";

export function GarageProvider({ children }: { children: ReactNode }) {
  // На сервере (SSR) localStorage недоступен — состояние гидрируется на клиенте.
  const [car, setCarState] = useState<Car | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setCarState(JSON.parse(raw) as Car);
  }, []);

  useEffect(() => {
    if (car) localStorage.setItem(STORAGE_KEY, JSON.stringify(car));
    else localStorage.removeItem(STORAGE_KEY);
  }, [car]);

  const setCar = (next: Car) => setCarState(next);
  const clearCar = () => setCarState(null);

  return (
    <GarageContext.Provider value={{ car, setCar, clearCar }}>
      {children}
    </GarageContext.Provider>
  );
}

export function useGarage() {
  const ctx = useContext(GarageContext);
  if (!ctx) throw new Error("useGarage must be used within GarageProvider");
  return ctx;
}
