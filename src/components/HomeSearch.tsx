"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";

export function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/providers${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl">
      <label className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-surface/80" size={18} strokeWidth={1.5} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Поиск услуги"
          placeholder="Что ищете? Запчасть, масло, СТО, услугу"
          className="w-full rounded-xl border border-surface/15 bg-surface/5 pl-11 pr-4 py-3.5 text-sm text-surface placeholder:text-surface/90 outline-none focus:border-accent transition-colors"
        />
      </label>
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-cream hover:bg-accent-hover transition-colors shrink-0"
      >
        Найти
        <ArrowRight size={16} strokeWidth={2.5} />
      </button>
    </form>
  );
}
