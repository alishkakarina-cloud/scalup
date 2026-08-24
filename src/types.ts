export interface Car {
  brand: string;
  model: string;
  year: string;
  engine: string;
  plate: string;
  vin?: string;
}

export type ProductCategory =
  | "Запчасти"
  | "Масла"
  | "Шины"
  | "Аксессуары";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  shop: string;
  district: string;
  inStock: boolean;
  delivery: boolean;
  pickup: boolean;
  brandFit: string;
  icon: string;
}

export type ServiceCategory =
  | "Замена масла"
  | "Диагностика"
  | "Ходовая"
  | "Кондиционер"
  | "Шиномонтаж"
  | "Мойка"
  | "Детейлинг"
  | "Эвакуатор";

export interface ServicePlaceholder {
  id: string;
  category: ServiceCategory;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
}

export interface StoService {
  name: string;
  price: number;
}

export interface Sto {
  id: string;
  name: string;
  description: string;
  address: string;
  hours: string;
  rating: number;
  services: StoService[];
  reviews: Review[];
}

export type CartItem =
  | {
      id: string;
      type: "product";
      name: string;
      price: number;
      shop: string;
      qty: number;
    }
  | {
      id: string;
      type: "service";
      name: string;
      price: number;
      stoName: string;
      qty: number;
    };
