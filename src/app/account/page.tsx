import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCurrentUser } from "../../lib/session";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-cream">Личный кабинет</h1>
      <p className="mt-2 text-cream/90">{user.name} · {user.email}</p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/account/orders" className="rounded-2xl border border-cream/10 bg-surface-alt p-5 hover:border-accent/30 transition-colors">
          <p className="font-extrabold tracking-tight text-cream">Мои заказы</p>
          <p className="mt-1 text-sm text-sage-100">История заказов и статусы выполнения</p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm text-cream">Открыть <ArrowRight size={14} /></span>
        </Link>
        <Link href="/garage" className="rounded-2xl border border-cream/10 bg-surface-alt p-5 hover:border-accent/30 transition-colors">
          <p className="font-extrabold tracking-tight text-cream">Мой гараж</p>
          <p className="mt-1 text-sm text-sage-100">Автомобили для быстрого заказа услуг</p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm text-cream">Открыть <ArrowRight size={14} /></span>
        </Link>
      </div>
    </div>
  );
}
