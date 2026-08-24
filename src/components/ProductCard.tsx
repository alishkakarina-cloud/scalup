import { MapPin, Truck, Store as StoreIcon, MessageCircle, ArrowRight } from "lucide-react";
import type { Product } from "../types";
import { IconTile } from "./IconTile";
import { useCart } from "../context/CartContext";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="flex h-full flex-col rounded-2xl border border-paper/10 bg-ink-900 p-4 transition-all hover:border-lime-500/30 hover:shadow-[0_0_32px_-10px_rgba(183,229,0,0.35)]">
      <IconTile iconName={product.icon} seed={product.id} className="h-36 w-full" size={40} />

      <div className="mt-3 flex-1">
        <h3 className="font-bold text-paper leading-snug">{product.name}</h3>
        <p className="mt-1 text-xs text-paper/60">Подходит: {product.brandFit}</p>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-bold text-lime-500">${product.price}</span>
          <span className="inline-flex items-center gap-1.5 text-xs text-paper/60">
            <span className={`h-1.5 w-1.5 rounded-full ${product.inStock ? "bg-lime-500" : "bg-paper/20"}`} />
            {product.inStock ? "в наличии" : "под заказ"}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-paper/60">
          <span className="inline-flex items-center gap-1">
            <StoreIcon size={13} strokeWidth={1.5} /> {product.shop}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} strokeWidth={1.5} /> {product.district}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {product.pickup && (
            <span className="rounded-full border border-paper/10 px-2 py-0.5 text-[11px] text-paper/60">
              Самовывоз
            </span>
          )}
          {product.delivery && (
            <span className="inline-flex items-center gap-1 rounded-full border border-paper/10 px-2 py-0.5 text-[11px] text-paper/60">
              <Truck size={11} strokeWidth={1.5} /> Доставка
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() =>
            addItem({ id: product.id, type: "product", name: product.name, price: product.price, shop: product.shop })
          }
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-lime-500 py-2 text-sm font-bold text-ink-950 hover:bg-lime-600 transition-colors"
        >
          Купить
          <ArrowRight size={14} strokeWidth={2.5} />
        </button>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/15 text-paper/60 hover:bg-paper/5 transition-colors"
          aria-label="Написать продавцу"
        >
          <MessageCircle size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
