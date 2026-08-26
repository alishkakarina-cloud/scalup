"use client";

import { useState } from "react";
import { Lock, User, Phone, ArrowRight, Check } from "lucide-react";

// Заявка на этом этапе не пишется в БД — по тому же принципу, что и оформление
// "заказа" в физическом каталоге (см. /cart): это лид для последующего ручного
// звонка, а не привязанный к аккаунту заказ услуги (для этого есть /providers).
export function LeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSent(true);
  }

  if (sent) {
    return (
      <div id="booking" className="rounded-2xl border border-cream/10 bg-surface-alt p-6 sm:p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-surface">
          <Check size={22} strokeWidth={2.5} />
        </span>
        <h3 className="mt-4 text-lg font-extrabold tracking-tight text-cream">Заявка принята</h3>
        <p className="mt-1 text-sm text-sage-100">Мы свяжемся с вами в ближайшее время.</p>
      </div>
    );
  }

  return (
    <form id="booking" onSubmit={handleSubmit} className="rounded-2xl border border-cream/10 bg-surface-alt p-6 sm:p-8">
      <h3 className="text-xl font-extrabold tracking-tight text-cream">Добавить авто</h3>
      <p className="mt-1.5 text-sm text-sage-100">Оставьте заявку — перезвоним и подберём удобное время.</p>

      <div className="mt-5 space-y-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-sage-100 mb-1.5">Имя</label>
          <div className="relative">
            <User size={16} strokeWidth={1.75} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-100" />
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите ваше имя"
              className="w-full rounded-xl border border-cream/15 bg-surface-light pl-10 pr-3.5 py-2.5 text-sm text-cream outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-sage-100 mb-1.5">Телефон</label>
          <div className="relative">
            <Phone size={16} strokeWidth={1.75} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-100" />
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+996 (___) __-__-__"
              className="w-full rounded-xl border border-cream/15 bg-surface-light pl-10 pr-3.5 py-2.5 text-sm text-cream outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="mt-5 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent py-3 text-sm font-bold text-surface hover:bg-accent-hover transition-colors"
      >
        Оставить заявку
        <ArrowRight size={15} strokeWidth={2.5} />
      </button>

      <p className="mt-3.5 flex items-center justify-center gap-1.5 text-xs text-sage-100">
        <Lock size={12} strokeWidth={2} />
        Ваши данные под защитой и не передаются третьим лицам
      </p>
    </form>
  );
}
