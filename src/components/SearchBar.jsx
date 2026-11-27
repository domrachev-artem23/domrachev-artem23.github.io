import { CalendarDays, Search } from 'lucide-react';
import { monthOptions } from '../utils.js';

export default function SearchBar({ search, onSearch, month, onMonth, children }) {
  const options = monthOptions(36);
  if (!options.some(option => option.value === month)) options.unshift({ value: month, label: new Date(`${month}-01T00:00:00`).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }) });
  return <header className="topbar">
    <label className="search-box"><Search size={18} /><input value={search} onChange={e => onSearch(e.target.value)} placeholder="Поиск по транзакциям, категориям, магазинам…" aria-label="Поиск транзакций" /></label>
    <label className="month-select"><CalendarDays size={16} /><select value={month} onChange={e => onMonth(e.target.value)} aria-label="Фильтр по месяцу">{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>
    {children}
  </header>;
}
