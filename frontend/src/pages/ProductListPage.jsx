import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import { FilterSidebar, Pagination, Breadcrumb } from '../components/UI';

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ categories: [], sort: '' });
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (filters.sort) params.sort = filters.sort;
    getProducts(params).then(d => { setProducts(d.products); setTotal(d.total); }).catch(console.error).finally(() => setLoading(false));
  }, [page, filters]);

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Products' }]} />
      <div id="product-grid" style={{ display: 'flex', gap: 40 }}>
        <FilterSidebar filters={filters} onChange={f => { setFilters(f); setPage(1); }} categories={['electronics', 'apparel', 'home']} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}>All Products</h1>
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{total} products</span>
          </div>
          {loading ? <div className="loader"><div className="spinner" /></div> : (
            <>
              <div className="product-grid">{products.map(p => <ProductCard key={p.id} product={p} />)}</div>
              <Pagination page={page} total={total} perPage={12} onPage={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
