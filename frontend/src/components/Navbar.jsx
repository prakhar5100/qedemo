import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { getItemCount } = useCart();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" data-testid="navbar-logo">
          <span className="logo-text">ShopSphere</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          
          <div 
            className="nav-dropdown"
            onMouseEnter={() => setShowCategoriesDropdown(true)}
            onMouseLeave={() => setShowCategoriesDropdown(false)}
          >
            <span className="nav-link dropdown-trigger">Categories ▼</span>
            {showCategoriesDropdown && (
              <div className="dropdown-menu">
                <Link to="/category/electronics" className="dropdown-item">Electronics</Link>
                <Link to="/category/apparel" className="dropdown-item">Apparel</Link>
                <Link to="/category/home" className="dropdown-item">Home & Garden</Link>
                <Link to="/category/deals" className="dropdown-item">Deals</Link>
              </div>
            )}
          </div>

          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </div>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="search-input"
            className="search-input"
          />
          <button type="submit" className="search-button">🔍</button>
        </form>

        <div className="navbar-actions">
          <Link to="/cart" className="cart-link" data-testid="cart-icon">
            <span className="cart-icon">🛒</span>
            {getItemCount() > 0 && (
              <span className="cart-badge" data-testid="cart-badge">
                {getItemCount()}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div 
              className="user-menu"
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              <button className="user-menu-trigger">
                👤 {user?.firstName}
              </button>
              {showUserMenu && (
                <div className="dropdown-menu user-dropdown">
                  <Link to="/profile" className="dropdown-item">Profile</Link>
                  <Link to="/orders" className="dropdown-item">Orders</Link>
                  <Link to="/wishlist" className="dropdown-item">Wishlist</Link>
                  <button onClick={handleLogout} className="dropdown-item logout-btn">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-link">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
