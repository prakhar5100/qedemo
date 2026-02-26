import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, login as apiLogin, register as apiRegister, logout as apiLogout } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ss_token');
    if (token) {
      getMe().then(d => setUser(d.user)).catch(() => localStorage.removeItem('ss_token')).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    localStorage.setItem('ss_token', data.token);
    setUser(data.user);
    return data;
  };

  const register = async (formData) => {
    const data = await apiRegister(formData);
    localStorage.setItem('ss_token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try { await apiLogout(); } catch {}
    localStorage.removeItem('ss_token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout, isAuth: !!user }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
