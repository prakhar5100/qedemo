// About Page
export function AboutPage() {
  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: 800 }}>
      <h1 id="about" style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 16 }}>About ShopSphere</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.8, marginBottom: 40 }}>
        ShopSphere is a demo e-commerce platform created to showcase modern web shopping experiences.
      </p>

      <section id="our-story" style={{ marginBottom: 48 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 16 }}>Our Story</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
          Founded in 2020, ShopSphere started as a small project to make quality products accessible to everyone. Today we serve thousands of customers across the globe with a curated selection of electronics, apparel, and home goods.
        </p>
      </section>

      <section id="values" style={{ marginBottom: 48 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 16 }}>Our Values</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[['🎯', 'Quality First', 'Every product is vetted for quality and value.'], ['🌱', 'Sustainability', 'We partner with eco-conscious brands.'], ['💙', 'Customer Love', '4.8/5 average satisfaction rating.']].map(([icon, title, desc]) => (
            <div key={title} className="card" style={{ padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="team" style={{ marginBottom: 48 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 20 }}>Our Team</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {[['👩‍💼', 'Sarah Chen', 'CEO'], ['👨‍💻', 'Marcus Webb', 'CTO'], ['👩‍🎨', 'Priya Nair', 'Design'], ['👨‍📊', 'Tom Bradley', 'Operations']].map(([icon, name, role]) => (
            <div key={name} className="card" style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{role}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact-info">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 16 }}>Contact Info</h2>
        <p style={{ color: 'var(--text-muted)' }}>📍 123 Commerce St, San Francisco, CA 94102</p>
        <p style={{ color: 'var(--text-muted)' }}>📧 hello@shopsphere.demo</p>
        <p style={{ color: 'var(--text-muted)' }}>📞 (415) 555-0123</p>
      </section>
    </div>
  );
}

// Contact Page
import { useState } from 'react';
import { submitContact } from '../services/api';
import { useToast } from '../context/ToastContext';

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await submitContact(form);
      // BUG-B07 visible here: res is {} instead of { message: 'sent' }
      if (res.message) { addToast('Message sent!', 'success'); }
      else { addToast('Response missing confirmation', 'info'); } // exposes BUG-B07
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch { addToast('Failed to send message', 'error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: 640 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 8 }}>Contact Us</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 40 }}>We'd love to hear from you. Send us a message and we'll respond within 24 hours.</p>
      <div className="card" style={{ padding: 32 }}>
        <form id="contact-form" onSubmit={handleSubmit}>
          {['name', 'email', 'subject'].map(field => (
            <div className="form-group" key={field}>
              <label className="form-label" style={{ textTransform: 'capitalize' }}>{field}</label>
              <input name={field} type={field === 'email' ? 'email' : 'text'} className="form-input" value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} required />
            </div>
          ))}
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea name="message" className="form-input" rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required style={{ resize: 'vertical' }} />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>{loading ? 'Sending…' : 'Send Message'}</button>
        </form>
      </div>
    </div>
  );
}

// FAQ Page
import { Accordion } from '../components/UI';
const faqData = {
  'Shipping': [
    { question: 'How long does shipping take?', answer: 'Standard shipping takes 5-7 business days. Express shipping (2-3 days) is available at checkout for an additional fee.' },
    { question: 'Do you offer free shipping?', answer: 'Yes! Orders over $50 qualify for free standard shipping within the continental US.' },
    { question: 'Can I track my order?', answer: 'Yes, you\'ll receive a tracking number via email once your order ships. You can also track it in the Orders section of your account.' },
  ],
  'Returns': [
    { question: 'What is your return policy?', answer: 'We offer a 30-day return policy on most items. Products must be in original condition with tags attached.' },
    { question: 'How do I initiate a return?', answer: 'Log into your account, navigate to Orders, and select "Return Item" next to the product you\'d like to return.' },
  ],
  'Account': [
    { question: 'How do I create an account?', answer: 'Click "Sign up" in the top navigation and fill in your details. It only takes a minute!' },
    { question: 'I forgot my password. What do I do?', answer: 'Click "Forgot password?" on the sign-in page and we\'ll send a reset link to your email.' },
  ],
  'Payment': [
    { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and Apple Pay. This is a demo — no real payments are processed.' },
    { question: 'Is my payment information secure?', answer: 'All transactions are encrypted with SSL. We never store your card details on our servers.' },
  ],
};

export function FaqPage() {
  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: 720 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 8 }}>Frequently Asked Questions</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 48 }}>Find answers to common questions below.</p>
      {Object.entries(faqData).map(([section, items]) => (
        <section key={section} id={`${section.toLowerCase()}-faq`} style={{ marginBottom: 40 }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 16 }}>{section}</h2>
          <Accordion items={items} />
        </section>
      ))}
    </div>
  );
}

// Profile Page
import { useAuth } from '../context/AuthContext';
export function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="container" style={{ padding: '32px 24px', maxWidth: 600 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 32 }}>My Profile</h1>
      <div className="card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24, fontWeight: 700 }}>
            {user.firstName[0]}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{user.firstName} {user.lastName}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>{user.email}</div>
          </div>
        </div>
        {[['First Name', user.firstName], ['Last Name', user.lastName], ['Email', user.email], ['Member Since', new Date(user.createdAt).toLocaleDateString()]].map(([label, val]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
            <span style={{ color: 'var(--text-muted)' }}>{label}</span>
            <span style={{ fontWeight: 600 }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Wishlist Page
import { useEffect } from 'react';
import { getWishlist, removeFromWishlist } from '../services/api';
import ProductCard from '../components/ProductCard';
export function WishlistPage() {
  const [items, setItems] = useState([]);
  const { addToast } = useToast();
  useEffect(() => { getWishlist().then(d => setItems(d.items)).catch(() => {}); }, []);
  const remove = async (id) => {
    await removeFromWishlist(id);
    setItems(prev => prev.filter(p => p.id !== id));
    addToast('Removed from wishlist', 'info');
  };
  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 32 }}>My Wishlist</h1>
      {items.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">♡</div><h3>Your wishlist is empty</h3></div>
      ) : (
        <div className="product-grid">{items.map(p => <ProductCard key={p.id} product={p} />)}</div>
      )}
    </div>
  );
}

// Order Detail Page
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getOrder } from '../services/api';
import { StatusBadge, Breadcrumb } from '../components/UI';
export function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getOrder(id).then(d => setOrder(d.order)).catch(console.error).finally(() => setLoading(false)); }, [id]);
  if (loading) return <div className="loader"><div className="spinner" /></div>;
  if (!order) return <div className="container" style={{ padding: '40px 24px' }}><h2>Order not found</h2></div>;
  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Orders', to: '/orders' }, { label: order.id }]} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}>Order {order.id}</h1>
        <StatusBadge status={order.status} orderId={order.id} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>
        <div>
          <div className="card" style={{ padding: 20, marginBottom: 24 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Items</h3>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                <span>{item.name} × {item.quantity}</span>
                <span style={{ fontWeight: 600 }}>${(item.unitPrice * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 0', fontWeight: 700 }}><span>Total</span><span>${order.total.toFixed(2)}</span></div>
          </div>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Tracking</h3>
            {order.timeline.map((event, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, paddingBottom: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                  {i < order.timeline.length - 1 && <div style={{ width: 2, flex: 1, background: 'var(--border)', minHeight: 20 }} />}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{event.message}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(event.timestamp).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{ padding: 20, height: 'fit-content' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Shipping Address</h3>
          {order.shippingAddress && Object.entries(order.shippingAddress).map(([k, v]) => v && <div key={k} style={{ fontSize: 14, color: 'var(--text-muted)' }}>{v}</div>)}
        </div>
      </div>
    </div>
  );
}

// Not Found
export function NotFoundPage() {
  return (
    <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>🔍</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', marginBottom: 12 }}>404 — Not Found</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 16 }}>This page doesn't exist or has been moved.</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary">Go Home</Link>
        <Link to="/products" className="btn btn-secondary">Browse Products</Link>
        <Link to="/contact" className="btn btn-secondary">Contact Support</Link>
      </div>
      <div style={{ marginTop: 40 }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>Or try one of these:</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/category/electronics">Electronics</Link>
          <Link to="/category/apparel">Apparel</Link>
          <Link to="/category/home">Home</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/about">About</Link>
        </div>
      </div>
    </div>
  );
}

// Privacy & Terms (stubs)
export function PrivacyPage() {
  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: 720 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 24 }}>Privacy Policy</h1>
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>This is a demo application. No real personal data is collected or stored. All data is for demonstration purposes only.</p>
      <p style={{ color: 'var(--text-muted)', marginTop: 16, lineHeight: 1.8 }}>Cookies may be used for session management only. No third-party tracking is in use on this demo application.</p>
    </div>
  );
}
export function TermsPage() {
  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: 720 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 24 }}>Terms of Service</h1>
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>This is a demo application built for QE automation testing purposes. By using this site, you agree that it is for demo and testing use only.</p>
      <p style={{ color: 'var(--text-muted)', marginTop: 16, lineHeight: 1.8 }}>No real purchases, payments, or transactions are processed. All products, orders, and user data are fictional.</p>
    </div>
  );
}
