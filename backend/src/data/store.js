// In-memory data store
let products = require('../data/products.json');
let users = require('../data/users.json');
let categories = require('../data/categories.json');
let orders = require('../data/orders.json');

// Reviews data (generated on the fly)
let reviews = {};

// Cart data (per user session)
let carts = {};

// Wishlist data (per user)
let wishlists = {};

// Contact form submissions
let contactMessages = [];

// Helper to get data
const getData = () => ({
  products,
  users,
  categories,
  orders,
  reviews,
  carts,
  wishlists,
  contactMessages
});

// Helper to reset data (for testing)
const resetData = () => {
  products = require('../data/products.json');
  users = require('../data/users.json');
  categories = require('../data/categories.json');
  orders = require('../data/orders.json');
  reviews = {};
  carts = {};
  wishlists = {};
  contactMessages = [];
};

module.exports = {
  getData,
  resetData,
  products,
  users,
  categories,
  orders,
  reviews,
  carts,
  wishlists,
  contactMessages
};
