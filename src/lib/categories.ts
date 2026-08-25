// Список категорий услуг — строго по ТЗ (блок 2).
export const SERVICE_CATEGORIES = [
  { slug: "sto", label: "СТО", icon: "Wrench" },
  { slug: "oil", label: "Замена масла", icon: "Droplets" },
  { slug: "diagnostics", label: "Диагностика", icon: "Gauge" },
  { slug: "electric", label: "Автоэлектрика", icon: "Zap" },
  { slug: "ac", label: "Кондиционер", icon: "Snowflake" },
  { slug: "russification", label: "Русификация", icon: "Languages" },
  { slug: "tires", label: "Шиномонтаж", icon: "CircleDot" },
  { slug: "detailing", label: "Детейлинг", icon: "Sparkles" },
  { slug: "repair", label: "Ремонт", icon: "Hammer" },
  { slug: "parts", label: "Запчасти", icon: "Cog" },
] as const;

export type ServiceCategorySlug = (typeof SERVICE_CATEGORIES)[number]["slug"];

export const SERVICE_CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  SERVICE_CATEGORIES.map((c) => [c.slug, c.label])
);
