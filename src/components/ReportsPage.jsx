import { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../api.js';
import { categories as defaultCategories } from '../data.js';
import { formatMoney } from '../utils.js';

function rangeFor(period, date, from, to) {
  if (period === 'custom') return { from, to };
  const anchor = new Date(`${date}T00:00:00`);
  if (period === 'day') return { from: date, to: date };
  if (period === 'week') { const start = new Date(anchor); start.setDate(start.getDate() - ((start.getDay() + 6) % 7)); const end = new Date(start); end.setDate(end.getDate() + 6); return { from: start.toISOString().slice(0, 10), to: end.toISOString().slice(0, 10) }; }
  const start = new Date(anchor.getFullYear(), anchor.getMonth(), 1); const end = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0);
  return { from: start.toISOString().slice(0, 10), to: end.toISOString().slice(0, 10) };
}

function summarizeLocal(rows, categories, range) {
  const expenses = rows.filter(row => row.type === 'expense' && row.date >= range.from && row.date <= range.to);
  const total = expenses.reduce((sum, row) => sum + Number(row.amount), 0);
  const groups = categories.map(c => { const amount = expenses.filter(row => row.category === c.name).reduce((sum, row) => sum + Number(row.amount), 0); return { ...c, amount, count: expenses.filter(row => row.category === c.name).length, share: total ? Number((amount / total * 100).toFixed(2)) : 0 }; }).filter(c => c.amount > 0).sort((a, b) => b.amount - a.amount);
  const trend = Object.values(expenses.reduce((map, row) => { map[row.date] ||= { date: row.date, amount: 0, count: 0 }; map[row.date].amount += Number(row.amount); map[row.date].count++; return map; }, {})).sort((a, b) => a.date.localeCompare(b.date));
  return { total, count: expenses.length, categories: groups, trend, period: range };
}

export default function ReportsPage({ token, transactions, categories = defaultCategories }) {
  const [period, setPeriod] = useState('month');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [from, setFrom] = useState(''); const [to, setTo] = useState('');
  const [data, setData] = useState(null); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const range = useMemo(() => rangeFor(period, date, from, to), [period, date, from, to]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setError(''); setLoading(true);
      try {
        if (period === 'custom' && (!from || !to)) { setData(null); setLoading(false); return; }
        if (token) {
          const query = new URLSearchParams({ period });
          if (period === 'custom') { query.set('from', from); query.set('to', to); } else query.set('date', date);
          const result = await apiRequest(`/statistics/summary?${query}`, token);
          if (!cancelled) setData(result);
        } else if (!cancelled) setData(summarizeLocal(transactions, categories, range));
      } catch (err) { if (!cancelled) setError(err.message); }
      finally { if (!cancelled) setLoading(false); }
    }
    load(); return () => { cancelled = true; };
  }, [token, transactions, categories, period, date, from, to, range]);

  const max = Math.max(1, ...(data?.trend || []).map(item => Number(item.amount)));
  return <>
    <div className="page-title"><div><h1>Отчёты</h1><p>Сводка и динамика расходов за выбранный период</p></div></div>
    <section className="panel report-controls"><div className="panel-heading"><h2>Период анализа</h2><select value={period} onChange={e => setPeriod(e.target.value)}><option value="day">День</option><option value="week">Неделя</option><option value="month">Месяц</option><option value="custom">Произвольный период</option></select></div>
      {period === 'custom' ? <div className="period-fields"><label>С<input type="date" value={from} onChange={e => setFrom(e.target.value)} /></label><label>По<input type="date" value={to} onChange={e => setTo(e.target.value)} /></label></div> : <label className="period-date">Дата<input type="date" value={date} onChange={e => setDate(e.target.value)} /></label>}
      {!token && <p className="demo-note">Демо-аналитика рассчитана в браузере. В аккаунте отчёт загружается из PostgreSQL через REST API.</p>}
    </section>
    {loading && <div className="panel report-loading">Загружаю аналитику…</div>}{error && <div className="panel form-error">{error}</div>}
    {data && <><section className="report-stat-grid"><article className="panel report-stat"><span>Всего расходов</span><b>{formatMoney(Number(data.total))}</b></article><article className="panel report-stat"><span>Операций</span><b>{data.count}</b></article><article className="panel report-stat"><span>Период</span><b className="period-output">{data.period?.from} — {data.period?.to}</b></article></section>
      <section className="report-grid"><article className="panel report-panel"><div className="panel-heading"><h2>По категориям</h2></div>{data.categories?.length ? data.categories.map(row => <div className="report-category" key={row.category}><span>{row.category}</span><div className="progress-track"><span style={{ width: `${row.share}%`, background: row.color || '#2482ef' }} /></div><b>{formatMoney(Number(row.amount))}<small>{row.share}%</small></b></div>) : <p className="empty-note">За этот период расходов нет.</p>}</article>
      <article className="panel report-panel"><div className="panel-heading"><h2>Динамика по дням</h2></div><div className="trend-chart">{data.trend?.length ? data.trend.map(row => <div className="trend-column" key={row.date} title={`${row.date}: ${formatMoney(Number(row.amount))}`}><span style={{ height: `${Math.max(5, Number(row.amount) / max * 100)}%` }} /><small>{row.date.slice(8)}</small></div>) : <p className="empty-note">Нет данных для графика.</p>}</div></article></section></>}
  </>;
}
