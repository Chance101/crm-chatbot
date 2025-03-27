import React from 'react';
import styled from 'styled-components';
import { FaClock, FaUser, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 12px;
  margin-top: 10px;
  box-shadow: 0 1px 3px var(--shadow-color);
`;

const ReminderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const Title = styled.h4`
  margin: 0;
  font-size: 16px;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
    color: ${({ priority }) => {
      if (priority === 'high') return 'var(--error-color)';
      if (priority === 'medium') return 'var(--warning-color)';
      return 'var(--success-color)';
    }};
  }
`;

const Status = styled.span`
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 12px;
  background-color: ${({ isCompleted, isOverdue }) => {
    if (isCompleted) return 'var(--success-color)';
    if (isOverdue) return 'var(--error-color)';
    return 'var(--warning-color)';
  }};
  color: white;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 4px;
  }
`;

const Description = styled.p`
  margin: 8px 0;
  font-size: 14px;
`;

const ContactInfo = styled(Link)`
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: var(--background-color);
  border-radius: 6px;
  margin-top: 10px;
  text-decoration: none;
  color: inherit;
  
  svg {
    margin-right: 8px;
    color: var(--primary-color);
  }
  
  span {
    font-size: 14px;
  }
`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

const ReminderCard = ({ reminder }) => {
  const isOverdue = reminder.isOverdue || (new Date(reminder.dueDate) < new Date() && !reminder.completed);
  
  return (
    <Card>
      <ReminderHeader>
        <Title priority={reminder.priority}>
          <FaClock /> 
          Due: {formatDate(reminder.dueDate)}
        </Title>
        <Status isCompleted={reminder.completed} isOverdue={isOverdue}>
          {reminder.completed ? (
            <>
              <FaCheckCircle /> Completed
            </>
          ) : isOverdue ? (
            <>
              <FaExclamationCircle /> Overdue
            </>
          ) : (
            <>
              <FaClock /> Pending
            </>
          )}
        </Status>
      </ReminderHeader>
      
      <Description>{reminder.description}</Description>
      
      {reminder.contact && (
        <ContactInfo to={`/contacts/${reminder.contact._id}`}>
          <FaUser />
          <span>{reminder.contact.name} {reminder.contact.role ? `- ${reminder.contact.role}` : ''}</span>
        </ContactInfo>
      )}
    </Card>
  );
};

export default ReminderCard;
