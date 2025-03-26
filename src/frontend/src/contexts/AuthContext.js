import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Set token in api instance
      api.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
    }
    setLoading(false);
  }, []);

  // Handle user registration
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post('/api/auth/register', userData);
      const newUser = response.data;
      
      // Save user to state and localStorage
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Set token in api instance
      api.defaults.headers.common['Authorization'] = `Bearer ${newUser.token}`;
      
      setLoading(false);
      toast.success('Registration successful!');
      navigate('/');
      return true;
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      return false;
    }
  };

  // Handle user login
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await api.post('/api/auth/login', credentials);
      const loggedInUser = response.data;
      
      // Save user to state and localStorage
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      
      // Set token in api instance
      api.defaults.headers.common['Authorization'] = `Bearer ${loggedInUser.token}`;
      
      setLoading(false);
      toast.success('Login successful!');
      navigate('/');
      return true;
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      return false;
    }
  };

  // Handle user logout
  const logout = () => {
    // Clear user from state and localStorage
    setUser(null);
    localStorage.removeItem('user');
    
    // Remove token from api instance
    delete api.defaults.headers.common['Authorization'];
    
    toast.info('You have been logged out');
    navigate('/login');
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await api.put('/api/auth/profile', profileData);
      const updatedUser = response.data;
      
      // Update user in state and localStorage
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setLoading(false);
      toast.success('Profile updated successfully!');
      return true;
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
