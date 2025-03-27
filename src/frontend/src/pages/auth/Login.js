import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaUser, FaLock, FaRobot } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const LoginContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const LeftSection = styled.div`
  flex: 1;
  background-color: var(--primary-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 40px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  
  svg {
    font-size: 40px;
    margin-right: 15px;
  }
  
  h1 {
    font-size: 28px;
    font-weight: 600;
  }
`;

const FeatureList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 40px 0;
  width: 100%;
  max-width: 400px;
  
  li {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    
    &:before {
      content: '✓';
      display: inline-block;
      margin-right: 10px;
      font-weight: bold;
      color: var(--secondary-color);
    }
  }
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const LoginForm = styled.form`
  width: 100%;
  max-width: 400px;
`;

const FormTitle = styled.h2`
  margin-bottom: 30px;
  font-weight: 600;
  text-align: center;
  color: var(--text-color);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-color);
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow: hidden;
  transition: border-color 0.2s;
  
  &:focus-within {
    border-color: var(--primary-color);
  }
`;

const InputIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background-color: var(--background-color);
  color: var(--text-light);
`;

const Input = styled.input`
  flex: 1;
  padding: 15px;
  border: none;
  outline: none;
  font-size: 16px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  margin-top: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--text-light);
    cursor: not-allowed;
  }
`;

const FormFooter = styled.div`
  margin-top: 20px;
  text-align: center;
  color: var(--text-light);
  
  a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password });
  };
  
  return (
    <LoginContainer>
      <LeftSection>
        <Logo>
          <FaRobot />
          <h1>CRM Chatbot</h1>
        </Logo>
        <p>The intelligent assistant for managing your professional relationships</p>
        
        <FeatureList>
          <li>Natural language interface for CRM operations</li>
          <li>Automatic extraction of contact information from documents</li>
          <li>Smart engagement suggestions and reminders</li>
          <li>Visual reports and analytics</li>
          <li>Comprehensive contact data management</li>
        </FeatureList>
      </LeftSection>
      
      <RightSection>
        <LoginForm onSubmit={handleSubmit}>
          <FormTitle>Sign In</FormTitle>
          
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <InputGroup>
              <InputIcon>
                <FaUser />
              </InputIcon>
              <Input 
                type="email" 
                id="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputGroup>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <InputGroup>
              <InputIcon>
                <FaLock />
              </InputIcon>
              <Input 
                type="password" 
                id="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </InputGroup>
          </FormGroup>
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </SubmitButton>
          
          <FormFooter>
            Don't have an account? <Link to="/register">Sign Up</Link>
          </FormFooter>
        </LoginForm>
      </RightSection>
    </LoginContainer>
  );
};

export default Login;
