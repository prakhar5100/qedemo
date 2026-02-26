import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const location = useLocation();

  return (
    <div className="not-found-page">
      <div className="container">
        <div className="error-content">
          <h1 className="error-code">404</h1>
          <h2>Page Not Found</h2>
          <p className="error-message">
            The page <code>{location.pathname}</code> doesn't exist.
          </p>
          <p>It looks like you've hit a broken link or the page has been moved.</p>

          <div className="error-actions">
            <Link to="/" className="home-link">
              Go to Homepage
            </Link>
            <Link to="/products" className="products-link">
              Browse Products
            </Link>
          </div>

          <div className="suggested-links">
            <h3>Suggested Links:</h3>
            <ul>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/category/electronics">Electronics</Link></li>
              <li><Link to="/category/apparel">Apparel</Link></li>
              <li><Link to="/category/home">Home & Garden</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Support</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
