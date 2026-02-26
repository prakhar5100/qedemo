import { Link } from 'react-router-dom';
import { useState } from 'react';

export function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {items.map((item, idx) => (
        <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {idx > 0 && <span className="breadcrumb-sep">/</span>}
          {item.to ? <Link to={item.to}>{item.label}</Link> : <span style={{ color: 'var(--text)' }}>{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function Pagination({ page, total, perPage = 12, onPage }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <button className="page-btn" data-testid="page-prev" onClick={() => onPage(page - 1)} disabled={page === 1}>‹</button>
      {pages.map(p => (
        <button key={p} className={`page-btn ${page === p ? 'active' : ''}`} data-testid={`page-btn-${p}`} onClick={() => onPage(p)}>{p}</button>
      ))}
      <button className="page-btn" data-testid="page-next" onClick={() => onPage(page + 1)} disabled={page === totalPages}>›</button>
    </div>
  );
}

export function StarRating({ rating, interactive = false, onRate }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="stars" style={{ cursor: interactive ? 'pointer' : 'default' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star}
          style={{ color: star <= (hover || rating) ? '#f59e0b' : '#d1d5db', fontSize: 20 }}
          onClick={() => interactive && onRate && onRate(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}>
          ★
        </span>
      ))}
    </div>
  );
}

export function StatusBadge({ status, orderId }) {
  return <span className={`badge badge-${status}`} data-testid={`order-status-${orderId}`}>{status}</span>;
}

export function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div>
      {items.map((item, idx) => (
        <div key={idx} className="accordion-item">
          <button className="accordion-trigger" onClick={() => setOpen(open === idx ? null : idx)}>
            <span>{item.question}</span>
            <span style={{ flexShrink: 0 }}>{open === idx ? '−' : '+'}</span>
          </button>
          {open === idx && <div className="accordion-content">{item.answer}</div>}
        </div>
      ))}
    </div>
  );
}

export function FilterSidebar({ filters, onChange, categories }) {
  return (
    <aside style={{ width: 220, flexShrink: 0 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Category</div>
        {categories.map(cat => (
          <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 14, cursor: 'pointer' }}>
            <input type="checkbox" data-testid={`filter-${cat}`} checked={filters.categories.includes(cat)} onChange={e => {
              const updated = e.target.checked ? [...filters.categories, cat] : filters.categories.filter(c => c !== cat);
              onChange({ ...filters, categories: updated });
            }} />
            <span style={{ textTransform: 'capitalize' }}>{cat}</span>
          </label>
        ))}
      </div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Sort By</div>
        <select data-testid="sort-select" value={filters.sort} onChange={e => onChange({ ...filters, sort: e.target.value })}
          style={{ width: '100%', padding: '8px 10px', border: '1.5px solid var(--border)', borderRadius: 6, fontSize: 14, background: '#fff' }}>
          <option value="">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>
    </aside>
  );
}

export function CheckoutStepper({ steps, current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40 }}>
      {steps.map((step, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', flex: idx < steps.length - 1 ? 1 : 'initial' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, background: idx < current ? 'var(--success)' : idx === current ? 'var(--accent)' : 'var(--border)', color: idx <= current ? '#fff' : 'var(--text-muted)' }}>
              {idx < current ? '✓' : idx + 1}
            </div>
            <span style={{ fontSize: 12, fontWeight: idx === current ? 700 : 400, color: idx === current ? 'var(--text)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>{step}</span>
          </div>
          {idx < steps.length - 1 && <div style={{ flex: 1, height: 2, background: idx < current ? 'var(--success)' : 'var(--border)', margin: '0 8px', marginBottom: 24 }} />}
        </div>
      ))}
    </div>
  );
}
