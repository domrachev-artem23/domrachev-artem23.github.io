import { List } from 'lucide-react';
import { visualForCategory } from './categoryVisuals.js';

export default function CategoryTabs({ categories, transactions, month, active, onChange }) {
  const monthRows = transactions.filter(row => row.date.startsWith(month));
  const tabs = ['Все транзакции', ...categories.map(c => c.name)];
  return <div className="category-tabs" role="tablist" aria-label="Фильтр по категории">
    {tabs.map(name => {
      const count = monthRows.filter(row => name === 'Все транзакции' || row.category === name).length;
      const visual = name === 'Все транзакции' ? { Icon: List, color: '#77879c' } : visualForCategory(name);
      const Icon = visual.Icon;
      return <button role="tab" aria-selected={active === name} key={name} className={active === name ? 'category-tab active' : 'category-tab'} onClick={() => onChange(name)}><Icon size={13} color={active === name ? 'currentColor' : visual.color} />{name} <span>({count})</span></button>;
    })}
  </div>;
}
