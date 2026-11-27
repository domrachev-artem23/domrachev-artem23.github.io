import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function AddTransactionButton({ categories, onSave, initial, canAddIncome = true, compact = false, open: openProp, onOpen, onClose, showButton = true }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = openProp ?? internalOpen;
  const [type, setType] = useState('expense');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Продукты');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || !initial) return;
    setType(initial.type || 'expense'); setTitle(initial.description || initial.title || '');
    setCategory(initial.category || categories[0]?.name || 'Продукты'); setAmount(String(initial.amount || ''));
    setDate(initial.date || new Date().toISOString().slice(0, 10)); setError('');
  }, [open, initial]);

  function show() {
    setType(initial?.type || 'expense'); setTitle(initial?.description || initial?.title || '');
    setCategory(initial?.category || categories[0]?.name || 'Продукты'); setAmount(initial?.amount ? String(initial.amount) : '');
    setDate(initial?.date || new Date().toISOString().slice(0, 10));
    if (onOpen) onOpen(); else setInternalOpen(true);
  }
  function close() { if (onClose) onClose(); else setInternalOpen(false); }
  async function submit(event) {
    event.preventDefault();
    if (!title.trim() || Number(amount) <= 0 || !date) return;
    setError('');
    try {
      await onSave({ id: initial?.id, title: title.trim(), description: title.trim(), category, amount: Number(amount), date, type });
      close();
    } catch (err) { setError(err.message || 'Не удалось сохранить операцию'); }
  }

  return <>
    {showButton && <button type="button" className={compact ? 'button-primary add-compact' : 'button-primary'} onClick={show}><Plus size={18} />{compact ? 'Добавить' : 'Добавить транзакцию'}</button>}
    {open && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) close(); }}>
      <form className="modal-card" onSubmit={submit}>
        <div className="modal-title"><h2>{initial ? 'Изменить операцию' : 'Новая операция'}</h2><button type="button" className="icon-button" onClick={close} aria-label="Закрыть"><X size={20} /></button></div>
        <div className="type-switch"><button type="button" className={type === 'expense' ? 'selected expense' : ''} onClick={() => setType('expense')}>Расход</button>{canAddIncome && <button type="button" className={type === 'income' ? 'selected income' : ''} onClick={() => setType('income')}>Доход</button>}</div>
        <label className="form-field">Название / комментарий<input autoFocus value={title} onChange={e => setTitle(e.target.value)} maxLength={500} required placeholder="Например, продукты" /></label>
        <label className="form-field">Категория<select value={category} onChange={e => setCategory(e.target.value)}>{categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}</select></label>
        <div className="form-row"><label className="form-field">Сумма, ₽<input type="number" min="1" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required /></label><label className="form-field">Дата<input type="date" value={date} onChange={e => setDate(e.target.value)} required /></label></div>
        {error && <p className="form-error">{error}</p>}
        <div className="modal-actions"><button type="button" className="button-quiet" onClick={close}>Отмена</button><button className="button-primary" type="submit">{initial ? 'Сохранить' : 'Добавить'}</button></div>
      </form>
    </div>}
  </>;
}
