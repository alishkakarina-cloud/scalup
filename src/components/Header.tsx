"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ShoppingCart, Wrench, ArrowRight, User } from "lucide-react";
import { useCart } from "../context/CartContext";
import type { CurrentUser } from "../lib/useCurrentUser";

const navItems = [
  { to: "/providers", label: "Исполнители" },
  { to: "/catalog", label: "Каталог" },
  { to: "/services", label: "Услуги" },
  { to: "/garage", label: "Мой гараж" },
];

function accountHref(user: CurrentUser | null) {
  if (!user) return "/login";
  if (user.role === "ADMIN") return "/admin";
  if (user.role === "PROVIDER") return "/dashboard";
  return "/account";
}

function accountLabel(user: CurrentUser | null) {
  if (!user) return "Войти";
  if (user.role === "ADMIN") return "Админка";
  if (user.role === "PROVIDER") return "Кабинет";
  return "Профиль";
}

export function Header({ user }: { user: CurrentUser | null }) {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);

  const linkClass = (to: string) =>
    `text-sm font-bold border-b-2 pb-1 transition-colors hover:border-accent/60 ${
      isActive(to) ? "text-cream border-accent" : "text-cream/90 border-transparent"
    }`;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur border-b border-cream/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-surface">
              <Wrench size={18} strokeWidth={2} />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-cream">SCALUP</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {navItems.map((item) => (
              <Link key={item.to} href={item.to} className={linkClass(item.to)}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={accountHref(user)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-cream/15 px-4 py-2 text-sm font-bold text-cream hover:bg-cream/5 transition-colors"
            >
              <User size={15} strokeWidth={2} />
              {accountLabel(user)}
            </Link>
            <Link
              href="/#booking"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-bold text-surface hover:bg-accent-hover transition-colors"
            >
              Записаться
            </Link>
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream hover:bg-cream/5 transition-colors"
              aria-label="Корзина"
            >
              <ShoppingCart size={18} strokeWidth={1.75} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-surface">
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
              <Link
                key={item.to}
                href={item.to}
                onClick={() => setOpen(false)}
                className={`rounded-lg border-l-2 px-3 py-2.5 text-sm font-bold ${
                  isActive(item.to) ? "border-accent bg-cream/5 text-cream" : "border-transparent text-cream/90"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={accountHref(user)}
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-surface hover:bg-accent-hover transition-colors"
            >
              {accountLabel(user)}
              <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
            {user && (
              <button
                onClick={handleLogout}
                className="mt-1 rounded-lg px-3 py-2.5 text-left text-sm font-bold text-cream/70 hover:bg-cream/5"
              >
                Выйти
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
