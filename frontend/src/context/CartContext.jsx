import { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart as apiAdd, updateCartItem, removeCartItem, clearCart as apiClear } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuth } = useAuth();
  const [cart, setCart] = useState({ items: [], subtotal: 0, tax: 0, shipping: 0, total: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuth) {
      setLoading(true);
      getCart().then(setCart).catch(console.error).finally(() => setLoading(false));
    } else {
      setCart({ items: [], subtotal: 0, tax: 0, shipping: 0, total: 0 });
    }
  }, [isAuth]);

  const addItem = async (productId, quantity = 1) => {
    const data = await apiAdd(productId, quantity);
    setCart(data);
  };

  const updateItem = async (productId, quantity) => {
    const data = await updateCartItem(productId, quantity);
    setCart(data);
  };

  const removeItem = async (productId) => {
    const data = await removeCartItem(productId);
    setCart(data);
  };

  const clearCart = async () => {
    await apiClear();
    setCart({ items: [], subtotal: 0, tax: 0, shipping: 0, total: 0 });
  };

  return (
    <CartContext.Provider value={{ cart, loading, addItem, updateItem, removeItem, clearCart, itemCount: cart.items.reduce((s, i) => s + i.quantity, 0) }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
