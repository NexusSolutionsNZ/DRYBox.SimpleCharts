import { type Range } from './types';

function toDateInputValue(d: Date) {
  // yyyy-mm-dd
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function defaultLast7DaysRange(): Range {
  const now = new Date();
  const from = new Date(now);
  from.setDate(now.getDate() - 7);

  return {
    from: toDateInputValue(from),
    to: toDateInputValue(now),
  };
}

export function rangeToIso(range: Range): { fromIso: string; toIso: string } {
  const fromStringToUse = range.from.includes('T') ? range.from : `${range.from}T00:00:00`;
  const toStringToUse = range.to.includes('T') ? range.to : `${range.to}T23:59:59.999`;

  let from = new Date(fromStringToUse);
  let to = new Date(toStringToUse);

  if (from > to) {
    const actualTo = from;
    from = to;
    to = actualTo;
  }
  return { fromIso: from.toISOString(), toIso: to.toISOString() };
}