export function formatCop(value) {
  if (value == null) return '—';
  return `$${Number(value).toLocaleString('es-CO')}`;
}

export function formatPercent(value) {
  if (value == null) return '—';
  return `${value}%`;
}
