import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { formatPrice } from '../utils/helpers';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import StarRating from '../components/StarRating';
import Breadcrumb from '../components/Breadcrumb';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      // Note: API returns productName instead of name due to BUG-B03
      const productData = response.data.product;
      
      // Workaround for backend bug
      if (productData.productName && !productData.name) {
        productData.name = productData.productName;
      }
      
      setProduct(productData);

      // Load related products
      const relatedRes = await productsAPI.getAll({ 
        category: productData.category,
        limit: 4 
      });
      setRelatedProducts(relatedRes.data.products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    await addToCart(product.id, quantity);
  };

  const handleWishlistToggle = async () => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
  };

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  const breadcrumbItems = [
    { label: 'Products', path: '/products' },
    { label: product.category, path: `/category/${product.category}` },
    { label: product.name, path: null }
  ];

  return (
    <div className="product-detail-page">
      <div className="container">
        <Breadcrumb items={breadcrumbItems} />

        <div className="product-detail">
          <div className="product-images">
            <img 
              src={product.images?.[0] || '/placeholder.jpg'} 
              alt={product.name}
              className="main-image"
            />
          </div>

          <div className="product-info-detail">
            <h1>{product.name}</h1>

            <div className="product-rating-section">
              <StarRating rating={product.rating} />
              <span className="review-count">({product.reviewCount} reviews)</span>
            </div>

            <div className="product-price-detail">
              <span className="current-price">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <span className="original-price">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <div className="product-stock">
              {product.stock > 0 ? (
                <span className="in-stock">In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            <div className="product-actions-detail">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="quantity-input"
                />
              </div>

              <button
                onClick={handleAddToCart}
                className="add-to-cart-btn-detail"
                data-testid={`add-to-cart-${product.id}`}
                disabled={product.stock === 0}
              >
                Add to Cart
              </button>

              <button
                onClick={handleWishlistToggle}
                className="wishlist-btn-detail"
                aria-label="Add to wishlist"
              >
                {isInWishlist(product.id) ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
              </button>
            </div>

            <div className="product-tags">
              {product.tags?.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Description Section */}
        <section className="product-section" id="description">
          <h2>Description</h2>
          <p>{product.description}</p>
        </section>

        {/* Specifications Section */}
        {product.specs && (
          <section className="product-section" id="specifications">
            <h2>Specifications</h2>
            <table className="specs-table">
              <tbody>
                {Object.entries(product.specs).map(([key, value]) => (
                  <tr key={key}>
                    <td className="spec-label">{key.replace(/_/g, ' ')}</td>
                    <td className="spec-value">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Reviews Section */}
        <section className="product-section" id="reviews">
          <h2>Customer Reviews</h2>
          <p>Average Rating: {product.rating} / 5</p>
        </section>

        {/* Related Products Section */}
        {/* BUG-F05: Related product links have href='#' instead of actual URLs */}
        <section className="product-section" id="related-products">
          <h2>Related Products</h2>
          <div className="related-products-grid">
            {relatedProducts.map(relatedProduct => (
              <div key={relatedProduct.id} className="related-product-card">
                {/* BUG-F05: Using href='#' instead of proper routing */}
                <a href="#" className="related-product-link">
                  <img 
                    src={relatedProduct.images?.[0]} 
                    alt={relatedProduct.name}
                  />
                  <h4>{relatedProduct.name}</h4>
                  <p>{formatPrice(relatedProduct.price)}</p>
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetailPage;
