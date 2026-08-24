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
    `text-sm font-bold transition-colors hover:text-lime-500 ${
      isActive ? "text-lime-500" : "text-paper/70"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-ink-950/95 backdrop-blur border-b border-paper/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime-500 text-ink-950">
              <Wrench size={18} strokeWidth={2} />
            </span>
            <span className="text-xl font-bold tracking-tight text-paper">
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
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-lime-500 pl-4 pr-3 py-2 text-sm font-bold text-ink-950 hover:bg-lime-600 transition-colors"
            >
              Добавить авто
              <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-paper/15 text-paper hover:bg-paper/5 transition-colors"
              aria-label="Корзина"
            >
              <ShoppingCart size={18} strokeWidth={1.75} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-lime-500 px-1 text-[11px] font-bold text-ink-950">
                  {count}
                </span>
              )}
            </Link>
            <button
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full border border-paper/15 text-paper"
              onClick={() => setOpen((v) => !v)}
              aria-label="Меню"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-paper/10 bg-ink-950 px-4 pb-4 pt-2">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-bold ${
                    isActive ? "bg-paper/5 text-lime-500" : "text-paper/70"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/garage"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-lime-500 px-4 py-2.5 text-sm font-bold text-ink-950 hover:bg-lime-600 transition-colors"
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
