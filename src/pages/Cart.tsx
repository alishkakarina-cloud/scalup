import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart, CheckCircle2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useGarage } from "../context/GarageContext";

type FulfillMethod = "delivery" | "pickup";

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
        <CheckCircle2 size={56} className="mx-auto text-emerald-500" />
        <h1 className="mt-4 text-2xl font-extrabold text-navy-900">Заявка отправлена!</h1>
        <p className="mt-2 text-navy-900/60">
          Мы свяжемся с вами по номеру {form.phone} для подтверждения заказа. Оплата — при получении или по согласованию с продавцом.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white hover:bg-accent-600 transition-colors"
        >
          На главную
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <ShoppingCart size={48} className="mx-auto text-navy-900/20" />
        <h1 className="mt-4 text-xl font-bold text-navy-900">Корзина пуста</h1>
        <p className="mt-2 text-navy-900/60">Добавьте товары из каталога или запишитесь на услугу в СТО.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/catalog" className="rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white">
            Каталог товаров
          </Link>
          <Link to="/services" className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-navy-900">
            Услуги СТО
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">Корзина</h1>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-navy-900 truncate">{item.name}</p>
                <p className="text-sm text-navy-900/50">
                  {item.type === "product" ? item.shop : item.stoName}
                </p>
              </div>
              {item.type === "product" && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 text-navy-900/60"
                    aria-label="Уменьшить количество"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-5 text-center text-sm font-semibold">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 text-navy-900/60"
                    aria-label="Увеличить количество"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              )}
              <p className="w-16 shrink-0 text-right font-bold text-navy-900">${item.price * item.qty}</p>
              <button
                onClick={() => removeItem(item.id)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-navy-900/30 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                aria-label="Удалить"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-black/5 bg-white p-5 h-fit">
          <div className="flex items-center justify-between text-lg">
            <span className="font-semibold text-navy-900">Итого</span>
            <span className="font-extrabold text-navy-900">${total}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-900/70 mb-1.5">Имя</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-900/70 mb-1.5">Телефон</label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+996 700 000 000"
              className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-900/70 mb-1.5">Автомобиль</label>
            {car ? (
              <div className="rounded-xl bg-navy-950/5 px-3.5 py-2.5 text-sm text-navy-900">
                {car.brand} {car.model}, {car.year} г.
              </div>
            ) : (
              <Link to="/garage" className="block rounded-xl border border-dashed border-black/15 px-3.5 py-2.5 text-sm text-navy-900/50 hover:bg-navy-950/5">
                Авто не добавлено — добавить в «Моём гараже»
              </Link>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-900/70 mb-1.5">Способ получения</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMethod("pickup")}
                className={`flex-1 rounded-xl border py-2 text-sm font-semibold transition-colors ${
                  method === "pickup" ? "border-accent-500 bg-accent-50 text-accent-600" : "border-black/10 text-navy-900/60"
                }`}
              >
                Самовывоз
              </button>
              <button
                type="button"
                onClick={() => setMethod("delivery")}
                className={`flex-1 rounded-xl border py-2 text-sm font-semibold transition-colors ${
                  method === "delivery" ? "border-accent-500 bg-accent-50 text-accent-600" : "border-black/10 text-navy-900/60"
                }`}
              >
                Доставка
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-900/70 mb-1.5">
              Комментарий <span className="text-navy-900/40 font-normal">(необязательно)</span>
            </label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              rows={2}
              className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-accent-500 py-3 text-sm font-semibold text-white hover:bg-accent-600 transition-colors"
          >
            Оформить заказ
          </button>
          <p className="text-center text-xs text-navy-900/40">
            Без онлайн-оплаты — это заявка, оператор свяжется с вами.
          </p>
        </form>
      </div>
    </div>
  );
}
