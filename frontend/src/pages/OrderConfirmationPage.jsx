import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { formatPrice } from '../utils/helpers';
import './OrderConfirmationPage.css';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = location.state?.orderId;
    if (orderId) {
      loadOrder(orderId);
    }
  }, [location]);

  const loadOrder = async (orderId) => {
    try {
      setLoading(true);
      const response = await ordersAPI.getById(orderId);
      setOrder(response.data.order);
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="order-confirmation-page">
        <div className="container">
          <div className="confirmation-message">
            <h1>Order Placed Successfully!</h1>
            <p>You will receive a confirmation email shortly.</p>
            <Link to="/" className="home-btn">Return to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation-page">
      <div className="container">
        <div className="confirmation-success">
          <div className="success-icon">✓</div>
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase</p>
        </div>

        <div className="order-details-box">
          <h2>Order #{order.id}</h2>
          
          <div className="order-info">
            <div className="info-section">
              <h3>Shipping Address</h3>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
            </div>

            <div className="info-section">
              <h3>Order Summary</h3>
              {order.items.map(item => (
                <div key={item.productId} className="order-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
              
              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="total-row">
                  <span>Tax:</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                <div className="total-row">
                  <span>Shipping:</span>
                  <span>{formatPrice(order.shipping)}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total:</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <Link to="/orders" className="view-orders-btn">View All Orders</Link>
          <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
