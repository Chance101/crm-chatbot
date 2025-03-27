import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MessageBubble from './MessageBubble';
import { renderWithProviders } from '../../tests/testUtils';

// Mock the child components
jest.mock('./ContactCard', () => {
  return function MockContactCard({ contact }) {
    return (
      <div data-testid="contact-card" data-contact-id={contact._id}>
        {contact.name}
      </div>
    );
  };
});

jest.mock('./ReminderCard', () => {
  return function MockReminderCard({ reminder }) {
    return (
      <div data-testid="reminder-card" data-reminder-id={reminder._id}>
        {reminder.description}
      </div>
    );
  };
});

jest.mock('./ChartDisplay', () => {
  return function MockChartDisplay({ type, title }) {
    return (
      <div data-testid="chart-display" data-chart-type={type}>
        {title}
      </div>
    );
  };
});

// Mock icons
jest.mock('react-icons/fa', () => ({
  FaRobot: () => <div data-testid="robot-icon" />,
  FaUser: () => <div data-testid="user-icon" />
}));

describe('MessageBubble', () => {
  const mockSuggestedPromptClick = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders a user message correctly', () => {
    const message = {
      type: 'user',
      content: 'Hello, this is a test message'
    };
    
    renderWithProviders(<MessageBubble message={message} />);
    
    // Check message content
    expect(screen.getByText(message.content)).toBeInTheDocument();
    
    // Should have user icon
    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
  });
  
  it('renders a bot message correctly', () => {
    const message = {
      type: 'bot',
      content: 'Hello, I am the chatbot'
    };
    
    renderWithProviders(<MessageBubble message={message} />);
    
    // Check message content
    expect(screen.getByText(message.content)).toBeInTheDocument();
    
    // Should have robot icon
    expect(screen.getByTestId('robot-icon')).toBeInTheDocument();
  });
  
  it('renders parsed contact correctly', () => {
    const message = {
      content: 'I found this contact information:',
      parsedContact: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '555-987-6543',
        currentCompany: 'Acme Inc',
        role: 'Developer'
      }
    };
    
    renderWithProviders(
      <MessageBubble 
        message={message} 
        onSuggestedPromptClick={mockSuggestedPromptClick} 
      />
    );
    
    // Check that content is displayed
    expect(screen.getByText(message.content)).toBeInTheDocument();
    
    // Check field labels are displayed
    expect(screen.getByText(/Name:/)).toBeInTheDocument();
    expect(screen.getByText(/Email:/)).toBeInTheDocument();
    expect(screen.getByText(/Phone:/)).toBeInTheDocument();
    expect(screen.getByText(/Company:/)).toBeInTheDocument();
    expect(screen.getByText(/Role:/)).toBeInTheDocument();
  });
});