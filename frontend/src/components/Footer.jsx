import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>Company</h3>
          <Link to="/about" className="footer-link">About Us</Link>
          <Link to="/careers" className="footer-link">Careers</Link>
          <Link to="/blog" className="footer-link">Blog</Link>
          <Link to="/press" className="footer-link">Press</Link>
          <Link to="/privacy" className="footer-link">Privacy Policy</Link>
          <Link to="/terms" className="footer-link">Terms of Service</Link>
        </div>

        <div className="footer-column">
          <h3>Shop</h3>
          <Link to="/products" className="footer-link">All Products</Link>
          <Link to="/category/electronics" className="footer-link">Electronics</Link>
          <Link to="/category/apparel" className="footer-link">Apparel</Link>
          <Link to="/category/home" className="footer-link">Home & Garden</Link>
          <Link to="/category/deals" className="footer-link">Deals</Link>
          <Link to="/wishlist" className="footer-link">Wishlist</Link>
        </div>

        <div className="footer-column">
          <h3>Support</h3>
          <Link to="/faq" className="footer-link">FAQ</Link>
          <Link to="/contact" className="footer-link">Contact Us</Link>
          <Link to="/returns" className="footer-link">Return Policy</Link>
          <Link to="/shipping" className="footer-link">Shipping Info</Link>
          <Link to="/size-guide" className="footer-link">Size Guide</Link>
          <Link to="/order-track" className="footer-link">Order Tracking</Link>
        </div>

        <div className="footer-column">
          <h3>Social</h3>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-link">
            Twitter
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-link">
            Instagram
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-link">
            LinkedIn
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-link">
            Facebook
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer-link">
            YouTube
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 ShopSphere. All rights reserved. | QE Demo Platform</p>
      </div>
    </footer>
  );
};

export default Footer;
