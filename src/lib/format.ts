export function formatDuration(minutes: number | null | undefined): string {
  if (!minutes) return "уточняется";
  if (minutes < 60) return `~${minutes} мин`;
  const hours = minutes / 60;
  return Number.isInteger(hours) ? `~${hours} ч` : `~${Math.round(hours * 10) / 10} ч`;
}
