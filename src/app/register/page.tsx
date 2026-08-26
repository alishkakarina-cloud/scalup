"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-cream/15 bg-surface-light px-3.5 py-2.5 text-sm text-cream outline-none focus:border-accent transition-colors";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"CLIENT" | "PROVIDER">("CLIENT");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", businessName: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Не удалось зарегистрироваться");
      router.push(role === "PROVIDER" ? "/dashboard" : "/account");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14 sm:py-20">
      <h1 className="text-2xl font-extrabold tracking-tight text-cream">Регистрация</h1>
      <p className="mt-2 text-cream/90">Создайте аккаунт клиента или исполнителя.</p>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={() => setRole("CLIENT")}
          className={`flex-1 rounded-xl border py-2.5 text-sm font-bold transition-colors ${
            role === "CLIENT" ? "border-accent bg-accent/10 text-cream" : "border-cream/15 text-cream/75"
          }`}
        >
          Я клиент
        </button>
        <button
          type="button"
          onClick={() => setRole("PROVIDER")}
          className={`flex-1 rounded-xl border py-2.5 text-sm font-bold transition-colors ${
            role === "PROVIDER" ? "border-accent bg-accent/10 text-cream" : "border-cream/15 text-cream/75"
          }`}
        >
          Я исполнитель
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-cream/10 bg-surface-alt p-6">
        <div>
          <label className="block text-sm font-bold text-cream/75 mb-1.5">Имя</label>
          <input required className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        {role === "PROVIDER" && (
          <div>
            <label className="block text-sm font-bold text-cream/75 mb-1.5">Название бизнеса / СТО</label>
            <input
              required
              className={inputClass}
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-bold text-cream/75 mb-1.5">Email</label>
          <input required type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-bold text-cream/75 mb-1.5">Телефон</label>
          <input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+996 700 000 000" />
        </div>
        <div>
          <label className="block text-sm font-bold text-cream/75 mb-1.5">Пароль</label>
          <input required type="password" minLength={8} className={inputClass} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>

        {error && <p className="text-sm text-accent-glow">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent py-3 text-sm font-bold text-surface hover:bg-accent-hover transition-colors disabled:opacity-60"
        >
          {loading ? "Создаём аккаунт…" : "Зарегистрироваться"}
          <ArrowRight size={15} strokeWidth={2.5} />
        </button>
        <p className="text-center text-xs text-cream/75">
          Уже есть аккаунт? <Link href="/login" className="text-cream underline">Войти</Link>
        </p>
      </form>
    </div>
  );
}
