import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct, getProductReviews, getFeaturedProducts, submitReview } from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { Breadcrumb, StarRating } from '../components/UI';

function formatPrice(price) {
  return '$' + price.toFixed(2);
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 0, title: '', body: '' });
  const { addItem } = useCart();
  const { addToast } = useToast();
  const { isAuth } = useAuth();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getProduct(id),
      getProductReviews(id),
      getFeaturedProducts()
    ]).then(([pd, rd, fd]) => {
      // BUG-B03 manifests here: API returns productName instead of name
      const p = pd.product;
      p.name = p.name || p.productName; // workaround — but AI should catch mismatch
      setProduct(p);
      setReviews(rd.reviews);
      setRelated(fd.products.filter(fp => fp.id !== id).slice(0, 4));
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuth) { addToast('Please sign in to add items to cart', 'info'); return; }
    // BUG-F10: Missing stock check — can add out-of-stock items to cart
    // Should have: if (product.stock === 0) { addToast('Item out of stock', 'error'); return; }
    try { await addItem(product.id, quantity); addToast(`${product.name} added to cart!`, 'success'); }
    catch { addToast('Failed to add to cart', 'error'); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await submitReview(id, reviewForm);
      addToast('Review submitted!', 'success');
      setReviewForm({ rating: 0, title: '', body: '' });
      getProductReviews(id).then(d => setReviews(d.reviews));
    } catch { addToast('Failed to submit review', 'error'); }
  };

  if (loading) return <div className="loader"><div className="spinner" /></div>;
  if (!product) return <div className="container" style={{ padding: '40px 24px' }}><h2>Product not found</h2></div>;

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }, { label: product.category, to: `/category/${product.category}` }, { label: product.name }]} />

      {/* Product main */}
      <div id="product-main" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 60 }}>
        <div>
          <img src={product.images[0]} alt={product.name} style={{ width: '100%', borderRadius: 12, border: '1px solid var(--border)' }} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{product.category}</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 12 }}>{product.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <StarRating rating={product.rating} />
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{product.rating} ({product.reviewCount} reviews)</span>
          </div>
          <div style={{ marginBottom: 24 }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 700 }}>{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span style={{ fontSize: 16, color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: 10 }}>{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <div style={{ marginBottom: 28 }}>
            <span style={{ fontSize: 13, color: product.stock > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
              {product.stock > 0 ? `✓ In Stock (${product.stock} remaining)` : '✕ Out of Stock'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 8 }}>
              <button data-testid="qty-decrement" onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ padding: '10px 16px', border: 'none', background: 'none', fontSize: 18, cursor: 'pointer' }}>−</button>
              <input data-testid="qty-input" name="quantity" type="number" value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} style={{ width: 48, textAlign: 'center', border: 'none', fontSize: 16, fontWeight: 600 }} />
              {/* BUG-F11: Quantity can exceed stock (e.g., order 999 when only 5 available) */}
              {/* Should be: onClick={() => setQuantity(q => Math.min(q + 1, product.stock))} */}
              <button data-testid="qty-increment" onClick={() => setQuantity(q => q + 1)} style={{ padding: '10px 16px', border: 'none', background: 'none', fontSize: 18, cursor: 'pointer' }}>+</button>
            </div>
            <button data-testid={`add-to-cart-${product.id}`} onClick={handleAddToCart} className="btn btn-primary btn-lg" style={{ flex: 1 }}>Add to Cart</button>
          </div>
        </div>
      </div>

      {/* Description */}
      <section id="description" style={{ marginBottom: 40 }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 16, paddingBottom: 12, borderBottom: '2px solid var(--border)' }}>Description</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>{product.description}</p>
      </section>

      {/* Specifications */}
      <section id="specifications" style={{ marginBottom: 40 }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 16, paddingBottom: 12, borderBottom: '2px solid var(--border)' }}>Specifications</h2>
        <div className="card" style={{ overflow: 'hidden' }}>
          {Object.entries(product.specs || {}).map(([key, val], idx) => (
            <div key={key} style={{ display: 'flex', padding: '12px 16px', background: idx % 2 === 0 ? 'var(--bg)' : '#fff' }}>
              <span style={{ width: 160, fontWeight: 600, fontSize: 14, textTransform: 'capitalize', flexShrink: 0 }}>{key}</span>
              <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{val}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" style={{ marginBottom: 40 }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 16, paddingBottom: 12, borderBottom: '2px solid var(--border)' }}>Customer Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No reviews yet.</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {reviews.map(r => (
              <div key={r.id} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <StarRating rating={r.rating} />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{r.title}</div>
                <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{r.body}</p>
              </div>
            ))}
          </div>
        )}
        {isAuth && (
          <form onSubmit={handleReview} style={{ marginTop: 24, padding: 24, background: 'var(--bg)', borderRadius: 12, border: '1px solid var(--border)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Write a Review</h3>
            <div className="form-group">
              <label className="form-label">Rating</label>
              <StarRating rating={reviewForm.rating} interactive onRate={r => setReviewForm(f => ({ ...f, rating: r }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="form-input" name="review-title" value={reviewForm.title} onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Review</label>
              <textarea className="form-input" name="review-body" rows={4} value={reviewForm.body} onChange={e => setReviewForm(f => ({ ...f, body: e.target.value }))} required style={{ resize: 'vertical' }} />
            </div>
            <button type="submit" className="btn btn-primary">Submit Review</button>
          </form>
        )}
      </section>

      {/* Related Products — BUG-F05: href='#' instead of real URLs */}
      <section id="related-products" style={{ marginBottom: 40 }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 16, paddingBottom: 12, borderBottom: '2px solid var(--border)' }}>Related Products</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {related.map(p => (
            // BUG-F05: href='#' instead of correct URL /products/${p.id}
            <a key={p.id} href="#" style={{ display: 'block', textDecoration: 'none' }}>
              <div className="card" style={{ padding: 12, textAlign: 'center' }}>
                <img src={p.images[0]} alt={p.name} style={{ width: '100%', borderRadius: 6, marginBottom: 8 }} />
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 700 }}>${p.price.toFixed(2)}</div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
