import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { formatDate, formatMoney } from '../utils.js';
import { incomeVisual, visualForCategory } from './categoryVisuals.js';

export default function TransactionTable({ rows, onEdit, onDelete, title = 'Транзакции', sort, onSort }) {
  return <section className="panel transaction-panel">
    <div className="panel-heading"><h2>{title}</h2><label className="sort-select"><select value={sort} onChange={e => onSort(e.target.value)} aria-label="Сортировка"><option value="new">Сначала новые</option><option value="old">Сначала старые</option><option value="amount">По сумме</option></select></label></div>
    <div className="table-scroll"><table className="transactions-table"><thead><tr><th>Дата</th><th>Описание</th><th>Категория</th><th>Сумма</th><th>Тип</th><th aria-label="Действия" /></tr></thead><tbody>
      {rows.map(row => { const visual = row.type === 'income' ? incomeVisual : visualForCategory(row.category); const Icon = visual.Icon; return <tr key={row.id}><td>{formatDate(row.date)}</td><td><div className="description-cell"><span className="merchant-icon" style={{ color: visual.color, backgroundColor: `${visual.color}18` }}><Icon size={15} strokeWidth={2} /></span><b>{row.shop || row.title}</b></div></td><td>{row.category}</td><td className={row.type === 'income' ? 'amount income' : 'amount expense'}>{row.type === 'income' ? '+' : '−'} {formatMoney(row.amount)}</td><td><span className={`type-badge ${row.type}`}>{row.type === 'income' ? 'Доход' : 'Расход'}</span></td><td><div className="row-actions"><button onClick={() => onEdit(row)} aria-label={`Изменить ${row.title}`} title="Изменить"><Pencil size={15} /></button><button onClick={() => onDelete(row)} aria-label={`Удалить ${row.title}`} title="Удалить"><Trash2 size={15} /></button><MoreVertical size={16} className="more-icon" /></div></td></tr>; })}
    </tbody></table>{!rows.length && <div className="empty-state"><span>Пока нет операций за этот период</span><small>Добавьте первую транзакцию или выберите другой месяц.</small></div>}</div>
  </section>;
}
