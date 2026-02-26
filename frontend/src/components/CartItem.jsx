import React, { useState } from 'react';
import { formatPrice } from '../utils/helpers';
import './CartItem.css';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  // BUG-F02: Quantity stepper allows setting to 0 but doesn't remove item
  const [quantity, setQuantity] = useState(item.quantity);

  const handleDecrement = () => {
    const newQty = quantity - 1;
    // BUG-F02: Should remove item when quantity reaches 0, but doesn't
    setQuantity(newQty);
    onUpdateQuantity(item.productId, newQty);
  };

  const handleIncrement = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    onUpdateQuantity(item.productId, newQty);
  };

  const handleQuantityChange = (e) => {
    const newQty = parseInt(e.target.value) || 0;
    setQuantity(newQty);
    onUpdateQuantity(item.productId, newQty);
  };

  return (
    <div className="cart-item">
      <img 
        src={item.image || '/placeholder.jpg'} 
        alt={item.name}
        className="cart-item-image"
      />

      <div className="cart-item-details">
        <h3 className="cart-item-name">{item.name}</h3>
        <p className="cart-item-price">{formatPrice(item.price)}</p>
      </div>

      <div className="cart-item-quantity">
        <button
          onClick={handleDecrement}
          className="qty-btn"
          data-testid="qty-decrement"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          className="qty-input"
          data-testid="qty-input"
          min="0"
        />
        <button
          onClick={handleIncrement}
          className="qty-btn"
          data-testid="qty-increment"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <div className="cart-item-total">
        <p className="item-total">{formatPrice(item.price * quantity)}</p>
      </div>

      <button
        onClick={() => onRemove(item.productId)}
        className="remove-btn"
        data-testid={`remove-cart-item-${item.productId}`}
        aria-label="Remove item"
      >
        ✕
      </button>
    </div>
  );
};

export default CartItem;
