import React, { Component } from 'react';
import styled from 'styled-components';
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Styled container for the error message
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  height: ${props => props.fullPage ? '100vh' : 'auto'};
  background-color: var(--background-color);
  border-radius: 8px;
  box-shadow: ${props => props.fullPage ? 'none' : '0 2px 8px var(--shadow-color)'};
  margin: ${props => props.fullPage ? '0' : '1rem 0'};
  text-align: center;
`;

// Error icon
const ErrorIcon = styled(FaExclamationTriangle)`
  font-size: 3rem;
  color: var(--error-color);
  margin-bottom: 1rem;
`;

// Error heading
const ErrorHeading = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-color);
`;

// Error message
const ErrorMessage = styled.p`
  margin-bottom: 1.5rem;
  color: var(--text-light);
  max-width: 600px;
`;

// Buttons container
const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

// Action button
const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${props => props.secondary ? 'var(--background-color)' : 'var(--primary-color)'};
  color: ${props => props.secondary ? 'var(--primary-color)' : 'white'};
  border: 1px solid var(--primary-color);
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.secondary ? 'var(--background-light)' : 'var(--primary-dark)'};
  }
`;

// Home link styled as a button
const HomeLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--background-color);
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  
  &:hover {
    background-color: var(--background-light);
  }
`;

// Technical details section
const TechnicalDetails = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: var(--background-light);
  border-radius: 4px;
  width: 100%;
  max-width: 800px;
  text-align: left;
  
  pre {
    white-space: pre-wrap;
    word-break: break-all;
    font-size: 0.9rem;
    color: var(--text-light);
    max-height: 200px;
    overflow-y: auto;
  }
`;

// Error details toggle
const DetailsToggle = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 1rem;
  
  &:hover {
    color: var(--primary-dark);
  }
`;

/**
 * Component to catch unhandled errors in the React component tree
 * and display a friendly error message
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // If we have an error tracking service like Sentry, we'd send the error there
    // logErrorToService(error, errorInfo);
  }

  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    });

    // If provided, call the onReset prop
    if (this.props.onReset) {
      this.props.onReset();
    }
  }

  render() {
    const { fullPage, fallback, children } = this.props;
    const { hasError, error, errorInfo, showDetails } = this.state;

    // If there's a custom fallback, use it
    if (hasError && fallback) {
      return typeof fallback === 'function' 
        ? fallback(error, this.resetError)
        : fallback;
    }

    // Otherwise, use the default error UI
    if (hasError) {
      return (
        <ErrorContainer fullPage={fullPage}>
          <ErrorIcon />
          <ErrorHeading>Oops! Something went wrong</ErrorHeading>
          <ErrorMessage>
            We're sorry, but there was an error while trying to display this content.
            You can try refreshing the page or return to the dashboard.
          </ErrorMessage>
          
          <ButtonsContainer>
            <Button onClick={this.resetError}>
              <FaRedo /> Try Again
            </Button>
            <HomeLink to="/">
              <FaHome /> Back to Dashboard
            </HomeLink>
          </ButtonsContainer>
          
          <DetailsToggle onClick={this.toggleDetails}>
            {showDetails ? 'Hide' : 'Show'} technical details
          </DetailsToggle>
          
          {showDetails && errorInfo && (
            <TechnicalDetails>
              <h4>Error: {error && error.toString()}</h4>
              <pre>{errorInfo.componentStack}</pre>
            </TechnicalDetails>
          )}
        </ErrorContainer>
      );
    }

    // When there's no error, render children normally
    return children;
  }
}

export default ErrorBoundary;