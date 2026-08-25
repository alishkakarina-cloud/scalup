import Link from "next/link";

const items = [
  { href: "/admin", label: "Обзор" },
  { href: "/admin/orders", label: "Заказы" },
  { href: "/admin/providers", label: "Исполнители" },
  { href: "/admin/payouts", label: "Выплаты" },
  { href: "/admin/disputes", label: "Споры" },
  { href: "/admin/users", label: "Пользователи" },
  { href: "/admin/audit-log", label: "Audit log" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
      <aside className="lg:sticky lg:top-24 h-fit">
        <p className="px-2 text-xs font-bold uppercase tracking-wide text-sage-200 mb-2">Админ-панель</p>
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
