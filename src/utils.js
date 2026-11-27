export const formatMoney = value => `${Math.round(Number(value) || 0).toLocaleString('ru-RU')} ₽`;
export const formatDate = value => new Date(`${value}T12:00:00`).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
export const monthLabel = value => {
  const [year, month] = value.split('-').map(Number);
  const label = new Date(year, month - 1, 1).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  return label[0].toUpperCase() + label.slice(1);
};
export const escapeText = value => String(value ?? '');

export function previousMonth(value) {
  const [year, month] = value.split('-').map(Number);
  const date = new Date(year, month - 2, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function monthOptions(count = 18) {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return { value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`, label: monthLabel(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`) };
  });
}
