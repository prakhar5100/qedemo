const { products, categories, users, reviews, orders } = require('./seed');

// Deep clone to allow mutation
const store = {
  products: JSON.parse(JSON.stringify(products)),
  categories: JSON.parse(JSON.stringify(categories)),
  users: JSON.parse(JSON.stringify(users)),
  reviews: JSON.parse(JSON.stringify(reviews)),
  orders: JSON.parse(JSON.stringify(orders)),
  carts: {}, // keyed by userId
  wishlists: {}, // keyed by userId
  tokens: {}, // token -> userId
};

module.exports = store;
