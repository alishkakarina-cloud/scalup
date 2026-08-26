"use client";

import { useEffect, useState, type FormEvent } from "react";
import { SERVICE_CATEGORIES } from "../../../lib/categories";

interface ProviderProfile {
  businessName: string;
  description: string | null;
  city: string | null;
  categories: string[];
  mobileService: boolean;
  verified: boolean;
}

const inputClass =
  "w-full rounded-xl border border-cream/15 bg-surface-light px-3.5 py-2.5 text-sm text-cream outline-none focus:border-accent transition-colors";

export default function ProviderProfilePage() {
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(async (data) => {
        if (!data.user?.providerId) return;
        const res = await fetch(`/api/providers/${data.user.providerId}`);
        const detail = await res.json();
        setProfile({
          businessName: detail.provider.businessName,
          description: detail.provider.description,
          city: detail.provider.city,
          categories: detail.provider.categories,
          mobileService: detail.provider.mobileService,
          verified: detail.provider.verified,
        });
      });
  }, []);

  function toggleCategory(slug: string) {
    if (!profile) return;
    const has = profile.categories.includes(slug);
    setProfile({ ...profile, categories: has ? profile.categories.filter((c) => c !== slug) : [...profile.categories, slug] });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setError(null);
    setSaved(false);
    const res = await fetch("/api/provider/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Не удалось сохранить");
      return;
    }
    setSaved(true);
  }

  if (!profile) return <p className="text-sage-100">Загрузка…</p>;

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-cream">Профиль</h1>
      {profile.verified && (
        <p className="mt-2 inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-cream">Проверенный исполнитель</p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-cream/10 bg-surface-alt p-5 max-w-xl">
        <div>
          <label className="block text-sm font-bold text-cream/75 mb-1.5">Название бизнеса</label>
          <input required value={profile.businessName} onChange={(e) => setProfile({ ...profile, businessName: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-bold text-cream/75 mb-1.5">Описание</label>
          <textarea value={profile.description ?? ""} onChange={(e) => setProfile({ ...profile, description: e.target.value })} rows={3} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-bold text-cream/75 mb-1.5">Город</label>
          <p className={`${inputClass} text-cream/75`}>{profile.city ?? "Бишкек"}</p>
        </div>
        <div>
          <label className="block text-sm font-bold text-cream/75 mb-1.5">Категории услуг</label>
          <div className="flex flex-wrap gap-2">
            {SERVICE_CATEGORIES.map((c) => (
              <button
                type="button"
                key={c.slug}
                onClick={() => toggleCategory(c.slug)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                  profile.categories.includes(c.slug) ? "bg-accent text-surface" : "border border-cream/15 text-cream/75"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-cream/90">
          <input type="checkbox" checked={profile.mobileService} onChange={(e) => setProfile({ ...profile, mobileService: e.target.checked })} className="h-4 w-4 rounded accent-accent" />
          Выездная услуга
        </label>

        {error && <p className="text-sm text-accent-glow">{error}</p>}
        {saved && <p className="text-sm text-cream">Сохранено</p>}

        <button type="submit" className="rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-surface hover:bg-accent-hover transition-colors">
          Сохранить
        </button>
      </form>
    </div>
  );
}
