import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Core Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useAuth } from './contexts/AuthContext';

// Lazy-loaded components
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Contacts = lazy(() => import('./pages/contacts/Contacts'));
const ContactDetail = lazy(() => import('./pages/contacts/ContactDetail'));
const AddContact = lazy(() => import('./pages/contacts/AddContact'));
const EditContact = lazy(() => import('./pages/contacts/EditContact'));
const Reminders = lazy(() => import('./pages/reminders/Reminders'));
const Reports = lazy(() => import('./pages/reports/Reports'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const { user } = useAuth();
  
  return (
    <ErrorBoundary fullPage>
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <Suspense fallback={<LoadingSpinner fullPage message="Loading application..." />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <ErrorBoundary fullPage>
                <Layout />
              </ErrorBoundary>
            </ProtectedRoute>
          }>
            <Route index element={
              <ErrorBoundary>
                <Dashboard />
              </ErrorBoundary>
            } />
            <Route path="contacts" element={
              <ErrorBoundary>
                <Contacts />
              </ErrorBoundary>
            } />
            <Route path="contacts/add" element={
              <ErrorBoundary>
                <AddContact />
              </ErrorBoundary>
            } />
            <Route path="contacts/:id" element={
              <ErrorBoundary>
                <ContactDetail />
              </ErrorBoundary>
            } />
            <Route path="contacts/:id/edit" element={
              <ErrorBoundary>
                <EditContact />
              </ErrorBoundary>
            } />
            <Route path="reminders" element={
              <ErrorBoundary>
                <Reminders />
              </ErrorBoundary>
            } />
            <Route path="reports" element={
              <ErrorBoundary>
                <Reports />
              </ErrorBoundary>
            } />
            <Route path="profile" element={
              <ErrorBoundary>
                <Profile />
              </ErrorBoundary>
            } />
          </Route>
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;