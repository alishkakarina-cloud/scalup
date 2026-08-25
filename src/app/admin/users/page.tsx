import { prisma } from "../../../lib/db";

export const dynamic = "force-dynamic";

const ROLE_LABEL: Record<string, string> = { CLIENT: "Клиент", PROVIDER: "Исполнитель", ADMIN: "Админ" };

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { provider: { select: { businessName: true, verified: true } } },
    take: 200,
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-cream">Пользователи</h1>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-cream/10 bg-surface-alt">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream/10 text-left text-sage-200 text-xs uppercase tracking-wide">
              <th className="px-4 py-3">Имя</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Роль</th>
              <th className="px-4 py-3">Город</th>
              <th className="px-4 py-3">Регистрация</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-cream/5 last:border-0">
                <td className="px-4 py-3 text-cream font-bold">{u.provider?.businessName ?? u.name}</td>
                <td className="px-4 py-3 text-sage-100">{u.email}</td>
                <td className="px-4 py-3 text-sage-100">{ROLE_LABEL[u.role] ?? u.role}</td>
                <td className="px-4 py-3 text-sage-100">{u.city ?? "—"}</td>
                <td className="px-4 py-3 text-sage-100">{new Date(u.createdAt).toLocaleDateString("ru-RU")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
