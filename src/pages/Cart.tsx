import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart, CheckCircle2, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useGarage } from "../context/GarageContext";

type FulfillMethod = "delivery" | "pickup";

const inputClass =
  "w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-sm text-paper outline-none focus:border-lime-500 transition-colors";

export function Cart() {
  const { items, removeItem, updateQty, total, clear } = useCart();
  const { car } = useGarage();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", comment: "" });
  const [method, setMethod] = useState<FulfillMethod>("pickup");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || items.length === 0) return;
    setSubmitted(true);
    clear();
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <CheckCircle2 size={56} strokeWidth={1.5} className="mx-auto text-lime-500" />
        <h1 className="mt-4 text-2xl font-bold text-paper">Заявка отправлена!</h1>
        <p className="mt-2 text-paper/50">
          Мы свяжемся с вами по номеру {form.phone} для подтверждения заказа. Оплата — при получении или по согласованию с продавцом.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-1.5 rounded-xl bg-lime-500 px-6 py-3 text-sm font-bold text-ink-950 hover:bg-lime-600 transition-colors"
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
        <ShoppingCart size={48} strokeWidth={1.5} className="mx-auto text-paper/20" />
        <h1 className="mt-4 text-xl font-bold text-paper">Корзина пуста</h1>
        <p className="mt-2 text-paper/50">Добавьте товары из каталога или запишитесь на услугу в СТО.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/catalog" className="rounded-xl bg-lime-500 px-5 py-2.5 text-sm font-bold text-ink-950 hover:bg-lime-600 transition-colors">
            Каталог товаров
          </Link>
          <Link to="/services" className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-bold text-paper hover:bg-white/5 transition-colors">
            Услуги СТО
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <h1 className="text-2xl sm:text-3xl font-bold text-paper">Корзина</h1>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-ink-900 p-4 transition-colors hover:border-white/20">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-paper truncate">{item.name}</p>
                <p className="text-sm text-paper/40">
                  {item.type === "product" ? item.shop : item.stoName}
                </p>
              </div>
              {item.type === "product" && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-paper/60"
                    aria-label="Уменьшить количество"
                  >
                    <Minus size={13} strokeWidth={1.5} />
                  </button>
                  <span className="w-5 text-center text-sm font-bold text-paper">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-paper/60"
                    aria-label="Увеличить количество"
                  >
                    <Plus size={13} strokeWidth={1.5} />
                  </button>
                </div>
              )}
              <p className="w-16 shrink-0 text-right font-bold text-lime-500">${item.price * item.qty}</p>
              <button
                onClick={() => removeItem(item.id)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-paper/30 hover:bg-white/5 hover:text-paper transition-colors"
                aria-label="Удалить"
              >
                <Trash2 size={15} strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-ink-900 p-5 h-fit">
          <div className="flex items-center justify-between text-lg">
            <span className="font-bold text-paper">Итого</span>
            <span className="text-xl font-bold text-lime-500">${total}</span>
          </div>

          <div>
            <label className="block text-sm font-bold text-paper/60 mb-1.5">Имя</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-paper/60 mb-1.5">Телефон</label>
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
            <label className="block text-sm font-bold text-paper/60 mb-1.5">Автомобиль</label>
            {car ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-paper">
                {car.brand} {car.model}, {car.year} г.
              </div>
            ) : (
              <Link to="/garage" className="block rounded-xl border border-dashed border-white/15 px-3.5 py-2.5 text-sm text-paper/40 hover:bg-white/5">
                Авто не добавлено — добавить в «Моём гараже»
              </Link>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-paper/60 mb-1.5">Способ получения</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMethod("pickup")}
                className={`flex-1 rounded-xl border py-2 text-sm font-bold transition-colors ${
                  method === "pickup" ? "border-lime-500 bg-lime-500/10 text-lime-500" : "border-white/15 text-paper/60"
                }`}
              >
                Самовывоз
              </button>
              <button
                type="button"
                onClick={() => setMethod("delivery")}
                className={`flex-1 rounded-xl border py-2 text-sm font-bold transition-colors ${
                  method === "delivery" ? "border-lime-500 bg-lime-500/10 text-lime-500" : "border-white/15 text-paper/60"
                }`}
              >
                Доставка
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-paper/60 mb-1.5">
              Комментарий <span className="text-paper/30 font-normal">(необязательно)</span>
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
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-lime-500 py-3 text-sm font-bold text-ink-950 hover:bg-lime-600 transition-colors"
          >
            Оформить заказ
            <ArrowRight size={15} strokeWidth={2.5} />
          </button>
          <p className="text-center text-xs text-paper/30">
            Без онлайн-оплаты — это заявка, оператор свяжется с вами.
          </p>
        </form>
      </div>
    </div>
  );
}
