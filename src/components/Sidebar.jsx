import { Activity, BarChart3, ChartNoAxesCombined, CircleUserRound, Flag, LayoutDashboard, List, Settings, Tags, Wallet } from 'lucide-react';

const links = [
  ['Обзор', LayoutDashboard], ['Транзакции', List], ['Бюджет', Wallet], ['Цели', Flag],
  ['Аналитика', BarChart3], ['Категории', Tags], ['Отчёты', Activity], ['Настройки', Settings],
];

export default function Sidebar({ page, onNavigate, user, onAuth }) {
  const name = user?.name || 'Домрачев Артемий';
  return <aside className="sidebar">
    <div className="brand"><div className="brand-mark"><ChartNoAxesCombined size={24} /></div><div><b>FinBuddy</b><small>Ваш личный бюджет</small></div></div>
    <nav className="side-nav" aria-label="Главная навигация">
      {links.map(([label, Icon]) => <button key={label} className={page === label ? 'nav-item active' : 'nav-item'} onClick={() => onNavigate(label)}><Icon size={18} strokeWidth={1.8} /><span>{label}</span></button>)}
    </nav>
    <button className="profile-switch" onClick={onAuth} title={user ? 'Выйти из аккаунта' : 'Войти или создать аккаунт'}>
      <div className="avatar">{user ? name.split(/\s+/).slice(0, 2).map(x => x[0]).join('').toUpperCase() : 'ДА'}</div>
      <span className="profile-copy"><b>{name}</b><small>{user?.email || 'Демо-режим · Войти'}</small></span><CircleUserRound size={18} />
    </button>
  </aside>;
}
