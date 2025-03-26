import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaAddressBook, 
  FaClock, 
  FaChartBar, 
  FaCog,
  FaRobot
} from 'react-icons/fa';

const SidebarContainer = styled.nav`
  width: 240px;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px var(--shadow-color);
`;

const LogoSection = styled.div`
  padding: 2rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      margin-right: 10px;
    }
  }
`;

const NavSection = styled.div`
  padding: 1.5rem 0;
  flex: 1;
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
`;

const NavItem = styled.li`
  margin-bottom: 5px;
  
  a {
    display: flex;
    align-items: center;
    padding: 12px 25px;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: all 0.2s;
    font-weight: 500;
    position: relative;
    overflow: hidden;
    
    svg {
      margin-right: 15px;
      font-size: 20px;
    }
    
    &:hover, &.active {
      color: white;
      background-color: rgba(255, 255, 255, 0.05);
      
      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 4px;
        background-color: var(--secondary-color);
      }
    }
  }
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <LogoSection>
        <h1>
          <FaRobot />
          CRM Chatbot
        </h1>
      </LogoSection>
      
      <NavSection>
        <ul>
          <NavItem>
            <NavLink to="/" end>
              <FaHome />
              Dashboard
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink to="/contacts">
              <FaAddressBook />
              Contacts
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink to="/reminders">
              <FaClock />
              Reminders
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink to="/reports">
              <FaChartBar />
              Reports
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink to="/profile">
              <FaCog />
              Settings
            </NavLink>
          </NavItem>
        </ul>
      </NavSection>
    </SidebarContainer>
  );
};

export default Sidebar;
