# CRM Chatbot

A modern CRM application with intelligent AI chatbot capabilities for managing contacts, reminders, and generating insights.

## Features

- **AI-Powered Chatbot**: Natural language interface for managing contacts and reminders
- **Contact Management**: Comprehensive contact tracking with communication history
- **Reminders System**: Never miss important follow-ups with intelligent scheduling
- **Data Visualization**: Generate insightful reports on your contacts and activities
- **PDF Processing**: Extract contact information from business cards and documents
- **Responsive UI**: Works seamlessly on desktop and mobile devices
- **Dark/Light Mode**: Choose your preferred theme for comfortable use

## Tech Stack

- **Frontend**: React, styled-components, Chart.js, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based auth with refresh tokens
- **AI Integration**: Claude API for natural language processing
- **PDF Processing**: PDF.js for document parsing
- **Visualization**: Chart.js for data visualization
- **Testing**: Jest, React Testing Library
- **Deployment**: Docker, Docker Compose

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (v6+)
- Claude API key (for AI functionality)

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/crm-chatbot.git
cd crm-chatbot
```

2. Create a `.env` file with the following variables:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crm-chatbot
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d
CLAUDE_API_KEY=your_claude_api_key
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

3. Install dependencies:
```bash
npm run setup
```

### Running Locally

1. Start the development server:
```bash
npm run dev
```

This will start both the backend server and the React development server concurrently.

2. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Testing

Run the test suite:

```bash
# Run all tests
npm run test:all

# Run only backend tests
npm run test

# Run only frontend tests
npm run test:frontend

# Run test coverage report
npm run test:coverage
```

## Deployment

### Docker Deployment

1. Build and run with Docker Compose:
```bash
docker-compose up -d
```

2. For production builds:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Manual Deployment

1. Build the frontend:
```bash
npm run build
```

2. Start the production server:
```bash
NODE_ENV=production npm start
```

## Configuration Options

### Authentication

- `JWT_SECRET`: Secret key for signing JWTs
- `JWT_EXPIRES_IN`: Token expiration time (default: 7d)
- `REFRESH_TOKEN_EXPIRES_IN`: Refresh token lifetime (default: 30d)

### Rate Limiting

- `RATE_LIMIT_WINDOW`: Time window for rate limiting in minutes
- `RATE_LIMIT_MAX`: Maximum number of requests per window

### Logging

- `LOG_LEVEL`: Logging level (error, warn, info, debug)

## Performance Monitoring

The application includes comprehensive performance monitoring:

- API response time tracking
- Database query performance logging
- Memory usage monitoring
- MongoDB connection monitoring
- Structured logging for all operations

Access logs in the `/logs` directory when running locally.

## Project Structure

```
.
├── docs/                    # Documentation files
├── public/                  # Static assets
├── src/                     # Source files
│   ├── backend/             # Node.js/Express backend
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic services
│   │   ├── utils/           # Utility functions
│   │   └── server.js        # Express server setup
│   ├── frontend/            # React frontend
│   │   ├── public/          # Public assets
│   │   └── src/             # React source files
│   │       ├── components/  # React components
│   │       ├── contexts/    # React contexts
│   │       ├── hooks/       # Custom hooks
│   │       ├── pages/       # Page components
│   │       ├── services/    # API services
│   │       └── styles/      # Global styles
│   └── scripts/             # Utility scripts
├── tests/                   # Test files
├── .env.example             # Example environment variables
├── docker-compose.yml       # Docker Compose configuration
├── Dockerfile               # Docker configuration
└── package.json             # NPM package configuration
```

## API Documentation

See [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) for detailed API documentation.

## User Guide

See [USER_GUIDE.md](docs/USER_GUIDE.md) for the user manual.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Claude AI for powering the chatbot functionality
- The MERN stack community for excellent tools and resources