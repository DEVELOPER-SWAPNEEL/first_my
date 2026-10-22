import type { Units } from './model';
export function formatUnits(units: Units): string {
  const value = BigInt(units);
  return `${value / 100n}.${(value % 100n).toString().padStart(2, '0')}`;
}
export function parseAmount(value: string): Units | null {
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(value)) return null;
  const [whole, fraction = ''] = value.split('.');
  const units = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0'));
  return units > 0n && units <= 100000000n ? units.toString() : null;
}
/** Illustrative fixed rate only: 10,000 paise per DEMO. */
export function illustrativeINR(units: Units): string { return `₹${formatUnits((BigInt(units) * 10000n / 100n).toString())}`; }
