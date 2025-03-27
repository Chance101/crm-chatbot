import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaPaperPlane, FaRobot, FaTimes, FaUpload, FaFileUpload } from 'react-icons/fa';
import MessageBubble from './MessageBubble';
import api from '../../services/api';
import { toast } from 'react-toastify';
import ContactCard from './ContactCard';
import ReminderCard from './ReminderCard';
import ChartDisplay from './ChartDisplay';

const ChatbotContainer = styled.div`
  width: 350px;
  background-color: var(--white);
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 10px var(--shadow-color);
  transition: transform 0.3s;
  transform: ${({ isOpen }) => isOpen ? 'translateX(0)' : 'translateX(100%)'};
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
`;

const ChatHeader = styled.div`
  padding: 1rem;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    margin: 0;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 10px;
    }
  }
`;

const ChatboxToggle = styled.button`
  position: fixed;
  bottom: 20px;
  right: ${({ isOpen }) => isOpen ? '370px' : '20px'};
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 2px 10px var(--shadow-color);
  z-index: 1001;
  transition: right 0.3s;
  
  svg {
    font-size: 24px;
  }
`;

const MessageContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  scroll-behavior: smooth;
`;

const InputArea = styled.div`
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 10px;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 12px 15px;
  border: 1px solid var(--border-color);
  border-radius: 25px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: var(--primary-color);
  }
`;

const SendButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
`;

const UploadButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--secondary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  position: relative;
  overflow: hidden;
  
  input[type="file"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
`;

const WelcomeMessage = {
  type: 'bot',
  content: 'Hi there! I\'m your CRM assistant. How can I help you today? You can ask me to search contacts, set reminders, or get advice on engaging with specific contacts.',
};

const SuggestedPrompts = [
  'Find contacts in marketing team',
  'Set a reminder to contact John Smith in 3 days',
  'Show me contacts I haven\'t reached out to in 30 days',
  'Generate a report on contact temperature',
  'Give me talking points for Sarah Johnson'
];

const ChatbotPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WelcomeMessage]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      type: 'user',
      content: inputValue,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Send message to chatbot API
      const response = await api.post('/api/chatbot/query', { query: userMessage.content });
      
      // Add bot response to chat
      const botResponse = {
        type: 'bot',
        ...response.data,
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      toast.error('Failed to get a response from the chatbot');
      
      // Add error message
      setMessages(prev => [
        ...prev, 
        { 
          type: 'bot', 
          content: 'Sorry, I encountered an error while processing your request. Please try again.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are supported');
      return;
    }
    
    // Create form data for file upload
    const formData = new FormData();
    formData.append('pdf', file);
    
    // Add uploading message
    setMessages(prev => [
      ...prev, 
      { 
        type: 'user', 
        content: `Uploading file: ${file.name}`
      }
    ]);
    
    setIsLoading(true);
    
    try {
      // Upload PDF
      const uploadResponse = await api.post('/api/pdf/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Extract text from PDF
      const extractResponse = await api.post('/api/pdf/extract', { 
        filePath: uploadResponse.data.file.path 
      });
      
      // Parse contact info from text
      const parseResponse = await api.post('/api/pdf/parse', { 
        text: extractResponse.data.text 
      });
      
      // Add bot response with parsed information
      setMessages(prev => [
        ...prev, 
        { 
          type: 'bot', 
          content: `I've extracted the following information from ${file.name}:`,
          parsedContact: parseResponse.data
        }
      ]);
    } catch (error) {
      console.error('Error processing PDF:', error);
      toast.error('Failed to process the PDF file');
      
      // Add error message
      setMessages(prev => [
        ...prev, 
        { 
          type: 'bot', 
          content: 'Sorry, I had trouble processing that PDF. Please try a different file.'
        }
      ]);
    } finally {
      setIsLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleSuggestedPrompt = (prompt) => {
    setInputValue(prompt);
  };
  
  return (
    <>
      <ChatboxToggle isOpen={isOpen} onClick={toggleChatbot}>
        {isOpen ? <FaTimes /> : <FaRobot />}
      </ChatboxToggle>
      
      <ChatbotContainer isOpen={isOpen}>
        <ChatHeader>
          <h3>
            <FaRobot />
            CRM Assistant
          </h3>
          <FaTimes style={{ cursor: 'pointer' }} onClick={toggleChatbot} />
        </ChatHeader>
        
        <MessageContainer>
          {messages.map((message, index) => (
            <MessageBubble 
              key={index} 
              message={message} 
              onSuggestedPromptClick={handleSuggestedPrompt}
            />
          ))}
          
          {isLoading && (
            <MessageBubble 
              message={{ type: 'bot', content: 'Thinking...' }} 
              isLoading={true}
            />
          )}
          
          {/* Show suggested prompts after welcome message */}
          {messages.length === 1 && messages[0] === WelcomeMessage && (
            <div style={{ marginTop: '10px' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '8px' }}>
                Try asking:
              </p>
              {SuggestedPrompts.map((prompt, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: 'var(--background-color)',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    marginBottom: '5px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleSuggestedPrompt(prompt)}
                >
                  {prompt}
                </div>
              ))}
            </div>
          )}
          
          <div ref={messageEndRef} />
        </MessageContainer>
        
        <InputArea>
          <UploadButton>
            <FaFileUpload />
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={handleFileUpload}
              ref={fileInputRef}
            />
          </UploadButton>
          
          <MessageInput 
            type="text" 
            placeholder="Type a message..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          
          <SendButton onClick={handleSendMessage}>
            <FaPaperPlane />
          </SendButton>
        </InputArea>
      </ChatbotContainer>
    </>
  );
};

export default ChatbotPanel;
