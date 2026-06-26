import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('facturai_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    if (email && password.length >= 6) {
      const userData = { email, name: 'Mohamed Ali' };
      localStorage.setItem('facturai_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    }
    return { success: false, error: 'Email ou mot de passe incorrect.' };
  };

  const register = (name, email, password) => {
    if (name && email && password.length >= 6) {
      const userData = { email, name };
      localStorage.setItem('facturai_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    }
    return { success: false, error: 'Veuillez remplir tous les champs.' };
  };

  const logout = () => {
    localStorage.removeItem('facturai_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}