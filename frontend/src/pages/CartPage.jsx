import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import CartItem from '../components/CartItem';
import Breadcrumb from '../components/Breadcrumb';
import './CartPage.css';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleUpdateQuantity = async (productId, quantity) => {
    await updateQuantity(productId, quantity);
  };

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  const breadcrumbItems = [
    { label: 'Cart', path: null }
  ];

  if (cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <Breadcrumb items={breadcrumbItems} />
          <div className="empty-cart">
            <h1>Your Cart is Empty</h1>
            <p>Add some products to get started</p>
            <Link to="/products" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page" id="cart-page">
      <div className="container">
        <Breadcrumb items={breadcrumbItems} />
        
        <h1>Shopping Cart</h1>

        <div className="cart-container">
          <div className="cart-items-section">
            <div className="cart-items">
              {cart.items.map(item => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            <button
              onClick={clearCart}
              className="clear-cart-btn"
            >
              Clear Cart
            </button>
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>

            <div className="summary-row">
              <span>Tax (9%):</span>
              <span>{formatPrice(cart.tax)}</span>
            </div>

            <div className="summary-row total">
              <span>Total:</span>
              <span>{formatPrice(cart.total)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="checkout-btn"
              data-testid="proceed-to-checkout"
            >
              Proceed to Checkout
            </button>

            <Link to="/products" className="continue-shopping-link">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
