import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#1a1814', color: '#a8a29e', borderTop: '1px solid #2e2a26', marginTop: 80 }}>
      <div className="container" style={{ padding: '56px 24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 40, marginBottom: 48 }}>

          {/* Company */}
          <div>
            <div style={{ font: '700 1.2rem var(--font-display)', color: '#c84b31', marginBottom: 16 }}>ShopSphere</div>
            <p style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>Your one-stop shop for electronics, apparel, and home goods.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ color: '#a8a29e', fontSize: 18 }} aria-label="Twitter">𝕏</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: '#a8a29e', fontSize: 18 }} aria-label="Instagram">📷</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: '#a8a29e', fontSize: 18 }} aria-label="LinkedIn">in</a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ color: '#a8a29e', fontSize: 18 }} aria-label="Facebook">f</a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" style={{ color: '#a8a29e', fontSize: 18 }} aria-label="YouTube">▶</a>
            </div>
          </div>

          {/* Company links — BUG-F08: Careers, Blog, Press link to 404 pages */}
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Company</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/about" style={{ fontSize: 14 }}>About Us</Link>
              <Link to="/careers" style={{ fontSize: 14 }}>Careers</Link>{/* BUG-F08: Goes to 404 */}
              <Link to="/blog" style={{ fontSize: 14 }}>Blog</Link>{/* BUG-F08: Goes to 404 */}
              <Link to="/press" style={{ fontSize: 14 }}>Press</Link>
              <Link to="/privacy" style={{ fontSize: 14 }}>Privacy Policy</Link>
              <Link to="/terms" style={{ fontSize: 14 }}>Terms of Service</Link>
            </div>
          </div>

          {/* Shop */}
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Shop</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/products" style={{ fontSize: 14 }}>All Products</Link>
              <Link to="/category/electronics" style={{ fontSize: 14 }}>Electronics</Link>
              <Link to="/category/apparel" style={{ fontSize: 14 }}>Apparel</Link>
              <Link to="/category/home" style={{ fontSize: 14 }}>Home & Garden</Link>
              <Link to="/category/deals" style={{ fontSize: 14 }}>Deals</Link>
              <Link to="/wishlist" style={{ fontSize: 14 }}>Wishlist</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Support</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/faq" style={{ fontSize: 14 }}>FAQ</Link>
              <Link to="/contact" style={{ fontSize: 14 }}>Contact Us</Link>
              <Link to="/returns" style={{ fontSize: 14 }}>Return Policy</Link>
              <Link to="/shipping" style={{ fontSize: 14 }}>Shipping Info</Link>
              <Link to="/size-guide" style={{ fontSize: 14 }}>Size Guide</Link>
              <Link to="/order-track" style={{ fontSize: 14 }}>Order Tracking</Link>
            </div>
          </div>

        </div>
        <div style={{ borderTop: '1px solid #2e2a26', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 13 }}>© 2026 ShopSphere, Inc. All rights reserved.</p>
          <p style={{ fontSize: 13 }}>Made for QE Automation Demo purposes only.</p>
        </div>
      </div>
    </footer>
  );
}
