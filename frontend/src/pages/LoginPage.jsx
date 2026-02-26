import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuth } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // BUG-F15: Missing redirect check — logged-in users can access /login page
  // Should have: useEffect(() => { if (isAuth) navigate('/'); }, [isAuth, navigate]);

  // BUG-F06: When toggling show password, input briefly flashes type="text" before React can update
  // The bug: we unmount/remount the input instead of just changing the type attribute
  const toggleShowPassword = () => {
    setShowPass(prev => {
      // BUG-F06: forces a remount by setting to opposite value with a forced re-render trick
      return !prev;
    });
    // Artificial delay that causes the DOM to briefly show plain text
    // In real implementations, this would be synchronous — but this creates the flash bug
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      addToast('Welcome back!', 'success');
      navigate('/');
    } catch (err) {
      setError('Invalid email or password. Try john@example.com / password123');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ font: '700 1.6rem var(--font-display)', color: 'var(--accent)' }}>ShopSphere</Link>
          <h1 style={{ fontSize: '1.4rem', marginTop: 12, marginBottom: 8 }}>Sign in to your account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Don't have an account? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign up</Link></p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {error && <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '12px 16px', borderRadius: 8, fontSize: 14, marginBottom: 20 }}>{error}</div>}

          <form id="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input name="email" type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" autoComplete="email" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                {/* BUG-F06: Using key= to force remount causes brief flash of plain text */}
                <input
                  key={showPass ? 'text' : 'pass'}
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                  style={{ paddingRight: 44, width: '100%' }}
                  autoComplete="current-password"
                />
                <button type="button" onClick={toggleShowPassword} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: 'var(--text-muted)' }} aria-label="Toggle password visibility">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                <input type="checkbox" name="remember-me" /> Remember me
              </label>
              <Link to="/forgot-password" style={{ fontSize: 14, color: 'var(--accent)' }}>Forgot password?</Link>
            </div>
            <button data-testid="login-submit" type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>Demo: john@example.com / password123</p>
      </div>
    </div>
  );
}
