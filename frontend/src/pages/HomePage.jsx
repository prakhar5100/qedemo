import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        productsAPI.getFeatured(),
        categoriesAPI.getAll()
      ]);
      
      setFeaturedProducts(productsRes.data.products);
      setCategories(categoriesRes.data.categories);
    } catch (error) {
      console.error('Failed to load homepage data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-content">
          <h1>Welcome to ShopSphere</h1>
          <p>Discover amazing products at unbeatable prices</p>
          <Link to="/products" className="hero-cta">Shop Now</Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section" id="featured">
        <div className="container">
          <h2>Featured Products</h2>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="product-grid" id="product-grid">
              {featuredProducts.slice(0, 8).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className="section-footer">
            <Link to="/products" className="view-all-link">View All Products →</Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section" id="categories">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="category-card"
              >
                <div className="category-image">
                  <img src={category.image} alt={category.name} />
                </div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions */}
      <section className="promotions-section" id="promotions">
        <div className="container">
          <h2>Special Offers</h2>
          <div className="promotions-grid">
            <div className="promo-card">
              <h3>Free Shipping</h3>
              <p>On orders over $50</p>
            </div>
            <div className="promo-card">
              <h3>30-Day Returns</h3>
              <p>Easy returns policy</p>
            </div>
            <div className="promo-card">
              <h3>24/7 Support</h3>
              <p>We're here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section" id="newsletter">
        <div className="container">
          <h2>Stay Updated</h2>
          <p>Subscribe to our newsletter for exclusive deals</p>
          <form className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              className="newsletter-input"
              name="email"
            />
            <button type="submit" className="newsletter-btn">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
