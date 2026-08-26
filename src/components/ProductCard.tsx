import { MapPin, Truck, Store as StoreIcon, MessageCircle, ArrowRight, ShieldCheck } from "lucide-react";
import type { Product } from "../types";
import { IconTile } from "./IconTile";
import { useCart } from "../context/CartContext";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="card-lift flex h-full flex-col rounded-2xl border border-cream/10 bg-surface-alt p-4 hover:border-accent/30">
      <div className="relative h-36 w-full overflow-hidden rounded-xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl"
          style={{
            background: "radial-gradient(circle, #F5F5F5 0%, #A8A8AC 45%, rgba(168,168,172,0) 75%)",
          }}
        />
        <IconTile iconName={product.icon} seed={product.id} className="relative h-full w-full" size={40} />
        <div className="vignette rounded-xl" />
        <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(245,245,245,0.85)]">
          <ShieldCheck size={13} strokeWidth={2} className="text-surface" />
        </span>
      </div>

      <div className="mt-3 flex-1">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-sage-200">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {product.category}
        </span>
        <h3 className="font-display mt-1.5 text-cream leading-snug">{product.name}</h3>
        <p className="mt-0.5 text-xs text-sage-100">Подходит: {product.brandFit}</p>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-extrabold tracking-tight text-cream">${product.price}</span>
          <span className="inline-flex items-center gap-1.5 text-xs text-sage-100">
            <span className={`h-1.5 w-1.5 rounded-full ${product.inStock ? "bg-accent" : "bg-cream/20"}`} />
            {product.inStock ? "в наличии" : "под заказ"}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-sage-100">
          <span className="inline-flex items-center gap-1">
            <StoreIcon size={13} strokeWidth={1.5} /> {product.shop}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} strokeWidth={1.5} /> {product.district}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {product.pickup && (
            <span className="rounded-full border border-cream/10 px-2 py-0.5 text-[11px] text-sage-100">
              Самовывоз
            </span>
          )}
          {product.delivery && (
            <span className="inline-flex items-center gap-1 rounded-full border border-cream/10 px-2 py-0.5 text-[11px] text-sage-100">
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
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent py-2 text-sm font-bold text-surface hover:bg-accent-hover transition-colors"
        >
          Купить
          <ArrowRight size={14} strokeWidth={2.5} />
        </button>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/75 hover:bg-cream/5 transition-colors"
          aria-label="Написать продавцу"
        >
          <MessageCircle size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
