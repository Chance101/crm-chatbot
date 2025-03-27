# CRM Chatbot API Documentation

## Overview

The CRM Chatbot API provides programmatic access to contacts, reminders, reports, and AI chatbot functionality. This document outlines the available endpoints, request/response formats, and authentication requirements.

## Base URL

All API endpoints are relative to:

```
https://api.crmchatbot.com/api
```

For local development:

```
http://localhost:5000/api
```

## Authentication

### JWT Authentication

The API uses JSON Web Tokens (JWT) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Obtaining a Token

**POST** `/auth/login`

Request:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

### Token Refresh

**POST** `/auth/refresh-token`

Request:
```
Authorization: Bearer <your_current_token>
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Rate Limiting

API requests are limited to 100 requests per minute per user. When the limit is exceeded, requests will receive a 429 Too Many Requests response.

## Endpoints

### Contacts

#### List Contacts

**GET** `/contacts`

Parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)
- `sort` (optional): Field to sort by (default: 'updatedAt')
- `order` (optional): Sort order ('asc' or 'desc', default: 'desc')
- `search` (optional): Search term to filter results

Response:
```json
{
  "contacts": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "Jane Smith",
      "role": "Marketing Director",
      "currentCompany": "TechCorp",
      "email": "jane@techcorp.com",
      "phone": "555-123-4567",
      "temperature": "hot",
      "lastContactedDate": "2025-01-15T14:22:10.510Z",
      "daysSinceLastContacted": 5,
      "communications": [
        {
          "type": "email",
          "content": "Discussed new project",
          "date": "2025-01-15T14:22:10.510Z"
        }
      ],
      "user": "60d21b4667d0d8992e610c85",
      "createdAt": "2025-01-10T11:30:15.000Z",
      "updatedAt": "2025-01-15T14:22:10.510Z"
    }
  ],
  "totalResults": 45,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

#### Get Single Contact

**GET** `/contacts/:id`

Response:
```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "name": "Jane Smith",
  "role": "Marketing Director",
  "currentCompany": "TechCorp",
  "email": "jane@techcorp.com",
  "phone": "555-123-4567",
  "temperature": "hot",
  "lastContactedDate": "2025-01-15T14:22:10.510Z",
  "daysSinceLastContacted": 5,
  "communications": [
    {
      "type": "email",
      "content": "Discussed new project",
      "date": "2025-01-15T14:22:10.510Z"
    }
  ],
  "user": "60d21b4667d0d8992e610c85",
  "createdAt": "2025-01-10T11:30:15.000Z",
  "updatedAt": "2025-01-15T14:22:10.510Z"
}
```

#### Create Contact

**POST** `/contacts`

Request:
```json
{
  "name": "John Doe",
  "role": "CTO",
  "currentCompany": "Tech Solutions",
  "email": "john@techsolutions.com",
  "phone": "555-987-6543",
  "temperature": "warm"
}
```

Response: The created contact object

#### Update Contact

**PUT** `/contacts/:id`

Request: Object with fields to update

Response: The updated contact object

#### Delete Contact

**DELETE** `/contacts/:id`

Response:
```json
{
  "message": "Contact removed"
}
```

#### Search Contacts

**GET** `/contacts/search`

Parameters:
- `query`: Search term
- `team`: Filter by team
- `role`: Filter by role
- `temperature`: Filter by temperature
- `company`: Filter by company
- `lastContactDays`: Filter by days since last contacted

Response: Array of matching contacts

### Reminders

#### List Reminders

**GET** `/reminders`

Parameters:
- `page` (optional): Page number
- `limit` (optional): Results per page
- `sort` (optional): Field to sort by
- `order` (optional): Sort order
- `completed` (optional): Filter by completion status
- `dueDate` (optional): Filter by due date

Response:
```json
{
  "reminders": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "description": "Follow up on proposal",
      "dueDate": "2025-01-20T10:00:00.000Z",
      "completed": false,
      "priority": "high",
      "contact": {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Jane Smith"
      },
      "user": "60d21b4667d0d8992e610c85",
      "createdAt": "2025-01-15T14:22:10.510Z",
      "updatedAt": "2025-01-15T14:22:10.510Z"
    }
  ],
  "totalResults": 5,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

#### Get Single Reminder

**GET** `/reminders/:id`

Response: The requested reminder object

#### Create Reminder

**POST** `/reminders`

Request:
```json
{
  "description": "Follow up on proposal",
  "dueDate": "2025-01-20T10:00:00.000Z",
  "priority": "high",
  "contact": "60d21b4667d0d8992e610c85"
}
```

Response: The created reminder object

#### Update Reminder

**PUT** `/reminders/:id`

Request: Object with fields to update

Response: The updated reminder object

#### Delete Reminder

**DELETE** `/reminders/:id`

Response:
```json
{
  "message": "Reminder removed"
}
```

### Reports

#### Generate Report

**GET** `/reports/generate`

Parameters:
- `type`: Report type ("temperature", "team", "engagement", "activity")
- `startDate` (optional): Start date for report data
- `endDate` (optional): End date for report data

Response:
```json
{
  "title": "Contact Temperature Distribution",
  "chartType": "pie",
  "labels": ["Hot", "Warm", "Cold"],
  "data": [10, 25, 15],
  "summary": "Your network consists of 10 hot, 25 warm, and 15 cold contacts."
}
```

### Chatbot

#### Process Query

**POST** `/chatbot/query`

Request:
```json
{
  "query": "Find contacts in the marketing team"
}
```

Response:
```json
{
  "type": "contacts",
  "message": "I found 3 contacts in the marketing team:",
  "content": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "Jane Smith",
      "role": "Marketing Director",
      "temperature": "hot"
    },
    ...
  ]
}
```

#### Get Engagement Advice

**GET** `/chatbot/engagement-advice/:contactId`

Response:
```json
{
  "type": "advice",
  "message": "Here's my advice for engaging with Jane Smith:",
  "contact": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Jane Smith",
    "role": "Marketing Director"
  },
  "advice": [
    "Mention the recent industry report on digital marketing ROI",
    "Ask about the success of their Q1 campaign",
    "Share the case study from your recent project with similar companies"
  ]
}
```

### PDF Processing

#### Upload PDF

**POST** `/pdf/upload`

Request: Form data with 'pdf' file

Response:
```json
{
  "message": "File uploaded successfully",
  "file": {
    "filename": "business_card.pdf",
    "path": "/uploads/business_card_1642161423.pdf",
    "size": 125000
  }
}
```

#### Extract Text

**POST** `/pdf/extract`

Request:
```json
{
  "filePath": "/uploads/business_card_1642161423.pdf"
}
```

Response:
```json
{
  "text": "Jane Smith\nMarketing Director\nTechCorp\nEmail: jane@techcorp.com\nPhone: 555-123-4567"
}
```

#### Parse Contact Information

**POST** `/pdf/parse`

Request:
```json
{
  "text": "Jane Smith\nMarketing Director\nTechCorp\nEmail: jane@techcorp.com\nPhone: 555-123-4567"
}
```

Response:
```json
{
  "name": "Jane Smith",
  "role": "Marketing Director",
  "currentCompany": "TechCorp",
  "email": "jane@techcorp.com",
  "phone": "555-123-4567"
}
```

## Error Handling

The API returns appropriate HTTP status codes for different error scenarios:

- `400 Bad Request`: Invalid input parameters
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server-side error

Error responses include a message and optional details:

```json
{
  "error": "Validation error: Contact could not be created",
  "details": {
    "name": "Contact name is required"
  }
}
```

## Data Models

### Contact

| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique identifier |
| user | ObjectId | Reference to user who owns this contact |
| name | String | Contact's full name (required) |
| role | String | Job title |
| team | String | Department or team |
| currentCompany | String | Current employer |
| email | String | Email address |
| phone | String | Phone number |
| temperature | String | Relationship status: "hot", "warm", or "cold" |
| lastContactedDate | Date | When the contact was last contacted |
| communications | Array | List of communication records |
| createdAt | Date | Creation timestamp |
| updatedAt | Date | Last update timestamp |

### Reminder

| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique identifier |
| user | ObjectId | Reference to user who created this reminder |
| contact | ObjectId | Reference to related contact |
| description | String | Reminder description (required) |
| dueDate | Date | When the reminder is due (required) |
| completed | Boolean | Whether the reminder has been completed |
| priority | String | "high", "medium", or "low" |
| createdAt | Date | Creation timestamp |
| updatedAt | Date | Last update timestamp |

## Websockets

Real-time updates are available through websockets for reminders and notifications. Connect to:

```
wss://api.crmchatbot.com/ws
```

Authentication requires passing the JWT token as a query parameter:

```
wss://api.crmchatbot.com/ws?token=your_jwt_token
```

### Events

- `reminder:due`: Triggered when a reminder becomes due
- `reminder:created`: Triggered when a new reminder is created
- `contact:updated`: Triggered when a contact is updated

## Changelog

### v1.0.0 (2025-01-01)
- Initial API release

### v1.1.0 (2025-02-15)
- Added report generation endpoints
- Improved contact search capabilities
- Added PDF processing

## Support

For API support, contact:

- Email: api-support@crmchatbot.com
- Developer Portal: https://developers.crmchatbot.com