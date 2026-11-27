import { useState } from 'react';
import { X } from 'lucide-react';

export default function AuthModal({ onClose, onAuth }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('Домрачев Артемий');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e) { e.preventDefault(); setError(''); setBusy(true); try { await onAuth({ mode, name, email, password }); onClose(); } catch (err) { setError(err.message); } finally { setBusy(false); } }
  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}><form className="modal-card" onSubmit={submit}>
    <div className="modal-title"><h2>{mode === 'login' ? 'Войти в FinBuddy' : 'Создать аккаунт'}</h2><button className="icon-button" type="button" onClick={onClose} aria-label="Закрыть"><X size={20} /></button></div>
    {mode === 'register' && <label className="form-field">Имя<input value={name} onChange={e => setName(e.target.value)} minLength={2} required /></label>}
    <label className="form-field">Электронная почта<input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
    <label className="form-field">Пароль<input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={e => setPassword(e.target.value)} minLength={8} required /></label>
    {error && <p className="form-error">{error}</p>}
    <div className="modal-actions"><button type="button" className="button-quiet" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Создать аккаунт' : 'Уже есть аккаунт? Войти'}</button><button className="button-primary" disabled={busy}>{busy ? 'Подождите…' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}</button></div>
  </form></div>;
}
