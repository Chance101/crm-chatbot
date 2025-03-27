import React from 'react';
import styled from 'styled-components';
import { FaUser, FaBell, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const HeaderContainer = styled.header`
  background-color: var(--white);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px var(--shadow-color);
  z-index: 10;
`;

const SearchBar = styled.div`
  flex: 1;
  max-width: 500px;
  margin: 0 2rem;
  
  input {
    width: 100%;
    padding: 10px 15px;
    border: 1px solid var(--border-color);
    border-radius: 25px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
    
    &:focus {
      border-color: var(--primary-color);
    }
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  margin-left: 15px;
  position: relative;
  cursor: pointer;
  font-size: 20px;
  color: var(--text-light);
  
  &:hover {
    color: var(--primary-color);
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--error-color);
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
  
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    object-fit: cover;
    background-color: var(--primary-light);
  }
  
  .user-info {
    display: flex;
    flex-direction: column;
    
    .name {
      font-weight: 600;
      font-size: 14px;
      color: var(--text-color);
    }
    
    .role {
      font-size: 12px;
      color: var(--text-light);
    }
  }
`;

const Header = () => {
  const { user, logout } = useAuth();
  
  return (
    <HeaderContainer>
      <SearchBar>
        <input 
          type="text" 
          placeholder="Search contacts, reminders..." 
        />
      </SearchBar>
      
      <RightSection>
        <IconButton as={Link} to="/reminders">
          <FaBell />
          <NotificationBadge>3</NotificationBadge>
        </IconButton>
        
        <IconButton onClick={logout}>
          <FaSignOutAlt />
        </IconButton>
        
        <UserSection as={Link} to="/profile">
          <FaUser size={24} />
          <div className="user-info">
            <span className="name">{user?.name || 'User'}</span>
            <span className="role">{user?.role || 'User'}</span>
          </div>
        </UserSection>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;
