import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

// Define theme variables
const lightTheme = {
  '--primary-color': '#4a6fa5',
  '--primary-light': '#6e8cbb',
  '--primary-dark': '#345385',
  '--secondary-color': '#28c7b7',
  '--secondary-light': '#40d7c7',
  '--secondary-dark': '#1ca897',
  '--background-color': '#f8f9fa',
  '--background-light': '#ffffff',
  '--background-dark': '#e9ecef',
  '--text-color': '#343a40',
  '--text-light': '#6c757d',
  '--text-dark': '#212529',
  '--border-color': '#dee2e6',
  '--shadow-color': 'rgba(0, 0, 0, 0.1)',
  '--error-color': '#e74c3c',
  '--warning-color': '#f39c12',
  '--success-color': '#2ecc71',
  '--info-color': '#3498db',
  '--hot-temp': '#e74c3c',
  '--warm-temp': '#f39c12',
  '--cold-temp': '#3498db',
};

const darkTheme = {
  '--primary-color': '#6e8cbb',
  '--primary-light': '#8ba4ca',
  '--primary-dark': '#4a6fa5',
  '--secondary-color': '#40d7c7',
  '--secondary-light': '#5de0d1',
  '--secondary-dark': '#28c7b7',
  '--background-color': '#212529',
  '--background-light': '#343a40',
  '--background-dark': '#1a1d20',
  '--text-color': '#f8f9fa',
  '--text-light': '#e9ecef',
  '--text-dark': '#dee2e6',
  '--border-color': '#495057',
  '--shadow-color': 'rgba(0, 0, 0, 0.3)',
  '--error-color': '#e74c3c',
  '--warning-color': '#f39c12',
  '--success-color': '#2ecc71',
  '--info-color': '#3498db',
  '--hot-temp': '#e74c3c',
  '--warm-temp': '#f39c12',
  '--cold-temp': '#3498db',
};

// Create theme context
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Check if user has previously set a theme preference
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check if user system prefers dark mode
    const prefersDark = window.matchMedia && 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    return prefersDark ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);
  
  // Apply theme variables to document root
  useEffect(() => {
    // Set theme in localStorage
    localStorage.setItem('theme', theme);
    
    // Apply theme variables to document root
    const themeVars = theme === 'dark' ? darkTheme : lightTheme;
    Object.entries(themeVars).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
    
    // Set data-theme attribute for CSS selectors
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  // Set a specific theme
  const setThemeMode = (mode) => {
    if (mode === 'light' || mode === 'dark') {
      setTheme(mode);
    }
  };
  
  // Provide both context values and styled theme
  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      setTheme: setThemeMode,
      isDark: theme === 'dark' 
    }}>
      <StyledThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};