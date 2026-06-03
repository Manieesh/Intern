import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(true);

  const saveSelectedCity = (city) => {
    const normalizedCity = city?.trim();
    if (!normalizedCity) return;
    setSelectedCity(normalizedCity);
  };

  const loadUserFromStorage = () => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const register = async (formData) => {
    try {
      const response = await authAPI.register(formData);
      const { user: userData, token: authToken } = response.data;

      setUser(userData);
      setToken(authToken);
      saveSelectedCity(formData.city);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', authToken);

      return { success: true, data: response.data };
    } catch (error) {
      const validationError = error.response?.data?.errors?.[0]?.msg;
      return { success: false, error: validationError || error.response?.data?.message || error.message };
    }
  };

  const login = async (email, password, city) => {
    try {
      const response = await authAPI.login({ email, password });
      const { user: userData, token: authToken } = response.data;

      setUser(userData);
      setToken(authToken);
      saveSelectedCity(city);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', authToken);

      return { success: true, data: response.data };
    } catch (error) {
      const validationError = error.response?.data?.errors?.[0]?.msg;
      return { success: false, error: validationError || error.response?.data?.message || error.message };
    }
  };

  const googleLogin = async (credential, city) => {
    try {
      const response = await authAPI.googleLogin(credential, city);
      const { user: userData, token: authToken } = response.data;

      setUser(userData);
      setToken(authToken);
      saveSelectedCity(city);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', authToken);

      return { success: true, data: response.data };
    } catch (error) {
      const validationError = error.response?.data?.errors?.[0]?.msg;
      return { success: false, error: validationError || error.response?.data?.message || error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setSelectedCity('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('selectedCity');
  };

  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const updateProfile = async (data) => {
    try {
      const response = await authAPI.updateProfile(data);
      saveUser(response.data.user);
      return { success: true, data: response.data };
    } catch (error) {
      const validationError = error.response?.data?.errors?.[0]?.msg;
      return { success: false, error: validationError || error.response?.data?.message || error.message };
    }
  };

  const value = {
    user,
    token,
    loading,
    selectedCity,
    saveSelectedCity,
    register,
    login,
    googleLogin,
    logout,
    saveUser,
    updateProfile,
    isAuthenticated: !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
