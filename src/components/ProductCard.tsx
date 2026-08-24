import { MapPin, Truck, Store as StoreIcon, MessageCircle } from "lucide-react";
import type { Product } from "../types";
import { IconTile } from "./IconTile";
import { useCart } from "../context/CartContext";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="flex flex-col rounded-2xl border border-black/5 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <IconTile iconName={product.icon} seed={product.id} className="h-36 w-full" size={40} />

      <div className="mt-3 flex-1">
        <h3 className="font-semibold text-navy-900 leading-snug">{product.name}</h3>
        <p className="mt-1 text-xs text-navy-900/50">Подходит: {product.brandFit}</p>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-navy-900">${product.price}</span>
          {!product.inStock && (
            <span className="text-xs font-medium text-rose-600">под заказ</span>
          )}
          {product.inStock && (
            <span className="text-xs font-medium text-emerald-600">в наличии</span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-navy-900/60">
          <span className="inline-flex items-center gap-1">
            <StoreIcon size={13} /> {product.shop}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} /> {product.district}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {product.pickup && (
            <span className="rounded-full bg-navy-950/5 px-2 py-0.5 text-[11px] font-medium text-navy-900/70">
              Самовывоз
            </span>
          )}
          {product.delivery && (
            <span className="inline-flex items-center gap-1 rounded-full bg-navy-950/5 px-2 py-0.5 text-[11px] font-medium text-navy-900/70">
              <Truck size={11} /> Доставка
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() =>
            addItem({ id: product.id, type: "product", name: product.name, price: product.price, shop: product.shop })
          }
          className="flex-1 rounded-full bg-accent-500 py-2 text-sm font-semibold text-white hover:bg-accent-600 transition-colors"
        >
          Купить
        </button>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-navy-900/70 hover:bg-navy-950/5 transition-colors"
          aria-label="Написать продавцу"
        >
          <MessageCircle size={16} />
        </button>
      </div>
    </div>
  );
}
