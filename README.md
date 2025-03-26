# CRM Chatbot Application

A modern CRM application with natural language chatbot interface for managing contacts and relationships.

## Features

- **Smart Chatbot Interface**: Natural language interface for interacting with your CRM data
- **Contact Management**: Comprehensive database for storing detailed contact information
- **PDF Parsing**: Extract contact information from uploaded PDF documents
- **Reminders**: Set and manage follow-up reminders for your contacts
- **Analytics**: Visualize your contact data with charts and graphs
- **Engagement Advice**: Get personalized advice for engaging with specific contacts
- **User Authentication**: Secure access with JWT-based authentication

## Tech Stack

- **Backend**: Node.js with Express
- **Database**: MongoDB (configurable)
- **Frontend**: React with Styled Components
- **PDF Processing**: PDF.js for document parsing
- **NLP**: Claude AI integration with Natural.js fallback for natural language processing
- **Authentication**: JWT-based authentication system
- **Charts**: Chart.js for data visualization

## Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB (local or Atlas)

## Installation and Setup

### Clone the Repository

```bash
git clone <repository-url>
cd crm-chatbot
```

### Set Up Environment Variables

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/crm-chatbot

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# Claude AI Integration
CLAUDE_API_KEY=your_claude_api_key_here
```

### Install Dependencies

Install backend dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
cd src/frontend
npm install
cd ../..
```

Or use the setup script to install both:

```bash
npm run setup
```

### Start Development Servers

```bash
npm run dev
```

This will start both the backend server (on port 5000) and the frontend development server (on port 3000).

## Usage Guide

### Authentication

1. Register a new account or login with existing credentials
2. The auth token will be stored in localStorage for persistent sessions

### Using the Chatbot

The chatbot interface allows natural language interactions with your CRM. Example commands:

- "Find contacts in marketing team"
- "Set a reminder to contact John Smith in 3 days"
- "Show me contacts I haven't reached out to in 30 days"
- "Generate a report on contact temperature"
- "Give me talking points for Sarah Johnson"

### Contact Management

- Add new contacts manually through the interface
- Upload PDF documents (like resumes or business cards) to extract contact information
- View and edit contact details
- Log communications with contacts

### Reminders

- Set reminders for follow-ups
- Receive notifications for upcoming reminders
- Mark reminders as completed

### Analytics and Reports

- View contact distribution by temperature, team, etc.
- Generate custom reports through the chatbot interface

## Deployment

### Production Build

Create a production build of the frontend and start the server:

```bash
npm run build
npm start
```

### Docker Deployment

Build and run the Docker container:

```bash
docker build -t crm-chatbot .
docker run -p 5000:5000 crm-chatbot
```

Or use Docker Compose:

```bash
docker-compose up
```

### Deployment Platforms

This application can be deployed to:

- **Heroku**: Procfile included for easy deployment
- **AWS/GCP/Azure**: Use Docker for containerized deployment
- **DigitalOcean**: Use Docker or direct Node.js deployment

## Project Structure

```
crm-chatbot/
├── src/                      # Source code
│   ├── backend/              # Backend Node.js application
│   │   ├── config/           # Configuration files
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Express middleware
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── utils/            # Utility functions
│   │   └── server.js         # Express server entry point
│   ├── frontend/             # React frontend application
│   │   ├── public/           # Static files
│   │   └── src/              # React source code
│   │       ├── components/   # React components
│   │       ├── contexts/     # React contexts
│   │       ├── hooks/        # Custom React hooks
│   │       ├── pages/        # Page components
│   │       ├── services/     # API services
│   │       ├── styles/       # Global styles
│   │       ├── App.js        # Main App component
│   │       └── index.js      # React entry point
│   └── uploads/              # Uploaded files (PDFs, etc.)
├── .env.example              # Example environment variables
├── .gitignore                # Git ignore file
├── docker-compose.yml        # Docker Compose configuration
├── Dockerfile                # Docker configuration
├── package.json              # Project dependencies
└── README.md                 # Project documentation
```

## Claude AI Integration

This application integrates with Claude AI for advanced natural language processing capabilities. Key benefits include:

- Improved intent recognition and entity extraction
- Enhanced engagement advice for contacts
- More accurate interpretation of user queries
- Fallback to built-in NLP when necessary

To enable Claude AI integration:

1. Get an API key from Anthropic (Claude AI provider)
2. Add your API key to the `.env` file: `CLAUDE_API_KEY=your_key_here`
3. The chatbot will automatically use Claude when available and fall back to the local NLP when needed

## Future Enhancements

- **Expanded AI Capabilities**: Add more Claude-powered features
- **Mobile App**: Develop companion mobile application
- **Email Integration**: Connect with email services for automatic logging
- **Calendar Integration**: Sync with Google Calendar or Outlook
- **Voice Commands**: Add voice recognition for hands-free operation

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.