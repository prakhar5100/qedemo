import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import Breadcrumb from '../components/Breadcrumb';
import Pagination from '../components/Pagination';
import './CategoryPage.css';

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    loadCategoryData();
  }, [slug, currentPage, sortBy]);

  const loadCategoryData = async () => {
    try {
      setLoading(true);
      const [categoryRes, productsRes] = await Promise.all([
        categoriesAPI.getBySlug(slug),
        productsAPI.getAll({ 
          category: slug, 
          page: currentPage,
          limit: 12,
          ...(sortBy && { sort: sortBy })
        })
      ]);

      setCategory(categoryRes.data.category);
      setProducts(productsRes.data.products);
      setTotalPages(productsRes.data.totalPages || 1);
    } catch (error) {
      console.error('Failed to load category:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !category) {
    return <div className="loading">Loading category...</div>;
  }

  const breadcrumbItems = category ? [
    { label: 'Products', path: '/products' },
    { label: category.name, path: null }
  ] : [];

  return (
    <div className="category-page">
      <div className="container">
        <Breadcrumb items={breadcrumbItems} />

        {category && (
          <div className="category-header">
            <h1>{category.name}</h1>
            <p>{category.description}</p>
          </div>
        )}

        <div className="category-controls">
          <p className="results-count">
            {products.length} products
          </p>
          <div className="sort-controls">
            <label>
              Sort by:
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                data-testid="sort-select"
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
                <p>No products found in this category</p>
              </div>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
