import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart, CheckCircle2, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useGarage } from "../context/GarageContext";

type FulfillMethod = "delivery" | "pickup";

const inputClass =
  "w-full rounded-xl border border-cream/15 bg-cream/[0.03] px-3.5 py-2.5 text-sm text-cream outline-none focus:border-accent transition-colors";

export function Cart() {
  const { items, removeItem, updateQty, total, clear } = useCart();
  const { car } = useGarage();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", comment: "" });
  const [method, setMethod] = useState<FulfillMethod>("pickup");

  const isValid = Boolean(form.name && form.phone && items.length > 0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setSubmitted(true);
    clear();
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent">
          <CheckCircle2 size={32} strokeWidth={1.5} className="text-cream" />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-cream">Заявка отправлена!</h1>
        <p className="mt-2 text-cream/90">
          Мы свяжемся с вами по номеру {form.phone} для подтверждения заказа. Оплата — при получении или по согласованию с продавцом.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-1.5 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-cream hover:bg-accent-hover transition-colors"
        >
          На главную
          <ArrowRight size={15} strokeWidth={2.5} />
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <ShoppingCart size={48} strokeWidth={1.5} className="mx-auto text-cream/75" />
        <h1 className="mt-4 text-xl font-bold text-cream">Корзина пуста</h1>
        <p className="mt-2 text-cream/90">Добавьте товары из каталога или запишитесь на услугу в СТО.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/catalog" className="rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-cream hover:bg-accent-hover transition-colors">
            Каталог товаров
          </Link>
          <Link to="/services" className="rounded-xl border border-cream/15 px-5 py-2.5 text-sm font-bold text-cream hover:bg-cream/5 transition-colors">
            Услуги СТО
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <h1 className="text-2xl sm:text-3xl font-bold text-cream">Корзина</h1>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-cream/10 bg-surface-alt p-4 transition-colors hover:border-cream/20">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-cream truncate">{item.name}</p>
                <p className="text-sm text-cream/75">
                  {item.type === "product" ? item.shop : item.stoName}
                </p>
              </div>
              {item.type === "product" && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-cream/15 text-cream/75"
                    aria-label="Уменьшить количество"
                  >
                    <Minus size={13} strokeWidth={1.5} />
                  </button>
                  <span className="w-5 text-center text-sm font-bold text-cream">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-cream/15 text-cream/75"
                    aria-label="Увеличить количество"
                  >
                    <Plus size={13} strokeWidth={1.5} />
                  </button>
                </div>
              )}
              <p className="w-16 shrink-0 text-right font-bold text-cream">${item.price * item.qty}</p>
              <button
                onClick={() => removeItem(item.id)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-cream/75 hover:bg-cream/5 hover:text-cream transition-colors"
                aria-label="Удалить"
              >
                <Trash2 size={15} strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-cream/10 bg-surface-alt p-5 h-fit">
          <div className="flex items-center justify-between text-lg">
            <span className="font-bold text-cream">Итого</span>
            <span className="text-xl font-bold text-cream">${total}</span>
          </div>

          <div>
            <label className="block text-sm font-bold text-cream/75 mb-1.5">Имя</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-cream/75 mb-1.5">Телефон</label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+996 700 000 000"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-cream/75 mb-1.5">Автомобиль</label>
            {car ? (
              <div className="rounded-xl border border-cream/10 bg-cream/[0.03] px-3.5 py-2.5 text-sm text-cream">
                {car.brand} {car.model}, {car.year} г.
              </div>
            ) : (
              <Link to="/garage" className="block rounded-xl border border-dashed border-cream/15 px-3.5 py-2.5 text-sm text-cream/75 hover:bg-cream/5">
                Авто не добавлено — добавить в «Моём гараже»
              </Link>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-cream/75 mb-1.5">Способ получения</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMethod("pickup")}
                aria-pressed={method === "pickup"}
                className={`flex-1 rounded-xl border py-2 text-sm font-bold transition-colors ${
                  method === "pickup" ? "border-accent bg-accent/10 text-cream" : "border-cream/15 text-cream/75"
                }`}
              >
                Самовывоз
              </button>
              <button
                type="button"
                onClick={() => setMethod("delivery")}
                aria-pressed={method === "delivery"}
                className={`flex-1 rounded-xl border py-2 text-sm font-bold transition-colors ${
                  method === "delivery" ? "border-accent bg-accent/10 text-cream" : "border-cream/15 text-cream/75"
                }`}
              >
                Доставка
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-cream/75 mb-1.5">
              Комментарий <span className="text-cream/75 font-normal">(необязательно)</span>
            </label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              rows={2}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent py-3 text-sm font-bold text-cream hover:bg-accent-hover transition-colors disabled:bg-cream/10 disabled:text-cream/30 disabled:hover:bg-cream/10"
          >
            Оформить заказ
            <ArrowRight size={15} strokeWidth={2.5} />
          </button>
          <p className="text-center text-xs text-cream/75">
            Без онлайн-оплаты — это заявка, оператор свяжется с вами.
          </p>
        </form>
      </div>
    </div>
  );
}
