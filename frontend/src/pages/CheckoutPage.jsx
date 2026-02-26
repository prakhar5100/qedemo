import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CheckoutStepper } from '../components/UI';

const STEPS = ['Shipping', 'Payment', 'Review', 'Confirmed'];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState({ firstName: '', lastName: '', street: '', city: '', state: '', zip: '', email: '' });
  const [payment, setPayment] = useState({ cardNumber: '', expiry: '', cvv: '', name: '' });
  const [order, setOrder] = useState(null);
  const [errors, setErrors] = useState({});
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // BUG-F03: Email validation is missing — any string passes
  // BUG-F16: Validation always returns true — form submits with empty fields
  const validateShipping = () => {
    const e = {};
    if (!shipping.firstName) e.firstName = 'Required';
    if (!shipping.lastName) e.lastName = 'Required';
    if (!shipping.street) e.street = 'Required';
    if (!shipping.city) e.city = 'Required';
    if (!shipping.zip) e.zip = 'Required';
    if (!shipping.email) e.email = 'Required';
    // BUG-F03: Missing email format validation — should be:
    // if (shipping.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email)) e.email = 'Invalid email';
    setErrors(e);
    // BUG-F16: Always returns true regardless of validation errors!
    return true; // Should be: return Object.keys(e).length === 0;
  };

  // BUG-F14: No loading state — user can click "Place Order" multiple times
  // Creates duplicate orders. Should disable button during API call.
  const handlePlaceOrder = async () => {
    try {
      const data = await placeOrder({ shippingAddress: shipping });
      setOrder(data.order);
      await clearCart();
      setStep(3);
    } catch { addToast('Failed to place order', 'error'); }
  };

  return (
    <div className="container" style={{ padding: '32px 24px', maxWidth: 800 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 32 }}>Checkout</h1>
      <CheckoutStepper steps={STEPS} current={step} />

      {/* Step 0: Shipping */}
      {step === 0 && (
        <form id="checkout-form" onSubmit={e => { e.preventDefault(); if (validateShipping()) setStep(1); }}>
          <h2 style={{ fontWeight: 700, marginBottom: 20 }}>Shipping Address</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {['firstName', 'lastName'].map(field => (
              <div className="form-group" key={field}>
                <label className="form-label">{field === 'firstName' ? 'First Name' : 'Last Name'}</label>
                <input name={field} className={`form-input ${errors[field] ? 'error' : ''}`} value={shipping[field]} onChange={e => setShipping(s => ({ ...s, [field]: e.target.value }))} defaultValue={field === 'firstName' ? user?.firstName : user?.lastName} />
                {errors[field] && <span className="form-error">{errors[field]}</span>}
              </div>
            ))}
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            {/* BUG-F03: type="text" instead of type="email", and no validation */}
            <input name="email" type="text" className={`form-input ${errors.email ? 'error' : ''}`} value={shipping.email} onChange={e => setShipping(s => ({ ...s, email: e.target.value }))} placeholder="Enter email address" />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>
          {['street', 'city', 'state', 'zip'].map(field => (
            <div className="form-group" key={field}>
              <label className="form-label" style={{ textTransform: 'capitalize' }}>{field === 'zip' ? 'ZIP Code' : field}</label>
              <input name={field} className={`form-input ${errors[field] ? 'error' : ''}`} value={shipping[field]} onChange={e => setShipping(s => ({ ...s, [field]: e.target.value }))} />
              {errors[field] && <span className="form-error">{errors[field]}</span>}
            </div>
          ))}
          <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: 8 }}>Continue to Payment →</button>
        </form>
      )}

      {/* Step 1: Payment */}
      {step === 1 && (
        <div>
          <h2 style={{ fontWeight: 700, marginBottom: 20 }}>Payment Details</h2>
          <div className="form-group">
            <label className="form-label">Cardholder Name</label>
            <input name="card-name" className="form-input" value={payment.name} onChange={e => setPayment(p => ({ ...p, name: e.target.value }))} placeholder="Name on card" />
          </div>
          <div className="form-group">
            <label className="form-label">Card Number</label>
            <input name="card-number" className="form-input" value={payment.cardNumber} onChange={e => setPayment(p => ({ ...p, cardNumber: e.target.value }))} placeholder="1234 5678 9012 3456" maxLength={19} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Expiry</label>
              <input name="expiry" className="form-input" value={payment.expiry} onChange={e => setPayment(p => ({ ...p, expiry: e.target.value }))} placeholder="MM/YY" />
            </div>
            <div className="form-group">
              <label className="form-label">CVV</label>
              <input name="cvv" className="form-input" value={payment.cvv} onChange={e => setPayment(p => ({ ...p, cvv: e.target.value }))} placeholder="123" maxLength={4} />
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>🔒 This is a demo — no real payment is processed.</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setStep(0)} className="btn btn-secondary">← Back</button>
            <button onClick={() => setStep(2)} className="btn btn-primary btn-lg">Review Order →</button>
          </div>
        </div>
      )}

      {/* Step 2: Review */}
      {step === 2 && (
        <div>
          <h2 style={{ fontWeight: 700, marginBottom: 20 }}>Review Your Order</h2>
          <div className="card" style={{ padding: 20, marginBottom: 24 }}>
            {cart.items.map(item => (
              <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                <span>{item.name} × {item.quantity}</span>
                <span style={{ fontWeight: 600 }}>${(item.unitPrice * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 0', fontWeight: 700 }}>
              <span>Total</span><span>${cart.total?.toFixed(2)}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setStep(1)} className="btn btn-secondary">← Back</button>
            <button onClick={handlePlaceOrder} className="btn btn-primary btn-lg">Place Order ✓</button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmed */}
      {step === 3 && order && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 12 }}>Order Confirmed!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>Order #{order.id}</p>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Thank you for your order. You'll receive a confirmation shortly.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <a href={`/orders/${order.id}`} className="btn btn-secondary">View Order</a>
            <a href="/" className="btn btn-primary">Continue Shopping</a>
          </div>
        </div>
      )}
    </div>
  );
}
