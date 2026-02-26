import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../services/api';
import { StatusBadge } from '../components/UI';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then(d => setOrders(d.orders)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 32 }}>My Orders</h1>
      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No orders yet</h3>
          <p style={{ marginBottom: 24 }}>When you place orders they'll appear here.</p>
          <Link to="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 600, fontSize: 13 }}>{order.id}</td>
                    {/* BUG-F07: Renders raw ISO date string instead of formatted date */}
                    <td style={{ fontSize: 13 }}>{order.createdAt}</td>
                    <td style={{ fontSize: 13 }}>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                    <td style={{ fontWeight: 700 }}>${order.total.toFixed(2)}</td>
                    <td><StatusBadge status={order.status} orderId={order.id} /></td>
                    <td><Link to={`/orders/${order.id}`} style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>View →</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
