import "server-only";
import { prisma } from "./db";

/**
 * Каждое админ-действие (и любое изменение денег/статусов, инициированное
 * админом) обязано пройти через эту функцию — кто, когда, что изменил,
 * было/стало. Без audit log ответственность за спорные решения недоказуема.
 */
export async function logAudit(params: {
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
}) {
  await prisma.auditLog.create({
    data: {
      actorId: params.actorId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      before: params.before === undefined ? undefined : (params.before as object),
      after: params.after === undefined ? undefined : (params.after as object),
    },
  });
}
