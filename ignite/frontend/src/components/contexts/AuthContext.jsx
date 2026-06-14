import React, { createContext, useContext, useState, useEffect } from 'react';
import { authservice } from '../services/AuthService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = JSON.parse(localStorage.getItem('ag_auth_token'));
    const remember = JSON.parse(localStorage.getItem('ag_auth_remember'));
    if (accessToken?.access && remember) {
      setIsLoggedIn(!!accessToken);
    }
    setLoading(false);
  }, []);

  const login = async (data) => {
    try {
      await authservice().login(data);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const logout = () => {
    authservice().logout();
    setIsLoggedIn(false);
  };

  const register = async (data) => {
    try {
      await authservice().register(data);
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  const value = { 
    isLoggedIn,
    login, 
    logout, 
    register, 
    loading 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
