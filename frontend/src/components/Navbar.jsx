import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAuth } = useAuth();
  const { itemCount } = useCart();
  const [searchQ, setSearchQ] = useState('');
  const [catOpen, setCatOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) { navigate(`/search?q=${encodeURIComponent(searchQ.trim())}`); setSearchQ(''); }
  };

  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100, height: 'var(--navbar-h)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 24, height: '100%' }}>
        {/* Logo */}
        <Link to="/" data-testid="navbar-logo" style={{ font: '700 1.4rem var(--font-display)', color: 'var(--accent)', whiteSpace: 'nowrap', flexShrink: 0 }}>
          Shop<span style={{ color: 'var(--text)' }}>Sphere</span>
        </Link>

        {/* Primary nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <NavLink to="/" end style={({ isActive }) => ({ padding: '6px 12px', borderRadius: 6, fontSize: 14, fontWeight: 500, color: isActive ? 'var(--accent)' : 'var(--text)' })}>Home</NavLink>
          <NavLink to="/products" style={({ isActive }) => ({ padding: '6px 12px', borderRadius: 6, fontSize: 14, fontWeight: 500, color: isActive ? 'var(--accent)' : 'var(--text)' })}>Products</NavLink>

          {/* Categories dropdown */}
          <div style={{ position: 'relative' }} onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
            <button style={{ padding: '6px 12px', border: 'none', background: 'none', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              Categories ▾
            </button>
            {catOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', border: '1px solid var(--border)', borderRadius: 8, boxShadow: 'var(--shadow-md)', padding: 8, minWidth: 180, zIndex: 200 }}>
                <Link to="/category/electronics" style={{ display: 'block', padding: '8px 14px', borderRadius: 6, fontSize: 14, color: 'var(--text)' }} className="nav-dd-item">💻 Electronics</Link>
                <Link to="/category/apparel" style={{ display: 'block', padding: '8px 14px', borderRadius: 6, fontSize: 14, color: 'var(--text)' }}>👕 Apparel</Link>
                <Link to="/category/home" style={{ display: 'block', padding: '8px 14px', borderRadius: 6, fontSize: 14, color: 'var(--text)' }}>🏠 Home & Garden</Link>
                <Link to="/category/deals" style={{ display: 'block', padding: '8px 14px', borderRadius: 6, fontSize: 14, color: 'var(--accent)', fontWeight: 600 }}>🏷️ Deals</Link>
              </div>
            )}
          </div>

          <NavLink to="/about" style={({ isActive }) => ({ padding: '6px 12px', borderRadius: 6, fontSize: 14, fontWeight: 500, color: isActive ? 'var(--accent)' : 'var(--text)' })}>About</NavLink>
          <NavLink to="/contact" style={({ isActive }) => ({ padding: '6px 12px', borderRadius: 6, fontSize: 14, fontWeight: 500, color: isActive ? 'var(--accent)' : 'var(--text)' })}>Contact</NavLink>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', gap: 0 }}>
          <input
            data-testid="search-input"
            name="search"
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder="Search products…"
            style={{ flex: 1, padding: '8px 14px', border: '1.5px solid var(--border)', borderRadius: '6px 0 0 6px', fontSize: 14, outline: 'none', background: 'var(--bg)' }}
          />
          <button type="submit" style={{ padding: '8px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '0 6px 6px 0', fontSize: 14, cursor: 'pointer' }}>🔍</button>
        </form>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {isAuth && (
            <Link to="/wishlist" aria-label="Wishlist" style={{ padding: '8px', fontSize: 18 }}>♡</Link>
          )}
          <Link to="/cart" data-testid="cart-icon" style={{ position: 'relative', padding: '8px', fontSize: 18 }}>
            🛒
            {/* BUG-F05: Cart badge shows count + 1 (displays 4 when cart has 3 items) */}
            {itemCount > 0 && (
              <span data-testid="cart-badge" style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent)', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{itemCount + 1}</span>
            )}
          </Link>

          {isAuth ? (
            <div style={{ position: 'relative' }} onMouseEnter={() => setUserOpen(true)} onMouseLeave={() => setUserOpen(false)}>
              <button style={{ padding: '7px 14px', borderRadius: 6, border: '1.5px solid var(--border)', background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                {user.firstName} ▾
              </button>
              {userOpen && (
                <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid var(--border)', borderRadius: 8, boxShadow: 'var(--shadow-md)', padding: 8, minWidth: 160, zIndex: 200 }}>
                  <Link to="/profile" style={{ display: 'block', padding: '8px 14px', fontSize: 14 }}>My Profile</Link>
                  <Link to="/orders" style={{ display: 'block', padding: '8px 14px', fontSize: 14 }}>My Orders</Link>
                  <Link to="/wishlist" style={{ display: 'block', padding: '8px 14px', fontSize: 14 }}>Wishlist</Link>
                  <hr style={{ margin: '6px 0', borderColor: 'var(--border)' }} />
                  <button onClick={logout} style={{ width: '100%', textAlign: 'left', padding: '8px 14px', fontSize: 14, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}>Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
