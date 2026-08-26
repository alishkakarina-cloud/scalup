import { prisma } from "../../../lib/db";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogPage() {
  const entries = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    include: { actor: { select: { name: true, role: true } } },
    take: 100,
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-cream">Audit log</h1>
      <p className="mt-1 text-cream/90">Каждое админ-действие: кто, когда, что изменил, было/стало.</p>

      <div className="mt-6 space-y-2">
        {entries.length === 0 ? (
          <p className="text-sage-100">Записей пока нет.</p>
        ) : (
          entries.map((e) => (
            <div key={e.id} className="rounded-xl border border-cream/10 bg-surface-alt px-4 py-3">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <p className="text-sm font-bold text-cream">{e.action}</p>
                <span className="text-xs text-sage-100">{new Date(e.createdAt).toLocaleString("ru-RU")}</span>
              </div>
              <p className="text-xs text-sage-100 mt-0.5">
                {e.actor.name} ({e.actor.role}) · {e.entityType}#{e.entityId}
              </p>
              {(e.before || e.after) && (
                <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-sage-100">
                  <pre className="whitespace-pre-wrap break-all rounded-lg bg-surface p-2">
                    было: {JSON.stringify(e.before) ?? "—"}
                  </pre>
                  <pre className="whitespace-pre-wrap break-all rounded-lg bg-surface p-2">
                    стало: {JSON.stringify(e.after) ?? "—"}
                  </pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
