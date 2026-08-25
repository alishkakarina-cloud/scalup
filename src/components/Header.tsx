import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, ShoppingCart, Wrench, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";

const navItems = [
  { to: "/catalog", label: "Каталог" },
  { to: "/services", label: "Услуги" },
  { to: "/garage", label: "Мой гараж" },
  { to: "/sto/sto1", label: "СТО" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-bold border-b-2 pb-1 transition-colors hover:border-accent/60 ${
      isActive ? "text-cream border-accent" : "text-cream/90 border-transparent"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur border-b border-cream/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-cream">
              <Wrench size={18} strokeWidth={2} />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-cream">
              SCALUP
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/garage"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-accent pl-4 pr-3 py-2 text-sm font-bold text-cream hover:bg-accent-hover transition-colors"
            >
              Добавить авто
              <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream hover:bg-cream/5 transition-colors"
              aria-label="Корзина"
            >
              <ShoppingCart size={18} strokeWidth={1.75} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-cream">
                  {count}
                </span>
              )}
            </Link>
            <button
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream"
              onClick={() => setOpen((v) => !v)}
              aria-label="Меню"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-cream/10 bg-surface px-4 pb-4 pt-2">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg border-l-2 px-3 py-2.5 text-sm font-bold ${
                    isActive ? "border-accent bg-cream/5 text-cream" : "border-transparent text-cream/90"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/garage"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-cream hover:bg-accent-hover transition-colors"
            >
              Добавить авто
              <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
