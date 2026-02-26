import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import Breadcrumb from '../components/Breadcrumb';
import './SearchResultsPage.css';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query]);

  const performSearch = async () => {
    try {
      setLoading(true);
      const response = await searchAPI.search(query);
      setResults(response.data.results);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // BUG-F04: Shows 'Showing NaN results' when query returns 0 results
  const getResultCount = () => {
    if (results.length === 0) {
      // BUG-F04: Should return '0 results' but returns 'NaN results'
      return `Showing ${results.length / 0} results for "${query}"`;
    }
    return `Showing ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`;
  };

  const breadcrumbItems = [
    { label: 'Search Results', path: null }
  ];

  return (
    <div className="search-results-page">
      <div className="container">
        <Breadcrumb items={breadcrumbItems} />
        
        <h1>Search Results</h1>

        <div className="search-info">
          <p className="search-query">{getResultCount()}</p>
        </div>

        {loading ? (
          <div className="loading">Searching...</div>
        ) : results.length > 0 ? (
          <div className="product-grid">
            {results.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h2>No products found</h2>
            <p>Try searching with different keywords</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
