import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function CartPage() {
  const { cart, updateItem, removeItem, loading } = useCart();
  const { isAuth } = useAuth();
  const { addToast } = useToast();

  if (!isAuth) return (
    <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
      <div className="empty-state">
        <div className="empty-icon">🛒</div>
        <h3>Sign in to view your cart</h3>
        <p style={{ marginBottom: 24, color: 'var(--text-muted)' }}>You need to be logged in to access your cart.</p>
        <Link to="/login" className="btn btn-primary">Sign In</Link>
      </div>
    </div>
  );

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  if (!cart.items.length) return (
    <div className="container" style={{ padding: '60px 24px' }}>
      <div className="empty-state">
        <div className="empty-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p style={{ marginBottom: 24 }}>Add some products to get started.</p>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    </div>
  );

  // BUG-F02: Quantity can be set to 0 but item is NOT removed — it stays at qty 0
  const handleQtyChange = async (productId, val) => {
    const qty = parseInt(val);
    // BUG-F02: Should remove item when qty reaches 0:
    // if (qty <= 0) { await removeItem(productId); return; }
    await updateItem(productId, qty); // allows qty=0
  };

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <h1 id="cart" style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 32 }}>Shopping Cart</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40 }}>
        {/* Items */}
        <div>
          {cart.items.map(item => (
            <div key={item.productId} style={{ display: 'flex', gap: 20, padding: '20px 0', borderBottom: '1px solid var(--border)' }}>
              <img src={item.image} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />
              <div style={{ flex: 1 }}>
                <Link to={`/products/${item.productId}`} style={{ fontWeight: 600, fontSize: 15 }}>{item.name}</Link>
                <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>${item.unitPrice.toFixed(2)} each</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 6 }}>
                    <button data-testid="qty-decrement" onClick={() => handleQtyChange(item.productId, item.quantity - 1)} style={{ padding: '6px 12px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 16 }}>−</button>
                    <input data-testid="qty-input" name="quantity" type="number" value={item.quantity} onChange={e => handleQtyChange(item.productId, e.target.value)} style={{ width: 40, textAlign: 'center', border: 'none', fontSize: 14, fontWeight: 600 }} min="0" />
                    <button data-testid="qty-increment" onClick={() => handleQtyChange(item.productId, item.quantity + 1)} style={{ padding: '6px 12px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 16 }}>+</button>
                  </div>
                  <button data-testid={`remove-cart-item-${item.productId}`} onClick={() => removeItem(item.productId)} style={{ fontSize: 13, color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Remove</button>
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>${(item.unitPrice * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div>
          <div className="card" style={{ padding: 24, position: 'sticky', top: 'calc(var(--navbar-h) + 20px)' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}><span>Subtotal</span><span>${cart.subtotal?.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}><span>Tax</span><span>${cart.tax?.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}><span>Shipping</span><span>{cart.shipping === 0 ? <span style={{ color: 'var(--success)' }}>Free</span> : `$${cart.shipping?.toFixed(2)}`}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}><span>Total</span><span>${cart.total?.toFixed(2)}</span></div>
            </div>
            <Link to="/checkout" data-testid="proceed-to-checkout" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>Proceed to Checkout</Link>
            <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: 14, color: 'var(--text-muted)' }}>Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
