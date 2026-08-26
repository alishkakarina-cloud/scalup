import Link from "next/link";
import { Wrench, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 bg-surface border-t border-cream/10 text-cream/90">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-surface">
              <Wrench size={16} strokeWidth={2} />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-cream">SCALUP</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <Link href="/providers" className="hover:text-cream transition-colors">Исполнители</Link>
            <Link href="/catalog" className="hover:text-cream transition-colors">Каталог</Link>
            <Link href="/services" className="hover:text-cream transition-colors">Услуги</Link>
            <Link href="/garage" className="hover:text-cream transition-colors">Мой гараж</Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-bold text-surface hover:bg-accent-hover transition-colors"
            >
              Стать исполнителем
              <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
          </nav>
        </div>
        <p className="mt-8 text-xs text-cream/90">
          © {new Date().getFullYear()} SCALUP — MVP-версия маркетплейса. Оплата — тестовый режим (mock).
        </p>
      </div>
    </footer>
  );
}
