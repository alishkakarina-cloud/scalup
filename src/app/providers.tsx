"use client";

import type { ReactNode } from "react";
import { CartProvider } from "../context/CartContext";
import { GarageProvider } from "../context/GarageContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <GarageProvider>
      <CartProvider>{children}</CartProvider>
    </GarageProvider>
  );
}
