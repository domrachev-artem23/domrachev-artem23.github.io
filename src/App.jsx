import { useEffect, useMemo, useState } from 'react';
import { Bell, CircleHelp, LogOut, Search, Settings2, Wallet } from 'lucide-react';
import Sidebar from './components/Sidebar.jsx';
import SearchBar from './components/SearchBar.jsx';
import CategoryTabs from './components/CategoryTabs.jsx';
import AddTransactionButton from './components/AddTransactionButton.jsx';
import ExpensesChart from './components/ExpensesChart.jsx';
import SummaryCards from './components/SummaryCards.jsx';
import TransactionTable from './components/TransactionTable.jsx';
import BudgetPanel from './components/BudgetPanel.jsx';
import AuthModal from './components/AuthModal.jsx';
import ReportsPage from './components/ReportsPage.jsx';
import { visualForCategory } from './components/categoryVisuals.js';
import { apiRequest, mapExpense } from './api.js';
import { budgets, categories as demoCategories, demoTransactions } from './data.js';
import { formatMoney, monthLabel, previousMonth } from './utils.js';

const navMap = { 'Обзор':'overview', 'Транзакции':'transactions', 'Бюджет':'budget', 'Цели':'goals', 'Аналитика':'reports', 'Отчёты':'reports', 'Категории':'categories', 'Настройки':'settings' };
const initialMonth = new Date().toISOString().slice(0, 7);

export default function App() {
  const [page, setPage] = useState('Обзор');
  const [month, setMonth] = useState(initialMonth);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Все транзакции');
  const [sort, setSort] = useState('new');
  const [transactions, setTransactions] = useState(demoTransactions);
  const [categories, setCategories] = useState(demoCategories);
  const [session, setSession] = useState(() => ({ token: localStorage.getItem('finbuddy-token') || '', user: null }));
  const [authOpen, setAuthOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const token = session.token;

  useEffect(() => {
    if (!token) { setSession({ token: '', user: null }); return; }
    let cancelled = false;
    (async () => {
      try {
        const me = await apiRequest('/auth/me', token);
        const [cats, rows] = await Promise.all([apiRequest('/categories', token), apiRequest('/expenses', token)]);
        if (!cancelled) {
          setSession({ token, user: me.user });
          setCategories(cats.categories.map(c => ({ ...c, name: c.name })));
          setTransactions(rows.expenses.map(mapExpense));
        }
      } catch { localStorage.removeItem('finbuddy-token'); if (!cancelled) setSession({ token: '', user: null }); }
    })();
    return () => { cancelled = true; };
  }, [token]);

  const loadExpenses = async () => {
    if (!token) return;
    setLoading(true); setError('');
    try {
      const [year, monthNumber] = month.split('-').map(Number);
      const lastDay = new Date(year, monthNumber, 0).getDate();
      const query = new URLSearchParams({ from: `${month}-01`, to: `${month}-${String(lastDay).padStart(2, '0')}` });
      const result = await apiRequest(`/expenses?${query}`, token);
      setTransactions(current => {
        const merged = new Map(current.map(row => [String(row.id), row]));
        for (const item of result.expenses.map(mapExpense)) merged.set(String(item.id), item);
        return [...merged.values()];
      });
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadExpenses(); }, [token, month]);

  const monthRows = transactions.filter(row => row.date.startsWith(month));
  const filteredRows = useMemo(() => {
    const q = search.trim().toLocaleLowerCase('ru');
    return monthRows.filter(row => (activeCategory === 'Все транзакции' || row.category === activeCategory) && (!q || [row.title, row.description, row.category, row.shop].some(v => String(v || '').toLocaleLowerCase('ru').includes(q))))
      .sort((a,b) => sort === 'old' ? a.date.localeCompare(b.date) : sort === 'amount' ? Number(b.amount)-Number(a.amount) : b.date.localeCompare(a.date));
  }, [monthRows, activeCategory, search, sort]);

  const statsFor = (key) => {
    const rows = transactions.filter(t => t.date.startsWith(key));
    const income = rows.filter(t => t.type === 'income').reduce((s,t) => s + Number(t.amount), 0);
    const expense = rows.filter(t => t.type === 'expense').reduce((s,t) => s + Number(t.amount), 0);
    const cap = budgets.reduce((s,b) => s+b.limit, 0);
    return { income, expense, budgetPercent: cap ? Math.round(expense/cap*100) : 0 };
  };
  const currentStats = statsFor(month), previousStats = statsFor(previousMonth(month));
  const navigate = label => { setPage(label); setError(''); };

  async function authenticate({ mode, name, email, password }) {
    const data = await apiRequest(`/auth/${mode === 'register' ? 'register' : 'login'}`, '', { method:'POST', body: { ...(mode === 'register' ? { name } : {}), email, password } });
    localStorage.setItem('finbuddy-token', data.token);
    setSession({ token: data.token, user: data.user });
    setNotice(mode === 'register' ? 'Аккаунт создан. Данные сохраняются в PostgreSQL.' : 'Вы вошли в аккаунт.');
  }

  async function saveTransaction(input) {
    setError('');
    if (token && input.type === 'income') throw new Error('В API этой работы учитываются расходы. Доходы доступны в демо-режиме.');
    if (token) {
      const category = categories.find(c => c.name === input.category);
      const body = { amount: input.amount, categoryId: category?.id, date: input.date, description: input.description };
      const result = await apiRequest(input.id ? `/expenses/${input.id}` : '/expenses', token, { method: input.id ? 'PUT' : 'POST', body });
      const saved = mapExpense(result.expense);
      setTransactions(current => [saved, ...current.filter(row => String(row.id) !== String(saved.id))]);
    } else {
      setTransactions(current => input.id ? current.map(row => row.id === input.id ? { ...row, ...input } : row) : [{ ...input, id: Date.now(), shop: input.title }, ...current]);
    }
    setNotice(input.id ? 'Операция обновлена.' : 'Операция добавлена.');
  }
  async function deleteTransaction(row) {
    if (!window.confirm(`Удалить операцию «${row.title}»?`)) return;
    if (token) await apiRequest(`/expenses/${row.id}`, token, { method:'DELETE' });
    setTransactions(current => current.filter(item => item.id !== row.id));
    setNotice('Операция удалена.');
  }

  const categoryPage = <><div className="page-title"><div><h1>Категории</h1><p>Категории расходов и их доли за {monthLabel(month)}</p></div></div><div className="category-card-grid">{categories.map(c => { const spent = monthRows.filter(t => t.category === c.name && t.type === 'expense').reduce((s,t)=>s+Number(t.amount),0); const visual=visualForCategory(c.name); const Icon=visual.Icon; return <button className="panel category-card" key={c.id || c.name} onClick={()=>{setActiveCategory(c.name);setPage('Транзакции')}}><span className="category-card-symbol" style={{color:visual.color,backgroundColor:`${visual.color}18`}}><Icon size={17}/></span><b>{c.name}</b><span>{formatMoney(spent)}</span><small>{monthRows.filter(t=>t.category===c.name).length} операций · перейти к списку</small></button>})}</div></>;
  const budgetPage = <><div className="page-title"><div><h1>Бюджет</h1><p>Контроль лимитов за {monthLabel(month)}</p></div></div><div className="budget-layout"><BudgetPanel transactions={transactions} month={month} onOpen={()=>navigate('Категории')}/><ExpensesChart transactions={transactions} categories={categories} month={month} onCategory={setActiveCategory}/></div></>;
  const goalsPage = <><div className="page-title"><div><h1>Цели</h1><p>Планируйте накопления и следите за прогрессом</p></div></div><section className="panel feature-empty"><span className="feature-icon"><Wallet/></span><h2>Накопления на отпуск</h2><p>Демо-цель: 45 000 ₽ из 120 000 ₽</p><div className="progress-track"><span style={{width:'38%'}}/></div><b>38% выполнено</b><small>В этой версии цели показаны как демонстрационный раздел.</small></section></>;
  const settingsPage = <><div className="page-title"><div><h1>Настройки</h1><p>Параметры профиля и приложения</p></div></div><section className="panel settings-panel"><h2>Профиль</h2><p><b>Имя:</b> {session.user?.name || 'Домрачев Артемий'}</p><p><b>Режим:</b> {token ? 'Аккаунт · PostgreSQL' : 'Демо-режим · данные в браузере'}</p><button className="button-secondary" onClick={()=>token ? (localStorage.removeItem('finbuddy-token'),setSession({token:'',user:null}),setTransactions(demoTransactions),setCategories(demoCategories),setNotice('Вы вышли из аккаунта.')) : setAuthOpen(true)}>{token ? <><LogOut size={16}/> Выйти</> : 'Войти / создать аккаунт'}</button></section></>;

  return <div className="app-shell">
    <Sidebar page={page} onNavigate={navigate} user={session.user} onAuth={()=>token ? navigate('Настройки') : setAuthOpen(true)}/>
    <main className="main-area">
      <SearchBar search={search} onSearch={setSearch} month={month} onMonth={value=>{setMonth(value);setActiveCategory('Все транзакции')}}><button className="icon-button top-icon" aria-label="Уведомления"><Bell size={19}/><i/></button><AddTransactionButton categories={categories} onSave={saveTransaction} canAddIncome={!token}/></SearchBar>
      <div className="content-area">
        {notice && <button className="notice" onClick={()=>setNotice('')}>{notice} <span>×</span></button>}{error && <div className="form-error page-error">{error}</div>}
        {page === 'Обзор' && <>
          <div className="page-title"><div><h1>Добро пожаловать, {session.user?.name?.split(' ')[0] || 'Артемий'}!</h1><p>Вот обзор ваших финансов за {monthLabel(month).toLowerCase()}.</p></div><button className="button-secondary" onClick={()=>token?navigate('Настройки'):setAuthOpen(true)}><Settings2 size={16}/>{token?'Аккаунт':'Демо-режим · Войти'}</button></div>
          <SummaryCards current={currentStats} previous={previousStats} month={monthLabel(month)}/>
          <div className="overview-grid"><ExpensesChart transactions={transactions} categories={categories} month={month} onCategory={name=>{setActiveCategory(name);setPage('Транзакции')}}/><BudgetPanel transactions={transactions} month={month} onOpen={()=>navigate('Бюджет')}/></div>
          <CategoryTabs categories={categories} transactions={transactions} month={month} active={activeCategory} onChange={name=>{setActiveCategory(name);setPage('Транзакции')}}/>
          <TransactionTable rows={filteredRows.slice(0,7)} onEdit={row=>setEditRow(row)} onDelete={deleteTransaction} title="Последние транзакции" sort={sort} onSort={setSort}/>
        </>}
        {page === 'Транзакции' && <><div className="page-title"><div><h1>Транзакции</h1><p>Доходы и расходы за {monthLabel(month)}</p></div><div className="inline-search"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Название, категория или магазин"/></div></div><CategoryTabs categories={categories} transactions={transactions} month={month} active={activeCategory} onChange={setActiveCategory}/>{loading&&<p className="loading-note">Обновляю список…</p>}<TransactionTable rows={filteredRows} onEdit={setEditRow} onDelete={deleteTransaction} sort={sort} onSort={setSort}/></>}
        {page === 'Категории' && categoryPage}
        {page === 'Бюджет' && budgetPage}
        {(page === 'Отчёты'||page === 'Аналитика') && <ReportsPage token={token} transactions={transactions} categories={categories}/>}
        {page === 'Цели' && goalsPage}
        {page === 'Настройки' && settingsPage}
      </div>
      <footer className="app-footer"><span>FinBuddy · Учёт личных финансов</span><button onClick={()=>setNotice('Для вопросов по проекту обратитесь к автору работы.')}><CircleHelp size={15}/> Помощь</button><span>{token?'Подключено к REST API и PostgreSQL':'Демо-режим'}</span></footer>
    </main>
    {authOpen && <AuthModal onClose={()=>setAuthOpen(false)} onAuth={authenticate}/>}
    <AddTransactionButton categories={categories} onSave={saveTransaction} canAddIncome={!token} initial={editRow||undefined} open={!!editRow} onClose={()=>setEditRow(null)} showButton={false}/>
  </div>;
}
