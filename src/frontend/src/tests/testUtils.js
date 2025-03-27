import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

// Mock theme that matches the variables used in components
const theme = {
  colors: {
    '--primary-color': '#4a6fa5',
    '--secondary-color': '#28c7b7',
    '--error-color': '#e74c3c',
    '--warning-color': '#f39c12',
    '--success-color': '#2ecc71',
    '--text-light': '#718096',
    '--shadow-color': 'rgba(0, 0, 0, 0.1)',
    '--background-color': '#f8f9fa',
    '--hot-temp': '#e74c3c',
    '--warm-temp': '#f39c12',
    '--cold-temp': '#3498db',
  }
};

// Custom render function that includes router and theme provider
export const renderWithProviders = (ui, options = {}) => {
  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </BrowserRouter>
  );
  
  return render(ui, { wrapper: Wrapper, ...options });
};

// Mock data for testing
export const mockContact = {
  _id: '123456789',
  name: 'John Doe',
  role: 'Product Manager',
  currentCompany: 'Acme Inc',
  email: 'john@example.com',
  phone: '555-123-4567',
  temperature: 'warm',
  lastContactedDate: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
  daysSinceLastContacted: 3
};

export const mockReminder = {
  _id: '987654321',
  description: 'Follow up about proposal',
  dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
  priority: 'high',
  completed: false,
  contact: {
    _id: '123456789',
    name: 'John Doe',
    role: 'Product Manager'
  }
};

export const mockChartData = {
  type: 'bar',
  data: [10, 20, 30, 40, 50],
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  title: 'Monthly Contacts'
};