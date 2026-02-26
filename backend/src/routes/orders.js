const express = require('express');
const router = express.Router();
const store = require('../data/store');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

// GET /api/orders - List orders for authenticated user
router.get('/', authMiddleware, (req, res) => {
  const userOrders = store.orders.filter(order => order.userId === req.user.userId);
  
  res.json({ orders: userOrders });
});

// GET /api/orders/:id - Get single order detail
// BUG-B05: Doesn't check if order belongs to requesting user - auth bypass
router.get('/:id', authMiddleware, (req, res) => {
  const order = store.orders.find(o => o.id === req.params.id);
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // BUG-B05: Missing authorization check
  // Should check: if (order.userId !== req.user.userId) return 403
  
  res.json({ order });
});

// POST /api/orders - Place new order from current cart
// BUG-B04: Accepts empty cart and creates order with 0 items and 0 total
router.post('/', authMiddleware, (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;
  
  // Get user's cart
  const cartKey = req.user.userId;
  const cart = store.carts[cartKey];
  
  // BUG-B04: Should validate cart is not empty
  // Should check: if (!cart || cart.items.length === 0) return 400
  
  const items = cart ? cart.items : [];
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.09;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const newOrder = {
    id: `ord_${Date.now()}`,
    userId: req.user.userId,
    items: items.map(item => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.price
    })),
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    shipping: parseFloat(shipping.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    status: 'pending',
    shippingAddress: shippingAddress || req.user.address,
    createdAt: new Date().toISOString(),
    timeline: [{
      status: 'pending',
      timestamp: new Date().toISOString(),
      message: 'Order placed successfully'
    }]
  };

  store.orders.push(newOrder);
  
  // Clear cart after order
  if (cart) {
    store.carts[cartKey] = { items: [] };
  }

  res.status(201).json({ order: newOrder });
});

// GET /api/orders/:id/track - Get order tracking timeline
router.get('/:id/track', optionalAuth, (req, res) => {
  const order = store.orders.find(o => o.id === req.params.id);
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json({ 
    orderId: order.id,
    status: order.status,
    timeline: order.timeline 
  });
});

module.exports = router;
