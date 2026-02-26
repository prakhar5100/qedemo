const express = require('express');
const router = express.Router();
const store = require('../data/store');
const authMiddleware = require('../middleware/auth');

function getCart(userId) {
  if (!store.carts[userId]) store.carts[userId] = { items: [] };
  return store.carts[userId];
}

function calcTotals(cart) {
  const subtotal = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const shipping = subtotal > 50 ? 0 : 8.99;
  const total = Math.round((subtotal + tax + shipping) * 100) / 100;
  return { ...cart, subtotal: Math.round(subtotal * 100) / 100, tax, shipping, total };
}

// GET /api/cart
router.get('/', authMiddleware, (req, res) => {
  const cart = getCart(req.userId);
  res.json(calcTotals(cart));
});

// POST /api/cart/add
// BUG-B02: Accepts negative quantity without validation
router.post('/add', authMiddleware, (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId) return res.status(400).json({ error: 'productId is required' });

  // BUG-B02: Missing validation — should reject negative quantities:
  // if (!quantity || quantity < 1) return res.status(400).json({ error: 'Quantity must be at least 1' });

  const product = store.products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const cart = getCart(req.userId);
  const existing = cart.items.find(i => i.productId === productId);
  if (existing) {
    existing.quantity += parseInt(quantity) || 1;
  } else {
    cart.items.push({ productId, name: product.name, quantity: parseInt(quantity) || 1, unitPrice: product.price, image: product.images[0] });
  }
  res.json(calcTotals(cart));
});

// PUT /api/cart/update
router.put('/update', authMiddleware, (req, res) => {
  const { productId, quantity } = req.body;
  const cart = getCart(req.userId);
  const item = cart.items.find(i => i.productId === productId);
  if (!item) return res.status(404).json({ error: 'Item not in cart' });
  item.quantity = parseInt(quantity);
  res.json(calcTotals(cart));
});

// DELETE /api/cart/remove/:productId
router.delete('/remove/:productId', authMiddleware, (req, res) => {
  const cart = getCart(req.userId);
  cart.items = cart.items.filter(i => i.productId !== req.params.productId);
  res.json(calcTotals(cart));
});

// DELETE /api/cart/clear
router.delete('/clear', authMiddleware, (req, res) => {
  store.carts[req.userId] = { items: [] };
  res.json({ message: 'Cart cleared' });
});

module.exports = router;
