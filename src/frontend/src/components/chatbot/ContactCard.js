import React from 'react';
import styled from 'styled-components';
import { FaUser, FaBuilding, FaPhone, FaEnvelope, FaRegClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Card = styled(Link)`
  display: flex;
  background-color: white;
  border-radius: 8px;
  padding: 12px;
  margin-top: 10px;
  box-shadow: 0 1px 3px var(--shadow-color);
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: inherit;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px var(--shadow-color);
  }
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${({ temperature }) => {
    if (temperature === 'hot') return 'var(--hot-temp)';
    if (temperature === 'warm') return 'var(--warm-temp)';
    return 'var(--cold-temp)';
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 20px;
  margin-right: 15px;
  flex-shrink: 0;
`;

const ContactInfo = styled.div`
  flex: 1;
`;

const Name = styled.h4`
  margin: 0 0 5px 0;
  font-size: 16px;
`;

const Detail = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--text-light);
  margin-bottom: 3px;
  
  svg {
    margin-right: 5px;
    font-size: 12px;
  }
`;

const ContactCard = ({ contact }) => {
  // Get the first letter of the contact's name
  const firstLetter = contact.name ? contact.name.charAt(0).toUpperCase() : 'U';
  
  // Calculate time since last contacted
  const getTimeSinceLastContact = () => {
    if (!contact.lastContactedDate) return 'Never contacted';
    
    const days = contact.daysSinceLastContacted || 0;
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };
  
  return (
    <Card to={`/contacts/${contact._id}`}>
      <Avatar temperature={contact.temperature}>
        {firstLetter}
      </Avatar>
      <ContactInfo>
        <Name>{contact.name}</Name>
        <Detail>
          <FaBuilding />
          {contact.role} {contact.currentCompany ? `at ${contact.currentCompany}` : ''}
        </Detail>
        {contact.email && (
          <Detail>
            <FaEnvelope />
            {contact.email}
          </Detail>
        )}
        {contact.phone && (
          <Detail>
            <FaPhone />
            {contact.phone}
          </Detail>
        )}
        <Detail>
          <FaRegClock />
          {getTimeSinceLastContact()}
        </Detail>
      </ContactInfo>
    </Card>
  );
};

export default ContactCard;
