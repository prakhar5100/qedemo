import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { addToWishlist } from '../services/api';

// BUG-F01: Price formatting breaks for prices > 999 (shows 34999 instead of $349.99)
function formatPrice(price) {
  const str = price.toString();
  // BUG-F01: Removes the decimal point when price > 999 due to faulty string manipulation
  if (price > 999) {
    return '$' + str.replace('.', '');
  }
  return '$' + price.toFixed(2);
}

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { addToast } = useToast();
  const { isAuth } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuth) { addToast('Please sign in to add items to cart', 'info'); return; }
    try {
      await addItem(product.id);
      addToast(`${product.name} added to cart!`, 'success');
    } catch { addToast('Failed to add to cart', 'error'); }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuth) { addToast('Please sign in to use wishlist', 'info'); return; }
    try {
      await addToWishlist(product.id);
      addToast('Added to wishlist!', 'success');
    } catch { addToast('Failed to update wishlist', 'error'); }
  };

  // BUG-F06: Shows SALE badge even when prices are equal (>= instead of >)
  const hasDiscount = product.originalPrice >= product.price;

  return (
    <Link to={`/products/${product.id}`} data-testid={`product-card-${product.id}`} style={{ display: 'block', textDecoration: 'none' }}>
      <div className="card" style={{ transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'pointer' }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}>
        <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', background: 'var(--bg)' }}>
          <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {hasDiscount && (
            <span style={{ position: 'absolute', top: 10, left: 10, background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>
              SALE
            </span>
          )}
          <button
            data-testid={`wishlist-btn-${product.id}`}
            onClick={handleWishlist}
            aria-label="Add to wishlist"
            style={{ position: 'absolute', top: 10, right: 10, background: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', fontSize: 16 }}>
            ♡
          </button>
        </div>
        <div style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{product.category}</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
            {/* BUG-F09: Math.ceil makes 3.1 rating show 4 stars (should use floor) */}
            <span className="stars">{'★'.repeat(Math.ceil(product.rating))}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>({product.reviewCount})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              {/* BUG-F01: formatPrice called here — breaks for prices > 999 */}
              <span style={{ fontSize: 16, fontWeight: 700 }}>{formatPrice(product.price)}</span>
              {hasDiscount && <span style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: 6 }}>{formatPrice(product.originalPrice)}</span>}
            </div>
            <button
              data-testid={`add-to-cart-${product.id}`}
              onClick={handleAddToCart}
              className="btn btn-primary btn-sm"
              style={{ padding: '6px 12px', fontSize: 12 }}>
              Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
