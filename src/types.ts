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
  model?: string;
  icon: string;
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
