import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';
import Breadcrumb from '../components/Breadcrumb';
import './ProductListPage.css';

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState('');
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadProducts();
  }, [currentPage, itemsPerPage, sortBy, filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        ...(sortBy && { sort: sortBy }),
        ...(filters.categories?.length > 0 && { category: filters.categories[0] })
      };

      const response = await productsAPI.getAll(params);
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const breadcrumbItems = [
    { label: 'Products', path: null }
  ];

  return (
    <div className="product-list-page">
      <div className="container">
        <Breadcrumb items={breadcrumbItems} />
        
        <h1>All Products</h1>

        <div className="product-list-container">
          <aside className="sidebar">
            <FilterSidebar
              onFilterChange={handleFilterChange}
              currentFilters={filters}
            />
          </aside>

          <div className="products-main">
            <div className="products-header">
              <p className="results-count">
                Showing {products.length} products
              </p>
              <div className="sort-controls">
                <label>
                  Sort by:
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    data-testid="sort-select"
                    className="sort-select"
                  >
                    <option value="">Default</option>
                    <option value="name">Name</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>
                </label>
              </div>
            </div>

            {loading ? (
              <div className="loading">Loading products...</div>
            ) : (
              <>
                <div className="product-grid" id="product-grid">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {products.length === 0 && (
                  <div className="no-results">
                    <p>No products found</p>
                  </div>
                )}

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={setItemsPerPage}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
