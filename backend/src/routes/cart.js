const express = require('express');
const router = express.Router();
const store = require('../data/store');
const { optionalAuth } = require('../middleware/auth');

// Helper to get cart for user
const getCartKey = (req) => {
  return req.user ? req.user.userId : req.ip || 'anonymous';
};

const calculateCartTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.09; // 9% tax
  const total = subtotal + tax;
  
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  };
};

// GET /api/cart - Get current cart
router.get('/', optionalAuth, (req, res) => {
  const cartKey = getCartKey(req);
  const cart = store.carts[cartKey] || { items: [] };
  const totals = calculateCartTotals(cart.items);

  res.json({
    items: cart.items,
    ...totals
  });
});

// POST /api/cart/add - Add item to cart
// BUG-B02: Accepts negative quantity without validation
router.post('/add', optionalAuth, (req, res) => {
  const { productId, quantity } = req.body;
  
  if (!productId) {
    return res.status(400).json({ error: 'Product ID required' });
  }

  // BUG-B02: Missing validation for negative or zero quantity
  // Should validate: if (quantity <= 0) return 400
  
  const product = store.products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const cartKey = getCartKey(req);
  if (!store.carts[cartKey]) {
    store.carts[cartKey] = { items: [] };
  }

  const cart = store.carts[cartKey];
  const existingItem = cart.items.find(item => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity || 1;
  } else {
    cart.items.push({
      productId,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity || 1
    });
  }

  const totals = calculateCartTotals(cart.items);

  res.json({
    cart: {
      items: cart.items,
      ...totals
    }
  });
});

// PUT /api/cart/update - Update item quantity
router.put('/update', optionalAuth, (req, res) => {
  const { productId, quantity } = req.body;
  
  if (!productId || quantity === undefined) {
    return res.status(400).json({ error: 'Product ID and quantity required' });
  }

  if (quantity < 0) {
    return res.status(400).json({ error: 'Quantity cannot be negative' });
  }

  const cartKey = getCartKey(req);
  const cart = store.carts[cartKey];
  
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const item = cart.items.find(item => item.productId === productId);
  if (!item) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }

  if (quantity === 0) {
    cart.items = cart.items.filter(item => item.productId !== productId);
  } else {
    item.quantity = quantity;
  }

  const totals = calculateCartTotals(cart.items);

  res.json({
    cart: {
      items: cart.items,
      ...totals
    }
  });
});

// DELETE /api/cart/remove/:productId - Remove item from cart
router.delete('/remove/:productId', optionalAuth, (req, res) => {
  const { productId } = req.params;
  const cartKey = getCartKey(req);
  const cart = store.carts[cartKey];
  
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  cart.items = cart.items.filter(item => item.productId !== productId);
  const totals = calculateCartTotals(cart.items);

  res.json({
    cart: {
      items: cart.items,
      ...totals
    }
  });
});

// DELETE /api/cart/clear - Empty the cart
router.delete('/clear', optionalAuth, (req, res) => {
  const cartKey = getCartKey(req);
  store.carts[cartKey] = { items: [] };
  
  res.json({ message: 'Cart cleared' });
});

module.exports = router;
