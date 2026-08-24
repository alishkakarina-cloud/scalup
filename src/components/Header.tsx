import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, ShoppingCart, Wrench } from "lucide-react";
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
    `text-sm font-medium transition-colors hover:text-accent-500 ${
      isActive ? "text-accent-500" : "text-white/80"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-navy-950 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500 text-white">
              <Wrench size={18} strokeWidth={2.5} />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-white">
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
              className="hidden sm:inline-flex items-center rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600 transition-colors"
            >
              Добавить авто
            </Link>
            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Корзина"
            >
              <ShoppingCart size={19} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1 text-[11px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
            <button
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
              onClick={() => setOpen((v) => !v)}
              aria-label="Меню"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-navy-950 px-4 pb-4 pt-2">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive ? "bg-white/10 text-accent-500" : "text-white/80"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/garage"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-accent-500 px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              Добавить авто
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
