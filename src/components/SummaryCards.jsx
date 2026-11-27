import { ArrowDownRight, ArrowUpRight, PiggyBank, Wallet, TrendingUp } from 'lucide-react';
import { formatMoney } from '../utils.js';

function delta(current, previous, invert = false) {
  if (!previous) return { label: 'Нет данных за прошлый месяц', down: false };
  const value = Math.round((current - previous) / previous * 100);
  return { label: `${value > 0 ? '+' : ''}${value}% к прошлому месяцу`, down: invert ? value > 0 : value < 0 };
}

export default function SummaryCards({ current, previous, month }) {
  const incomeDelta = delta(current.income, previous.income);
  const expenseDelta = delta(current.expense, previous.expense, true);
  const balance = current.income - current.expense;
  const cards = [
    { label: 'Доходы', value: formatMoney(current.income), icon: Wallet, color: 'mint', delta: incomeDelta },
    { label: 'Расходы', value: formatMoney(current.expense), icon: ArrowDownRight, color: 'rose', delta: expenseDelta },
    { label: 'Остаток', value: formatMoney(balance), icon: TrendingUp, color: 'sky', note: `За ${month}` },
    { label: 'Бюджет на месяц', value: current.budgetPercent ? `${current.budgetPercent}%` : '—', icon: PiggyBank, color: 'violet', note: 'Расходы к лимиту' },
  ];
  return <section className="summary-grid">{cards.map(({ label, value, icon: Icon, color, delta: change, note }) => <article className="panel summary-card" key={label}><span className={`summary-icon ${color}`}><Icon size={21} /></span><div className="summary-copy"><span>{label}</span><strong>{value}</strong>{change ? <small className={change.down ? 'trend negative' : 'trend'}>{change.down ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}{change.label}</small> : <small className="summary-note">{note}</small>}</div></article>)}</section>;
}
