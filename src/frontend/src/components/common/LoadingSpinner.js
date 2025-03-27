import React from 'react';
import styled, { keyframes } from 'styled-components';
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

// Styled loading container with various size options
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: ${props => props.fullPage ? '100vh' : 'auto'};
  padding: ${props => props.fullPage ? '0' : props.size === 'small' ? '0.5rem' : '1rem'};
`;

// Styled spinner component
const Spinner = styled(FaSpinner)`
  font-size: ${props => {
    switch(props.size) {
      case 'small': return '1rem';
      case 'medium': return '2rem';
      case 'large': return '3rem';
      default: return '2rem';
    }
  }};
  color: var(--primary-color);
  animation: ${rotate} 1s linear infinite;
`;

// Loading message
const Message = styled.p`
  margin-top: 0.5rem;
  color: var(--text-color);
  font-size: ${props => {
    switch(props.size) {
      case 'small': return '0.8rem';
      case 'medium': return '1rem';
      case 'large': return '1.2rem';
      default: return '1rem';
    }
  }};
`;

/**
 * Reusable loading spinner component
 * @param {Object} props - Component props
 * @param {string} [props.size='medium'] - Size of the spinner: 'small', 'medium', or 'large'
 * @param {boolean} [props.fullPage=false] - Whether the spinner should take up the full page
 * @param {string} [props.message] - Optional message to display below the spinner
 * @param {string} [props.className] - Optional className for styling
 */
const LoadingSpinner = ({ 
  size = 'medium', 
  fullPage = false, 
  message, 
  className 
}) => {
  return (
    <Container fullPage={fullPage} size={size} className={className}>
      <Spinner size={size} />
      {message && <Message size={size}>{message}</Message>}
    </Container>
  );
};

export default LoadingSpinner;