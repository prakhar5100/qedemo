import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.firstName) e.firstName = 'Required';
    if (!form.lastName) e.lastName = 'Required';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.password || form.password.length < 6) e.password = 'Min 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form);
      addToast('Account created!', 'success');
      navigate('/');
    } catch { addToast('Registration failed', 'error'); }
    finally { setLoading(false); }
  };

  const field = (name, label, type = 'text') => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input name={name} type={type} className={`form-input ${errors[name] ? 'error' : ''}`} value={form[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} />
      {errors[name] && <span className="form-error">{errors[name]}</span>}
    </div>
  );

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ font: '700 1.6rem var(--font-display)', color: 'var(--accent)' }}>ShopSphere</Link>
          <h1 style={{ fontSize: '1.4rem', marginTop: 12, marginBottom: 8 }}>Create an account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Already have one? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in</Link></p>
        </div>
        <div className="card" style={{ padding: 32 }}>
          <form id="register-form" onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {field('firstName', 'First Name')}
              {field('lastName', 'Last Name')}
            </div>
            {field('email', 'Email Address', 'email')}
            {field('password', 'Password', 'password')}
            <button data-testid="register-submit" type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
