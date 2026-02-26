import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/helpers';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import StarRating from './StarRating';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product.id, 1);
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
  };

  return (
    <div className="product-card" data-testid={`product-card-${product.id}`}>
      <Link to={`/products/${product.id}`} className="product-card-link">
        <div className="product-image-container">
          <img 
            src={product.images?.[0] || '/placeholder.jpg'} 
            alt={product.name}
            className="product-image"
          />
          {product.originalPrice > product.price && (
            <span className="discount-badge">
              Sale
            </span>
          )}
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          
          <div className="product-rating">
            <StarRating rating={product.rating} size="small" />
            <span className="review-count">({product.reviewCount})</span>
          </div>

          <div className="product-price-container">
            <span className="product-price">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="product-original-price">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="product-actions">
            <button
              onClick={handleAddToCart}
              className="add-to-cart-btn"
              data-testid={`add-to-cart-${product.id}`}
            >
              Add to Cart
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`wishlist-btn ${inWishlist ? 'in-wishlist' : ''}`}
              aria-label="Add to wishlist"
              data-testid={`wishlist-toggle-${product.id}`}
            >
              {inWishlist ? '❤️' : '🤍'}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
