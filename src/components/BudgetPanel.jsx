import { ChevronRight } from 'lucide-react';
import { budgets } from '../data.js';
import { formatMoney } from '../utils.js';
import { visualForCategory } from './categoryVisuals.js';

export default function BudgetPanel({ transactions, month, onOpen }) {
  const expenses = transactions.filter(t => t.type === 'expense' && t.date.startsWith(month));
  return <section className="panel budget-panel"><div className="panel-heading"><h2>Бюджет на месяц</h2><button className="text-link" onClick={onOpen}>Все <ChevronRight size={15} /></button></div>
    {budgets.map(item => { const used = expenses.filter(t => t.category === item.category).reduce((sum, t) => sum + Number(t.amount), 0); const percent = item.limit ? Math.min(100, Math.round(used / item.limit * 100)) : 0; const visual = visualForCategory(item.category); const Icon = visual.Icon; const color = visual.color; return <div className="budget-row" key={item.category}><span className="budget-dot" style={{ color, background: `${color}1c` }}><Icon size={16} strokeWidth={2} /></span><div className="budget-main"><div className="budget-label"><b>{item.category}</b><span>{formatMoney(used)} / {formatMoney(item.limit)}</span></div><div className="progress-track"><span style={{ width: `${percent}%`, background: color }} /></div></div><strong className="budget-percent">{percent}%</strong></div>; })}
  </section>;
}
