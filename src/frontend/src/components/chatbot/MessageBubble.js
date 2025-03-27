import React from 'react';
import styled from 'styled-components';
import { FaRobot, FaUser } from 'react-icons/fa';
import ContactCard from './ContactCard';
import ReminderCard from './ReminderCard';
import ChartDisplay from './ChartDisplay';

const BubbleContainer = styled.div`
  display: flex;
  flex-direction: ${({ isUser }) => isUser ? 'row-reverse' : 'row'};
  align-items: flex-start;
  gap: 10px;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ isUser }) => isUser ? 'var(--primary-light)' : 'var(--secondary-color)'};
  color: white;
`;

const MessageContent = styled.div`
  max-width: 80%;
  background-color: ${({ isUser }) => isUser ? 'var(--primary-color)' : 'var(--background-color)'};
  color: ${({ isUser }) => isUser ? 'white' : 'var(--text-color)'};
  padding: 12px 15px;
  border-radius: 15px;
  border-top-${({ isUser }) => isUser ? 'right' : 'left'}-radius: 0;
  box-shadow: 0 1px 2px var(--shadow-color);
`;

const LoadingDots = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  
  span {
    display: inline-block;
    width: 6px;
    height: 6px;
    background-color: var(--text-light);
    border-radius: 50%;
    animation: blink 1.4s infinite both;
    
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
  
  @keyframes blink {
    0% { opacity: 0.2; }
    20% { opacity: 1; }
    100% { opacity: 0.2; }
  }
`;

const AdviceList = styled.ul`
  list-style-type: none;
  padding-left: 0;
  margin-top: 10px;
  
  li {
    margin-bottom: 8px;
    padding-left: 18px;
    position: relative;
    
    &:before {
      content: '→';
      position: absolute;
      left: 0;
      color: var(--secondary-color);
    }
  }
`;

const MessageBubble = ({ message, isLoading, onSuggestedPromptClick }) => {
  const isUser = message.type === 'user';
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <LoadingDots>
          <span></span>
          <span></span>
          <span></span>
        </LoadingDots>
      );
    }
    
    // Determine message type and render appropriate content
    if (message.type === 'contacts' && message.content) {
      return (
        <div>
          <p>{message.message}</p>
          {message.content.map((contact, index) => (
            <ContactCard key={index} contact={contact} />
          ))}
        </div>
      );
    } else if (message.type === 'reminder' && message.content) {
      return (
        <div>
          <p>{message.message}</p>
          <ReminderCard reminder={message.content} />
        </div>
      );
    } else if (message.type === 'chart' && message.data) {
      return (
        <div>
          <p>{message.message}</p>
          <ChartDisplay 
            type={message.chartType} 
            data={message.data} 
            labels={message.labels} 
            title={message.title} 
          />
        </div>
      );
    } else if (message.type === 'advice' && message.advice) {
      return (
        <div>
          <p>{message.message}</p>
          <ContactCard contact={message.contact} />
          <AdviceList>
            {message.advice.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </AdviceList>
        </div>
      );
    } else if (message.parsedContact) {
      return (
        <div>
          <p>{message.content}</p>
          <div style={{marginTop: '10px', background: 'white', padding: '10px', borderRadius: '8px'}}>
            <p><strong>Name:</strong> {message.parsedContact.name || 'Not found'}</p>
            <p><strong>Email:</strong> {message.parsedContact.email || 'Not found'}</p>
            <p><strong>Phone:</strong> {message.parsedContact.phone || 'Not found'}</p>
            <p><strong>Company:</strong> {message.parsedContact.currentCompany || 'Not found'}</p>
            <p><strong>Role:</strong> {message.parsedContact.role || 'Not found'}</p>
            <button 
              onClick={() => onSuggestedPromptClick(`Add contact for ${message.parsedContact.name || 'this person'}`)} 
              style={{ 
                marginTop: '10px', 
                background: 'var(--primary-color)', 
                color: 'white', 
                border: 'none', 
                padding: '6px 12px', 
                borderRadius: '4px' 
              }}
            >
              Add to contacts
            </button>
          </div>
        </div>
      );
    }
    
    // Default text message
    return message.content;
  };
  
  return (
    <BubbleContainer isUser={isUser}>
      <Avatar isUser={isUser}>
        {isUser ? <FaUser /> : <FaRobot />}
      </Avatar>
      <MessageContent isUser={isUser}>
        {renderContent()}
      </MessageContent>
    </BubbleContainer>
  );
};

export default MessageBubble;
