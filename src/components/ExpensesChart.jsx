import { useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { formatMoney } from '../utils.js';
import { visualForCategory } from './categoryVisuals.js';

export default function ExpensesChart({ transactions, categories, month, onCategory }) {
  const [hovered, setHovered] = useState('');
  const rows = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense' && t.date.startsWith(month));
    const total = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
    return categories.map(category => {
      const amount = expenses.filter(t => t.category === category.name).reduce((sum, item) => sum + Number(item.amount), 0);
      return { ...category, amount, share: total ? Math.round(amount / total * 100) : 0 };
    }).filter(row => row.amount > 0).sort((a, b) => b.amount - a.amount);
  }, [transactions, categories, month]);
  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  const segments = []; let offset = 0;
  rows.forEach(row => { const end = offset + (total ? row.amount / total * 100 : 0); segments.push(`${row.color} ${offset}% ${end}%`); offset = end; });
  return <section className="panel chart-panel">
    <div className="panel-heading"><h2>Расходы по категориям</h2><button className="text-link" onClick={() => onCategory?.('Все транзакции')}>Все <ChevronRight size={15} /></button></div>
    <div className="chart-content">
      <button className="donut-chart" style={{ background: segments.length ? `conic-gradient(${segments.join(',')})` : '#e8edf4' }} onClick={() => onCategory?.(hovered || 'Все транзакции')} aria-label="Диаграмма расходов">
        <span className="donut-hole"><b>{formatMoney(total)}</b><small>Всего расходов</small></span>
      </button>
      <div className="chart-legend">{rows.length ? rows.map(row => { const Icon=visualForCategory(row.name).Icon; return <button key={row.name} className={hovered === row.name ? 'legend-row focused' : 'legend-row'} onMouseEnter={() => setHovered(row.name)} onMouseLeave={() => setHovered('')} onClick={() => onCategory?.(row.name)}><span className="legend-icon" style={{color:row.color,backgroundColor:`${row.color}18`}}><Icon size={12}/></span><span>{row.name}</span><b>{row.share}%<small>{formatMoney(row.amount)}</small></b></button>; }) : <p className="empty-note">За этот месяц расходов пока нет</p>}</div>
    </div>
  </section>;
}
