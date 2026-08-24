import { Link } from "react-router-dom";
import { Wrench } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 bg-navy-950 text-white/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500 text-white">
              <Wrench size={16} strokeWidth={2.5} />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-white">SCALUP</span>
          </Link>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link to="/catalog" className="hover:text-white transition-colors">Каталог</Link>
            <Link to="/services" className="hover:text-white transition-colors">Услуги</Link>
            <Link to="/garage" className="hover:text-white transition-colors">Мой гараж</Link>
            <Link to="/sto/sto1" className="hover:text-white transition-colors">СТО</Link>
          </nav>
        </div>
        <p className="mt-8 text-xs text-white/40">
          © {new Date().getFullYear()} SCALUP — макет интерфейса. Все данные тестовые.
        </p>
      </div>
    </footer>
  );
}
