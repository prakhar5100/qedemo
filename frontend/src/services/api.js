import axios from 'axios';

const api = axios.create({ baseURL: 'https://qedemo.onrender.com/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('ss_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Products
export const getProducts = (params = {}) => api.get('/products', { params }).then(r => r.data);
export const getProduct = (id) => api.get(`/products/${id}`).then(r => r.data);
export const getFeaturedProducts = (limit) => api.get('/products/featured', { params: { limit } }).then(r => r.data);
export const getProductReviews = (id) => api.get(`/products/${id}/reviews`).then(r => r.data);
export const submitReview = (id, data) => api.post(`/products/${id}/reviews`, data).then(r => r.data);

// Categories
export const getCategories = () => api.get('/categories').then(r => r.data);
export const getCategory = (slug) => api.get(`/categories/${slug}`).then(r => r.data);

// Search
export const searchProducts = (q) => api.get('/search', { params: { q } }).then(r => r.data);

// Cart
export const getCart = () => api.get('/cart').then(r => r.data);
export const addToCart = (productId, quantity) => api.post('/cart/add', { productId, quantity }).then(r => r.data);
export const updateCartItem = (productId, quantity) => api.put('/cart/update', { productId, quantity }).then(r => r.data);
export const removeCartItem = (productId) => api.delete(`/cart/remove/${productId}`).then(r => r.data);
export const clearCart = () => api.delete('/cart/clear').then(r => r.data);

// Orders
export const getOrders = () => api.get('/orders').then(r => r.data);
export const getOrder = (id) => api.get(`/orders/${id}`).then(r => r.data);
export const placeOrder = (data) => api.post('/orders', data).then(r => r.data);
export const trackOrder = (id) => api.get(`/orders/${id}/track`).then(r => r.data);

// Auth
export const login = (email, password) => api.post('/auth/login', { email, password }).then(r => r.data);
export const register = (data) => api.post('/auth/register', data).then(r => r.data);
export const logout = () => api.post('/auth/logout').then(r => r.data);
export const getMe = () => api.get('/auth/me').then(r => r.data);

// Wishlist
export const getWishlist = () => api.get('/wishlist').then(r => r.data);
export const addToWishlist = (productId) => api.post('/wishlist/add', { productId }).then(r => r.data);
export const removeFromWishlist = (id) => api.delete(`/wishlist/remove/${id}`).then(r => r.data);

// Contact
export const submitContact = (data) => api.post('/contact', data).then(r => r.data);

export default api;
