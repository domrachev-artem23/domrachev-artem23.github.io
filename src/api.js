export async function apiRequest(path, token, options = {}) {
  const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`/api${path}`, { ...options, headers, body: options.body ? JSON.stringify(options.body) : undefined });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Не удалось выполнить запрос');
  return data;
}

export function mapExpense(item) {
  return { id: item.id, date: item.date, title: item.description || item.category, description: item.description || '', shop: item.description || item.category, category: item.category, categoryId: item.categoryId, amount: Number(item.amount), type: 'expense', color: item.color };
}
