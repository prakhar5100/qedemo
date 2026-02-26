import React, { useNavigate } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import StarRating from '../components/StarRating';
import Breadcrumb from '../components/Breadcrumb';
import './WishlistPage.css';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/wishlist');
    }
  }, [isAuthenticated, navigate]);

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
  };

  const handleAddToCart = async (productId) => {
    await addToCart(productId, 1);
  };

  const breadcrumbItems = [
    { label: 'Wishlist', path: null }
  ];

  if (!isAuthenticated) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <Breadcrumb items={breadcrumbItems} />
        
        <h1>My Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <p>Your wishlist is empty</p>
            <Link to="/products" className="browse-btn">Browse Products</Link>
          </div>
        ) : (
          <>
            <p className="wishlist-count">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''}</p>
            
            <div className="wishlist-grid">
              {wishlist.map(product => (
                <div key={product.id} className="wishlist-item">
                  <Link to={`/products/${product.id}`} className="wishlist-image-link">
                    <img 
                      src={product.images?.[0] || '/placeholder.jpg'} 
                      alt={product.name}
                      className="wishlist-image"
                    />
                  </Link>

                  <div className="wishlist-info">
                    <Link to={`/products/${product.id}`}>
                      <h3 className="wishlist-name">{product.name}</h3>
                    </Link>
                    
                    <StarRating rating={product.rating} size="small" />
                    
                    <p className="wishlist-price">{formatPrice(product.price)}</p>

                    {product.stock > 0 ? (
                      <p className="in-stock">In Stock</p>
                    ) : (
                      <p className="out-of-stock">Out of Stock</p>
                    )}

                    <div className="wishlist-actions">
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className="add-to-cart-btn-wishlist"
                        disabled={product.stock === 0}
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleRemove(product.id)}
                        className="remove-btn-wishlist"
                        aria-label="Remove from wishlist"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
