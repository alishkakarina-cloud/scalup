// Расстояние между районами Бишкека — статичная таблица (не GPS), в километрах.
// Используется только для сравнения специалистов в подборе (см. /services).
// Совпадает со списком районов из data/mock.ts (districts).

const DISTRICTS = ["Центр", "Восток-5", "Джал", "Аламедин", "Асанбай"] as const;
export type District = (typeof DISTRICTS)[number];
export { DISTRICTS };

// Симметричная матрица расстояний в км, приблизительно по реальной геометрии Бишкека.
const MATRIX: Record<District, Record<District, number>> = {
  "Центр": { "Центр": 1, "Восток-5": 6, "Джал": 5, "Аламедин": 9, "Асанбай": 8 },
  "Восток-5": { "Центр": 6, "Восток-5": 1, "Джал": 4, "Аламедин": 12, "Асанбай": 10 },
  "Джал": { "Центр": 5, "Восток-5": 4, "Джал": 1, "Аламедин": 10, "Асанбай": 7 },
  "Аламедин": { "Центр": 9, "Восток-5": 12, "Джал": 10, "Аламедин": 1, "Асанбай": 14 },
  "Асанбай": { "Центр": 8, "Восток-5": 10, "Джал": 7, "Аламедин": 14, "Асанбай": 1 },
};

export function isDistrict(value: string | null | undefined): value is District {
  return !!value && (DISTRICTS as readonly string[]).includes(value);
}

/** Расстояние в км между двумя районами. Незнакомый район — консервативная оценка. */
export function districtDistanceKm(from: District, to: string | null | undefined): number {
  if (!isDistrict(to)) return 10;
  return MATRIX[from][to];
}

export function formatDistance(km: number): string {
  return km <= 1 ? "рядом" : `~${km} км`;
}
