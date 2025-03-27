# Component Documentation

This document provides documentation for the key React components in the CRM Chatbot application. It serves as a reference for developers maintaining and extending the application.

## Table of Contents

1. [Common Components](#common-components)
2. [Auth Components](#auth-components)
3. [Layout Components](#layout-components)
4. [Chatbot Components](#chatbot-components)
5. [Contact Components](#contact-components)
6. [Reminder Components](#reminder-components)
7. [Report Components](#report-components)
8. [Contexts](#contexts)
9. [Custom Hooks](#custom-hooks)

## Common Components

### ErrorBoundary

**Purpose**: Catches JavaScript errors anywhere in the child component tree, logs those errors, and displays a fallback UI.

**Props**:
- `children`: React nodes to render
- `fallback`: Optional custom fallback UI
- `fullPage`: Boolean to indicate if the error should take up the full page
- `onReset`: Function to call when the user tries to reset the error state

**Usage**:
```jsx
<ErrorBoundary fallback={<CustomErrorComponent />}>
  <ComponentThatMightError />
</ErrorBoundary>
```

### LoadingSpinner

**Purpose**: Displays a loading spinner for async operations.

**Props**:
- `size`: 'small', 'medium', or 'large'
- `fullPage`: Boolean to indicate if spinner should take up the full page
- `message`: Optional message to display below the spinner
- `className`: Optional custom CSS class

**Usage**:
```jsx
<LoadingSpinner size="medium" message="Loading data..." />
```

## Auth Components

### ProtectedRoute

**Purpose**: Protects routes that require authentication.

**Props**:
- `children`: The components to render if authenticated

**Usage**:
```jsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

## Layout Components

### Layout

**Purpose**: Main layout wrapper that includes navigation and common UI elements.

**Props**:
- `children`: The content to render within the layout

**Usage**:
```jsx
<Layout>
  <Dashboard />
</Layout>
```

### Header

**Purpose**: Top navigation bar with user profile, search, and theme toggle.

**Props**:
- `onToggleSidebar`: Function to toggle sidebar visibility on mobile

**Usage**:
```jsx
<Header onToggleSidebar={handleSidebarToggle} />
```

### Sidebar

**Purpose**: Main navigation sidebar with links to different sections.

**Props**:
- `isOpen`: Boolean to control sidebar visibility on mobile
- `onClose`: Function to close the sidebar on mobile

**Usage**:
```jsx
<Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
```

## Chatbot Components

### ChatbotPanel

**Purpose**: Main chatbot interface that processes user queries and displays responses.

**Props**: None

**State**:
- `isOpen`: Controls chatbot panel visibility
- `messages`: Array of message objects
- `inputValue`: Current input field value
- `isLoading`: Loading state during API calls

**Usage**:
```jsx
<ChatbotPanel />
```

### MessageBubble

**Purpose**: Renders a single message in the chatbot conversation.

**Props**:
- `message`: Message object with type, content, and optional data
- `isLoading`: Boolean to show loading animation
- `onSuggestedPromptClick`: Function to handle suggested prompt clicks

**Usage**:
```jsx
<MessageBubble 
  message={messageObj} 
  isLoading={false} 
  onSuggestedPromptClick={handlePromptClick} 
/>
```

### ContactCard

**Purpose**: Displays contact information in a card format.

**Props**:
- `contact`: Contact object with name, role, etc.

**Usage**:
```jsx
<ContactCard contact={contactData} />
```

### ReminderCard

**Purpose**: Displays reminder information in a card format.

**Props**:
- `reminder`: Reminder object with description, dueDate, etc.

**Usage**:
```jsx
<ReminderCard reminder={reminderData} />
```

### ChartDisplay

**Purpose**: Renders different types of charts for data visualization.

**Props**:
- `type`: Chart type ('bar', 'pie', 'line', etc.)
- `data`: Array of numeric data
- `labels`: Array of labels for the data
- `title`: Chart title

**Usage**:
```jsx
<ChartDisplay 
  type="bar" 
  data={[10, 20, 30]} 
  labels={["Jan", "Feb", "Mar"]} 
  title="Monthly Contacts" 
/>
```

## Contact Components

### ContactsList

**Purpose**: Displays a list of contacts with filtering and pagination.

**Props**:
- `onContactSelect`: Function to handle contact selection

**Usage**:
```jsx
<ContactsList onContactSelect={handleContactSelect} />
```

### ContactForm

**Purpose**: Form for creating or editing contacts.

**Props**:
- `contact`: Contact object for editing (optional for create mode)
- `onSubmit`: Function to handle form submission
- `isLoading`: Boolean to show loading state

**Usage**:
```jsx
<ContactForm 
  contact={contactToEdit} 
  onSubmit={handleSubmit} 
  isLoading={submitting} 
/>
```

### ContactDetail

**Purpose**: Displays detailed information for a single contact.

**Props**:
- `contactId`: ID of the contact to display
- `onEdit`: Function to handle edit button click
- `onDelete`: Function to handle delete button click

**Usage**:
```jsx
<ContactDetail 
  contactId="123456789" 
  onEdit={handleEdit} 
  onDelete={handleDelete} 
/>
```

## Reminder Components

### RemindersList

**Purpose**: Displays a list of reminders with filtering and pagination.

**Props**:
- `onReminderSelect`: Function to handle reminder selection
- `filter`: Object with filter criteria

**Usage**:
```jsx
<RemindersList 
  onReminderSelect={handleReminderSelect} 
  filter={{ completed: false }} 
/>
```

### ReminderForm

**Purpose**: Form for creating or editing reminders.

**Props**:
- `reminder`: Reminder object for editing (optional for create mode)
- `onSubmit`: Function to handle form submission
- `isLoading`: Boolean to show loading state
- `contactId`: Optional contact ID to associate with the reminder

**Usage**:
```jsx
<ReminderForm 
  reminder={reminderToEdit} 
  onSubmit={handleSubmit} 
  isLoading={submitting} 
  contactId="123456789" 
/>
```

### ReminderCalendar

**Purpose**: Calendar view of reminders.

**Props**:
- `onReminderSelect`: Function to handle reminder selection
- `month`: Optional month to display (defaults to current month)
- `year`: Optional year to display (defaults to current year)

**Usage**:
```jsx
<ReminderCalendar 
  onReminderSelect={handleReminderSelect} 
  month={5} 
  year={2025} 
/>
```

## Report Components

### ReportGenerator

**Purpose**: Form for generating various reports.

**Props**:
- `onGenerate`: Function to handle report generation
- `isLoading`: Boolean to show loading state

**Usage**:
```jsx
<ReportGenerator 
  onGenerate={handleGenerateReport} 
  isLoading={generating} 
/>
```

### ReportDisplay

**Purpose**: Displays a generated report with visualizations.

**Props**:
- `report`: Report object with title, data, etc.
- `onSave`: Function to handle saving the report
- `onShare`: Function to handle sharing the report

**Usage**:
```jsx
<ReportDisplay 
  report={reportData} 
  onSave={handleSaveReport} 
  onShare={handleShareReport} 
/>
```

## Contexts

### AuthContext

**Purpose**: Manages authentication state and provides auth-related functions.

**Provider**: `AuthProvider`

**Values**:
- `user`: Current user object or null
- `loading`: Boolean indicating auth loading state
- `register`: Function to register a new user
- `login`: Function to log in a user
- `logout`: Function to log out a user
- `updateProfile`: Function to update user profile
- `refreshToken`: Function to refresh the JWT token

**Usage**:
```jsx
const { user, login, logout } = useAuth();
```

### ThemeContext

**Purpose**: Manages the app's theme (light/dark mode).

**Provider**: `ThemeProvider`

**Values**:
- `theme`: Current theme ('light' or 'dark')
- `toggleTheme`: Function to toggle between light and dark
- `setTheme`: Function to set a specific theme
- `isDark`: Boolean indicating if dark mode is active

**Usage**:
```jsx
const { theme, toggleTheme, isDark } = useTheme();
```

## Custom Hooks

### useApi

**Purpose**: Handles API requests with loading, error states, and caching.

**Parameters**:
- `url`: API endpoint URL
- `options`: Configuration options

**Returns**:
- `data`: Response data
- `loading`: Boolean loading state
- `error`: Error object or null
- `fetchData`: Function to fetch data
- `createResource`: Function to create a resource
- `updateResource`: Function to update a resource
- `deleteResource`: Function to delete a resource
- `refresh`: Function to refresh data
- `clearError`: Function to clear error state

**Usage**:
```jsx
const { 
  data: contacts, 
  loading, 
  error,
  fetchData
} = useApi('/api/contacts', { loadOnMount: true });
```

### useDebounce

**Purpose**: Debounces a value to prevent rapid changes.

**Parameters**:
- `value`: The value to debounce
- `delay`: Delay in milliseconds

**Returns**: The debounced value

**Usage**:
```jsx
const debouncedSearchTerm = useDebounce(searchTerm, 500);
```

### useLocalStorage

**Purpose**: Syncs state with localStorage for persistence.

**Parameters**:
- `key`: localStorage key
- `initialValue`: Initial state value

**Returns**: State and setter function

**Usage**:
```jsx
const [savedData, setSavedData] = useLocalStorage('user-preferences', defaultPreferences);
```

### useMediaQuery

**Purpose**: Responds to media query changes for responsive design.

**Parameters**:
- `query`: CSS media query string

**Returns**: Boolean indicating if the query matches

**Usage**:
```jsx
const isMobile = useMediaQuery('(max-width: 768px)');
```

## Event Handling Patterns

Throughout the components, we follow these event handling patterns:

1. **Form Submissions**: Prevent default behavior, validate, then make API calls.
2. **Click Handlers**: Use descriptive names and handle parent-child event propagation with stopPropagation when needed.
3. **Async Operations**: Always handle loading states and errors.

## Styling Patterns

The application uses styled-components with these patterns:

1. **Theme Variables**: Access theme variables like `var(--primary-color)` for consistent styling.
2. **Responsive Design**: Use media queries for different screen sizes.
3. **Component Composition**: Compose styled components for complex UI elements.

## Performance Considerations

1. **React.memo**: Used for components that re-render frequently with the same props.
2. **Lazy Loading**: Components are lazy-loaded with React.lazy and Suspense.
3. **API Caching**: The useApi hook includes caching to reduce network requests.
4. **Virtualization**: For long lists, we use virtualization to render only visible items.