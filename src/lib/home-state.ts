export function toggleRow(current: number | null, next: number): number | null {
  return current === next ? null : next;
}
export function boundIndex(index: number, count: number): number {
  return Math.max(0, Math.min(Math.max(0, count - 1), index));
}
export function briefSummary(
  kind: string | null,
  topic: string | null,
  name: string,
): string {
  return (
    [kind, topic, name.trim()].filter(Boolean).join(" · ") ||
    "Nothing selected yet"
  );
}
