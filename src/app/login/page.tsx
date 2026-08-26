"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-cream/15 bg-surface-light px-3.5 py-2.5 text-sm text-cream outline-none focus:border-accent transition-colors";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Не удалось войти");

      const next = searchParams.get("next");
      if (next) router.push(next);
      else if (data.role === "ADMIN") router.push("/admin");
      else if (data.role === "PROVIDER") router.push("/dashboard");
      else router.push("/account");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14 sm:py-20">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-cream">Вход</h1>
      <p className="mt-2 text-cream/90">Войдите в аккаунт клиента, исполнителя или администратора.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-cream/10 bg-surface-alt p-6">
        <div>
          <label className="block text-sm font-bold text-cream/75 mb-1.5">Email</label>
          <input required type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-bold text-cream/75 mb-1.5">Пароль</label>
          <input required type="password" className={inputClass} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>

        {error && <p className="text-sm text-accent-glow">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent py-3 text-sm font-bold text-surface hover:bg-accent-hover transition-colors disabled:opacity-60"
        >
          {loading ? "Входим…" : "Войти"}
          <ArrowRight size={15} strokeWidth={2.5} />
        </button>
        <p className="text-center text-xs text-cream/75">
          Нет аккаунта? <Link href="/register" className="text-cream underline">Зарегистрироваться</Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
