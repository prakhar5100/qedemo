const express = require('express');
const router = express.Router();
const store = require('../data/store');
const authMiddleware = require('../middleware/auth');

function getCart(userId) {
  return store.carts[userId] || { items: [] };
}

// GET /api/orders
router.get('/', authMiddleware, (req, res) => {
  const userOrders = store.orders.filter(o => o.userId === req.userId);
  res.json({ orders: userOrders });
});

// GET /api/orders/:id
// BUG-B05: No ownership check — any authenticated user can see any order
router.get('/:id', authMiddleware, (req, res) => {
  const order = store.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  // BUG-B05: Missing ownership check — should be:
  // if (order.userId !== req.userId) return res.status(403).json({ error: 'Forbidden' });

  res.json({ order });
});

// POST /api/orders
// BUG-B04: Empty cart creates order with total:0 instead of 400
router.post('/', authMiddleware, (req, res) => {
  const cart = getCart(req.userId);

  // BUG-B04: Missing cart empty check — should be:
  // if (!cart.items || cart.items.length === 0) {
  //   return res.status(400).json({ error: 'Cannot place order with empty cart' });
  // }

  const { shippingAddress } = req.body;
  const subtotal = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const shipping = subtotal > 50 ? 0 : 8.99;
  const total = Math.round((subtotal + tax + shipping) * 100) / 100;

  const order = {
    id: `ord_${Date.now()}`,
    userId: req.userId,
    items: [...cart.items],
    subtotal: Math.round(subtotal * 100) / 100,
    tax, shipping, total,
    status: 'pending',
    shippingAddress: shippingAddress || req.user.address,
    createdAt: new Date().toISOString(),
    timeline: [{ status: 'pending', timestamp: new Date().toISOString(), message: 'Order placed' }]
  };

  store.orders.push(order);
  store.carts[req.userId] = { items: [] };
  res.status(201).json({ order });
});

// GET /api/orders/:id/track
router.get('/:id/track', authMiddleware, (req, res) => {
  const order = store.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ timeline: order.timeline });
});

module.exports = router;
