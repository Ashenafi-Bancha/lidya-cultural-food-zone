// Prices are stored as free text, because they have been entered two ways over
// the life of the menu: the original seed used "580 ETB", while entries added
// through the admin panel are bare numbers like "400". Appending the currency at
// render time keeps both displaying correctly without anyone retyping old rows.
const CURRENCY = 'ETB';

export function formatPrice(raw: string | number | null | undefined): string {
  if (raw === null || raw === undefined) return '';
  const value = String(raw).trim();
  if (!value) return '';

  // Already carries a currency (ETB, Br, $, …) — leave it exactly as entered.
  if (/[a-zA-Zሀ-፿$€£]/.test(value)) return value;

  const numeric = Number(value.replace(/,/g, ''));
  if (!Number.isFinite(numeric)) return value;

  // Whole birr for round amounts, two decimals only when they carry meaning.
  const formatted = Number.isInteger(numeric)
    ? numeric.toLocaleString('en-US')
    : numeric.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return `${formatted} ${CURRENCY}`;
}
