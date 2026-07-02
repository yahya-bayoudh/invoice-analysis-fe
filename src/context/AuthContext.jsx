import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('facturai_user');
    return saved ? JSON.parse(saved) : null;
  });

const login = async (email, password) => {
  if (!email || password.length < 6) {
    return { success: false, error: 'Email ou mot de passe incorrect.' };
  }
  try {
    const response = await axios.post('http://localhost:3000/users/login', {
      email: email,
      password: password,
    });
    const userData = {
      id: response.data._id || response.data.id,
      email,
      username: response.data.username,
    };
    localStorage.setItem('facturai_user', JSON.stringify(userData));
    setUser(userData);
    return { success: true };
  } catch (error) {
    const message =
      error.response?.data?.message || "Email ou mot de passe incorrect.";
    return { success: false, error: message };
  }
};

  const register = async (username, email, password) => {
    if (!username || !email || password.length < 6) {
      return { success: false, error: 'Veuillez remplir tous les champs.' };
    }
    try {
      const response = await axios.post('http://localhost:3000/users/register', {
        username: username,
        email: email,
        password: password,
      });
      const userData = {
        id: response.data._id || response.data.id,
        email,
        username,
      };
      localStorage.setItem('facturai_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Une erreur est survenue lors de l'inscription.";
      return { success: false, error: message };
    }
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