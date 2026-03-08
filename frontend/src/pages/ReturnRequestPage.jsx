import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { getOrders, getOrder, submitReturn } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CheckoutStepper, Breadcrumb } from '../components/UI';

const STEPS = ['Select Order', 'Select Items', 'Confirmed'];

const REASONS = [
  'Item arrived damaged',
  'Wrong item received',
  'Item not as described',
  'Changed my mind',
  'Duplicate order',
  'Other',
];

export default function ReturnRequestPage() {
  const [step, setStep] = useState(0);
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [reason, setReason] = useState('');
  const [returnResult, setReturnResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { isAuth, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Pre-select order if coming from order detail page (?orderId=xxx)
  const preOrderId = searchParams.get('orderId');

  useEffect(() => {
    if (authLoading) return;
    if (!isAuth) { navigate('/login'); return; }
    getOrders()
      .then(d => {
        setOrders(d.orders);
        if (preOrderId) {
          const match = d.orders.find(o => o.id === preOrderId);
          if (match) {
            setSelectedOrderId(match.id);
            setSelectedOrder(match);
            setStep(1);
          }
        }
      })
      .catch(() => addToast('Failed to load orders', 'error'))
      .finally(() => setLoading(false));
  }, [isAuth, authLoading]);

  const handleSelectOrder = () => {
    if (!selectedOrderId) { addToast('Please select an order', 'info'); return; }
    const order = orders.find(o => o.id === selectedOrderId);
    setSelectedOrder(order);
    setSelectedItems([]);
    setReason('');
    setStep(1);
  };

  const toggleItem = (itemName) => {
    setSelectedItems(prev =>
      prev.includes(itemName) ? prev.filter(i => i !== itemName) : [...prev, itemName]
    );
  };

  const handleSubmit = async () => {
    if (selectedItems.length === 0) { addToast('Select at least one item to return', 'info'); return; }
    if (!reason) { addToast('Please select a reason', 'info'); return; }
    setSubmitting(true);
    try {
      const result = await submitReturn(selectedOrderId, { items: selectedItems, reason });
      setReturnResult(result.returnRequest);
      setStep(2);
    } catch {
      addToast('Failed to submit return request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <div className="container" style={{ padding: '32px 24px', maxWidth: 680 }}>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Orders', to: '/orders' }, { label: 'Return Request' }]} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 32 }}>Request a Return</h1>

      <CheckoutStepper steps={STEPS} current={step} />

      {/* ── Step 0: Select Order ── */}
      {step === 0 && (
        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 20 }}>Which order do you want to return?</h2>
          {orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No orders found</h3>
              <p style={{ marginBottom: 20 }}>You haven't placed any orders yet.</p>
              <Link to="/products" className="btn btn-primary">Start Shopping</Link>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {orders.map(order => (
                  <label
                    key={order.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                      border: `2px solid ${selectedOrderId === order.id ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: 10, cursor: 'pointer', transition: 'border-color 0.15s',
                      background: selectedOrderId === order.id ? 'rgba(200,75,49,0.04)' : '#fff',
                    }}
                  >
                    <input
                      type="radio"
                      name="order"
                      value={order.id}
                      checked={selectedOrderId === order.id}
                      onChange={() => setSelectedOrderId(order.id)}
                      style={{ accentColor: 'var(--accent)', width: 16, height: 16 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{order.id}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''} · ${order.total.toFixed(2)} · {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`badge badge-${order.status}`}>{order.status}</span>
                  </label>
                ))}
              </div>
              <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleSelectOrder}>
                Continue →
              </button>
            </>
          )}
        </div>
      )}

      {/* ── Step 1: Select Items + Reason ── */}
      {step === 1 && selectedOrder && (
        <div>
          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 16 }}>Select items to return</h2>
            {selectedOrder.items.map((item, idx) => (
              <label
                key={idx}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0',
                  borderBottom: idx < selectedOrder.items.length - 1 ? '1px solid var(--border)' : 'none',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.name)}
                  onChange={() => toggleItem(item.name)}
                  style={{ accentColor: 'var(--accent)', width: 16, height: 16, flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Qty: {item.quantity} · ${(item.unitPrice * item.quantity).toFixed(2)}</div>
                </div>
              </label>
            ))}
          </div>

          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 16 }}>Reason for return</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {REASONS.map(r => (
                <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    style={{ accentColor: 'var(--accent)', width: 15, height: 15 }}
                  />
                  {r}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(0)}>← Back</button>
            <button className="btn btn-primary" style={{ flex: 2 }} disabled={submitting} onClick={handleSubmit}>
              {submitting ? 'Submitting…' : 'Submit Return Request'}
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Confirmed ── */}
      {step === 2 && returnResult && (
        <div className="card" style={{ padding: 36, textAlign: 'center' }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 10 }}>Return Request Submitted!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.7 }}>
            We've received your return request. You'll hear back within 2–3 business days.
          </p>
          <div className="card" style={{ padding: 16, marginBottom: 28, textAlign: 'left', background: 'var(--bg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
              <span style={{ color: 'var(--text-muted)' }}>Request ID</span>
              <span style={{ fontWeight: 700 }}>{returnResult.id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
              <span style={{ color: 'var(--text-muted)' }}>Order</span>
              <span style={{ fontWeight: 600 }}>{returnResult.orderId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
              <span style={{ color: 'var(--text-muted)' }}>Items</span>
              <span style={{ fontWeight: 600 }}>{returnResult.items.join(', ')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 14 }}>
              <span style={{ color: 'var(--text-muted)' }}>Reason</span>
              <span style={{ fontWeight: 600 }}>{returnResult.reason}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/orders" className="btn btn-secondary">View Orders</Link>
            <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
          </div>
        </div>
      )}
    </div>
  );
}

