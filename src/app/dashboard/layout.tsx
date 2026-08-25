import Link from "next/link";

const items = [
  { href: "/dashboard", label: "Главная" },
  { href: "/dashboard/orders", label: "Заказы" },
  { href: "/dashboard/services", label: "Услуги" },
  { href: "/dashboard/profile", label: "Профиль" },
  { href: "/dashboard/balance", label: "Баланс" },
  { href: "/dashboard/payouts", label: "Выплаты" },
  { href: "/dashboard/reviews", label: "Отзывы" },
  { href: "/dashboard/tariff", label: "Тариф" },
  { href: "/dashboard/settings", label: "Настройки" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
      <aside className="lg:sticky lg:top-24 h-fit">
        <p className="px-2 text-xs font-bold uppercase tracking-wide text-sage-200 mb-2">Кабинет исполнителя</p>
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-xl px-3 py-2 text-sm font-bold text-cream/90 hover:bg-cream/5 hover:text-cream transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
