import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import { Breadcrumb, FilterSidebar, Pagination } from '../components/UI';

const CAT_LABELS = { electronics: 'Electronics', apparel: 'Apparel', home: 'Home & Garden', deals: '🏷️ Deals' };

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ categories: [], sort: '' });

  useEffect(() => {
    setLoading(true);
    const params = { category: slug, page, limit: 12 };
    if (filters.sort) params.sort = filters.sort;
    getProducts(params).then(d => { setProducts(d.products); setTotal(d.total); }).catch(console.error).finally(() => setLoading(false));
  }, [slug, page, filters]);

  useEffect(() => { setPage(1); }, [slug]);

  const label = CAT_LABELS[slug] || slug;

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }, { label }]} />
      <div style={{ display: 'flex', gap: 40 }}>
        <FilterSidebar filters={filters} onChange={f => { setFilters(f); setPage(1); }} categories={['electronics', 'apparel', 'home']} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}>{label}</h1>
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
