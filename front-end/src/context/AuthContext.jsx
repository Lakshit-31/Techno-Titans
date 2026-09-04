import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCityState] = useState(() => {
    return localStorage.getItem('eventhub_city') || 'Mumbai';
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('eventhub_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('eventhub_user');
      }
    }
    setLoading(false);
  }, []);

  const setSelectedCity = (city) => {
    setSelectedCityState(city);
    localStorage.setItem('eventhub_city', city);
  };

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const userData = res.data;
    setUser(userData);
    localStorage.setItem('eventhub_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (formData) => {
    const res = await API.post('/auth/register', formData);
    const userData = res.data;
    setUser(userData);
    localStorage.setItem('eventhub_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eventhub_user');
  };

  const updateProfile = async (formData) => {
    const res = await API.put('/auth/profile', formData);
    const updated = res.data;
    setUser(updated);
    localStorage.setItem('eventhub_user', JSON.stringify(updated));
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        selectedCity,
        setSelectedCity,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        role: user?.role || 'GUEST',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
