import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatbotPanel from './ChatbotPanel';
import { renderWithProviders } from '../../tests/testUtils';
import { toast } from 'react-toastify';
import axios from 'axios';

// Mock dependencies
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  }))
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  }
}));

// Mock MessageBubble and other child components to simplify testing
jest.mock('./MessageBubble', () => {
  return function MockMessageBubble({ message, isLoading, onSuggestedPromptClick }) {
    return (
      <div 
        data-testid="message-bubble" 
        data-message-type={message.type}
        data-is-loading={isLoading ? 'true' : 'false'}
      >
        {!isLoading && <span>{message.content}</span>}
        {message.parsedContact && (
          <button 
            data-testid="add-contact-button"
            onClick={() => onSuggestedPromptClick(`Add contact for ${message.parsedContact.name}`)}
          >
            Add to contacts
          </button>
        )}
      </div>
    );
  };
});

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaPaperPlane: () => <div data-testid="paper-plane-icon" />,
  FaRobot: () => <div data-testid="robot-icon" />,
  FaTimes: () => <div data-testid="times-icon" />,
  FaUpload: () => <div data-testid="upload-icon" />,
  FaFileUpload: () => <div data-testid="file-upload-icon" />
}));

describe('ChatbotPanel', () => {
  let mockPost;
  
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Set up axios mock
    mockPost = jest.fn();
    axios.create.mockReturnValue({
      post: mockPost,
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      }
    });
  });
  
  it('renders welcome message on initial render', () => {
    renderWithProviders(<ChatbotPanel />);
    
    // Welcome message should be displayed
    const welcomeMessage = screen.getByText("Hi there! I'm your CRM assistant. How can I help you today? You can ask me to search contacts, set reminders, or get advice on engaging with specific contacts.");
    expect(welcomeMessage).toBeInTheDocument();
  });
  
  it('renders suggested prompts on initial render', () => {
    renderWithProviders(<ChatbotPanel />);
    
    // Should have suggested prompts
    expect(screen.getByText('Find contacts in marketing team')).toBeInTheDocument();
    expect(screen.getByText('Set a reminder to contact John Smith in 3 days')).toBeInTheDocument();
  });
  
  it('handles user input and sends message', () => {
    renderWithProviders(<ChatbotPanel />);
    
    // Type a message in the input
    const input = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(input, { target: { value: 'Test message' } });
    
    // Should update input value
    expect(input.value).toBe('Test message');
    
    // Click send button
    const sendButton = screen.getByTestId('paper-plane-icon').closest('button');
    fireEvent.click(sendButton);
    
    // Input should be cleared
    expect(input.value).toBe('');
  });
  
  it('uses suggested prompt when clicked', () => {
    renderWithProviders(<ChatbotPanel />);
    
    // Click a suggested prompt
    const suggestedPrompt = screen.getByText('Find contacts in marketing team');
    fireEvent.click(suggestedPrompt);
    
    // Input should be updated with the clicked prompt
    const input = screen.getByPlaceholderText('Type a message...');
    expect(input.value).toBe('Find contacts in marketing team');
  });
});