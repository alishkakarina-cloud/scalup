import { Link } from "react-router-dom";
import { Wrench, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 bg-ink-950 border-t border-white/10 text-paper/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-500 text-ink-950">
              <Wrench size={16} strokeWidth={2} />
            </span>
            <span className="text-lg font-bold tracking-tight text-paper">SCALUP</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <Link to="/catalog" className="hover:text-paper transition-colors">Каталог</Link>
            <Link to="/services" className="hover:text-paper transition-colors">Услуги</Link>
            <Link to="/garage" className="hover:text-paper transition-colors">Мой гараж</Link>
            <Link to="/sto/sto1" className="hover:text-paper transition-colors">СТО</Link>
            <Link
              to="/garage"
              className="inline-flex items-center gap-1.5 rounded-xl bg-lime-500 px-4 py-2 text-sm font-bold text-ink-950 hover:bg-lime-600 transition-colors"
            >
              Добавить авто
              <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
          </nav>
        </div>
        <p className="mt-8 text-xs text-paper/30">
          © {new Date().getFullYear()} SCALUP — макет интерфейса. Все данные тестовые.
        </p>
      </div>
    </footer>
  );
}
