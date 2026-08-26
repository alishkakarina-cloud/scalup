"use client";

import { useState, type FormEvent } from "react";

const inputClass =
  "w-full rounded-xl border border-cream/15 bg-surface-light px-3.5 py-2.5 text-sm text-cream outline-none focus:border-accent transition-colors";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage({ type: "error", text: data.error ?? "Не удалось сменить пароль" });
      return;
    }
    setMessage({ type: "ok", text: "Пароль обновлён" });
    setCurrentPassword("");
    setNewPassword("");
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-cream">Настройки</h1>
      <form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-4 rounded-2xl border border-cream/10 bg-surface-alt p-5">
        <h2 className="font-bold text-cream">Смена пароля</h2>
        <div>
          <label className="block text-sm font-bold text-cream/75 mb-1.5">Текущий пароль</label>
          <input required type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-bold text-cream/75 mb-1.5">Новый пароль</label>
          <input required type="password" minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} />
        </div>
        {message && <p className={`text-sm ${message.type === "error" ? "text-accent-glow" : "text-cream"}`}>{message.text}</p>}
        <button type="submit" className="rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-surface hover:bg-accent-hover transition-colors">
          Сохранить
        </button>
      </form>
    </div>
  );
}
