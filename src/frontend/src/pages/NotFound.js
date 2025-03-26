import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 0 20px;
`;

const Icon = styled.div`
  font-size: 80px;
  margin-bottom: 20px;
  color: var(--warning-color);
`;

const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 10px;
  color: var(--text-color);
`;

const Message = styled.p`
  font-size: 18px;
  margin-bottom: 30px;
  color: var(--text-light);
  max-width: 500px;
`;

const HomeButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <Icon>
        <FaExclamationTriangle />
      </Icon>
      <Title>404 - Page Not Found</Title>
      <Message>
        Oops! The page you are looking for doesn't exist or has been moved.
      </Message>
      <HomeButton to="/">
        <FaHome /> Go to Dashboard
      </HomeButton>
    </NotFoundContainer>
  );
};

export default NotFound;