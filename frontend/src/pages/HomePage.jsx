import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getFeaturedProducts().then(d => setFeatured(d.products)).catch(console.error);
    getCategories().then(d => setCategories(d.categories)).catch(console.error);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section id="hero" style={{ background: 'linear-gradient(135deg, #1a1814 0%, #2e2318 100%)', color: '#fff', padding: '80px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 16, fontWeight: 600 }}>New Arrivals 2026</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: 1.15, marginBottom: 20 }}>
              Discover Products<br />Worth Loving
            </h1>
            <p style={{ fontSize: 16, color: '#a8a29e', lineHeight: 1.7, marginBottom: 32, maxWidth: 420 }}>
              Electronics, apparel, and home goods — curated for quality and value. Free shipping over $50.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to="/products" className="btn btn-primary btn-lg">Shop Now</Link>
              <Link to="/category/deals" className="btn btn-secondary btn-lg" style={{ color: '#fff', borderColor: '#4a4540' }}>View Deals</Link>
            </div>
          </div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 400 }}>
            {['💻', '👕', '🏠', '🏷️'].map((emoji, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '24px', textAlign: 'center', fontSize: 36, aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions strip */}
      <section id="promotions" style={{ background: 'var(--accent)', color: '#fff', padding: '12px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', fontSize: 13, fontWeight: 600 }}>
          <span>🚚 Free Shipping Over $50</span>
          <span>↩️ 30-Day Returns</span>
          <span>🔒 Secure Checkout</span>
          <span>⭐ 4.8/5 Customer Rating</span>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" style={{ padding: '60px 0' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 32, textAlign: 'center' }}>Shop by Category</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {categories.map(cat => (
              <Link to={`/category/${cat.slug}`} key={cat.id} className="card" style={{ padding: '28px 20px', textAlign: 'center', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{cat.icon}</div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{cat.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{cat.productCount} products</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section id="featured" style={{ padding: '0 0 60px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>Featured Products</h2>
            <Link to="/products" style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 600 }}>View All →</Link>
          </div>
          <div className="product-grid">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '60px 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: 12 }}>Stay in the Loop</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Get deals, new arrivals, and exclusive offers straight to your inbox.</p>
          {/* BUG-F12: Newsletter submit has no feedback — button does nothing visible */}
          <form style={{ display: 'flex', gap: 0 }} onSubmit={e => e.preventDefault()}>
            <input name="newsletter-email" type="email" placeholder="you@example.com" style={{ flex: 1, padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: '8px 0 0 8px', fontSize: 14, outline: 'none' }} />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: '0 8px 8px 0' }}>Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}
