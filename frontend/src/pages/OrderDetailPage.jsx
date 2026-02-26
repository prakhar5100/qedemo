import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { formatPrice, formatDate } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import Breadcrumb from '../components/Breadcrumb';
import './OrderDetailPage.css';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadOrder();
  }, [id, isAuthenticated]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getById(id);
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
      <div className="order-detail-page">
        <div className="container">
          <p>Order not found</p>
          <Link to="/orders">Back to Orders</Link>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Orders', path: '/orders' },
    { label: order.id, path: null }
  ];

  return (
    <div className="order-detail-page">
      <div className="container">
        <Breadcrumb items={breadcrumbItems} />

        <div className="order-header">
          <div>
            <h1>Order {order.id}</h1>
            <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <StatusBadge status={order.status} orderId={order.id} />
        </div>

        <div className="order-detail-container">
          <div className="order-main">
            <section className="order-section">
              <h2>Order Items</h2>
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-info">
                      <h3>{item.name}</h3>
                      <p className="item-quantity">Quantity: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      <p>{formatPrice(item.unitPrice)} each</p>
                      <p className="item-total">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="order-section">
              <h2>Order Timeline</h2>
              <div className="order-timeline">
                {order.timeline?.map((event, index) => (
                  <div key={index} className="timeline-event">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <p className="timeline-status">
                        <StatusBadge status={event.status} />
                      </p>
                      <p className="timeline-message">{event.message}</p>
                      <p className="timeline-date">{formatDate(event.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="order-sidebar">
            <div className="order-summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Tax:</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>{formatPrice(order.shipping)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>

            <div className="shipping-card">
              <h3>Shipping Address</h3>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.zip}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>

            <Link to="/orders" className="back-to-orders-btn">
              ← Back to Orders
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
