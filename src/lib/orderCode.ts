/** Формат ID заказа по ТЗ: SCALUP-10001, ... — выводится из PK, коллизии невозможны. */
export function formatOrderCode(id: number): string {
  return `SCALUP-${10000 + id}`;
}
