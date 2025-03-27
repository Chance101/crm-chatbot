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
    const loadStoredUser = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Set token in api instance
          api.axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
          
          // Validate token with the server
          await api.getNoCache('/api/auth/validate-token');
        } catch (error) {
          // Handle invalid or expired token
          if (error.response && error.response.status === 401) {
            logout(false); // Silent logout (no redirect)
          }
        }
      }
      setLoading(false);
    };
    
    loadStoredUser();
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
      api.axios.defaults.headers.common['Authorization'] = `Bearer ${newUser.token}`;
      
      // Clear any existing cache
      api.clearCache();
      
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
      api.axios.defaults.headers.common['Authorization'] = `Bearer ${loggedInUser.token}`;
      
      // Clear any existing cache
      api.clearCache();
      
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
  const logout = (shouldRedirect = true) => {
    // Clear user from state and localStorage
    setUser(null);
    localStorage.removeItem('user');
    
    // Remove token from api instance
    delete api.axios.defaults.headers.common['Authorization'];
    
    // Clear all cached data
    api.clearCache();
    
    if (shouldRedirect) {
      toast.info('You have been logged out');
      navigate('/login');
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await api.put('/api/auth/profile', profileData);
      const updatedUser = response.data;
      
      // Update user in state and localStorage
      const newUserData = { ...user, ...updatedUser };
      setUser(newUserData);
      localStorage.setItem('user', JSON.stringify(newUserData));
      
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

  // Check if token is going to expire soon and refresh it if needed
  const checkTokenExpiration = () => {
    if (!user || !user.token) return;
    
    try {
      // Decode JWT to check expiration
      // This is a simple implementation - you might want to use a library like jwt-decode
      const base64Url = user.token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      
      // Check if token will expire in less than 5 minutes
      const expiresIn = payload.exp * 1000 - Date.now();
      const fiveMinutes = 5 * 60 * 1000;
      
      if (expiresIn < fiveMinutes) {
        // Refresh token
        refreshToken();
      }
    } catch (error) {
      console.error('Error checking token expiration:', error);
    }
  };

  // Refresh the auth token
  const refreshToken = async () => {
    try {
      const response = await api.post('/api/auth/refresh-token');
      const { token } = response.data;
      
      // Update token in user object and localStorage
      const updatedUser = { ...user, token };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update token in api instance
      api.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      
      // If refresh fails, log out the user
      if (error.response && error.response.status === 401) {
        logout();
      }
      
      return false;
    }
  };

  // Set up token expiration check interval
  useEffect(() => {
    if (user && user.token) {
      // Check token expiration every minute
      const interval = setInterval(checkTokenExpiration, 60 * 1000);
      
      // Initial check
      checkTokenExpiration();
      
      return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      register, 
      login, 
      logout, 
      updateProfile,
      refreshToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};