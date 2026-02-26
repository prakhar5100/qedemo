import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { searchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function SearchPage() {
  const [results, setResults] = useState([]);
  const [count, setCount] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  // BUG-F08: Query not trimmed — "  laptop  " searches differently than "laptop"
  const query = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    searchProducts(query).then(d => {
      setResults(d.results);
      setCount(d.count);
    }).catch(console.error).finally(() => setLoading(false));
  }, [query]);

  // BUG-F04: When count is 0, the display shows "Showing NaN results"
  // because count (0) is falsy and the ternary fallback produces NaN
const resultText = `Showing ${count !== 0 ? count : NaN} results for "${query}"`;
  // Correct would be: `Showing ${count} results for "${query}"`

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: 8 }}>Search Results</h1>
      {query && <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 14 }}>{resultText}</p>}
      {loading ? <div className="loader"><div className="spinner" /></div> : (
        results.length === 0 && count !== undefined ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No products found</h3>
            <p style={{ marginBottom: 24 }}>Try a different search term.</p>
            <Link to="/products" className="btn btn-primary">Browse All Products</Link>
          </div>
        ) : (
          <div className="product-grid">{results.map(p => <ProductCard key={p.id} product={p} />)}</div>
        )
      )}
    </div>
  );
}
