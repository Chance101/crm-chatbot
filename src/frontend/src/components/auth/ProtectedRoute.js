import React from 'react';
import { Navigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { FaSpinner } from 'react-icons/fa';

// Define keyframes for the loading spinner animation
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Styled loading container
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background-color: var(--background-color);
`;

// Styled spinner component
const Spinner = styled(FaSpinner)`
  font-size: 2.5rem;
  color: var(--primary-color);
  animation: ${rotate} 1s linear infinite;
`;

// Loading message
const LoadingMessage = styled.h2`
  margin-top: 1rem;
  color: var(--text-color);
  font-size: 1.2rem;
`;

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading state if still checking authentication
  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
        <LoadingMessage>Loading your account...</LoadingMessage>
      </LoadingContainer>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Render children if user is authenticated
  return children;
};

export default ProtectedRoute;