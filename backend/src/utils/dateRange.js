export function parseDateRange(query) {
  const today = new Date();
  const fallbackFrom = new Date(today);
  fallbackFrom.setHours(0, 0, 0, 0);

  const fallbackTo = new Date(today);
  fallbackTo.setHours(23, 59, 59, 999);

  const from = query.from ? new Date(`${query.from}T00:00:00`) : fallbackFrom;
  const to = query.to ? new Date(`${query.to}T23:59:59`) : fallbackTo;

  return { from, to };
}
