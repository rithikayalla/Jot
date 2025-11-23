# Backend Integration Guide

This document outlines the data structures and API endpoints needed to connect the backend with this journaling app frontend.

## Data Models

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}
```

### Entry
```typescript
interface Entry {
  id: string;
  userId: string;
  content: string;
  category: string; // Category ID
  date: Date;
  sentiment?: 'positive' | 'negative' | 'neutral';
  createdAt: Date;
  updatedAt: Date;
}
```

### Category
```typescript
interface Category {
  id: string;
  userId: string;
  name: string;
  color: string; // Hex color code
  createdAt: Date;
}
```

## Required API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
  - Body: `{ name: string, email: string, password: string }`
  - Returns: `{ user: User, token: string }`

- `POST /api/auth/login` - User login
  - Body: `{ email: string, password: string }`
  - Returns: `{ user: User, token: string }`

- `GET /api/auth/me` - Get current user
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ user: User }`

### Entries
- `GET /api/entries` - Get all user entries
  - Headers: `Authorization: Bearer <token>`
  - Query params: `?category=<categoryId>&startDate=<date>&endDate=<date>`
  - Returns: `{ entries: Entry[] }`

- `POST /api/entries` - Create new entry
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ content: string, category: string }`
  - Returns: `{ entry: Entry }`

- `GET /api/entries/:id` - Get specific entry
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ entry: Entry }`

- `PUT /api/entries/:id` - Update entry
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ content: string }`
  - Returns: `{ entry: Entry }`

- `DELETE /api/entries/:id` - Delete entry
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ success: boolean }`

### Categories
- `GET /api/categories` - Get all user categories
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ categories: Category[] }`

- `POST /api/categories` - Create new category
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ name: string, color: string }`
  - Returns: `{ category: Category }`

- `PUT /api/categories/:id` - Update category
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ name?: string, color?: string }`
  - Returns: `{ category: Category }`

- `DELETE /api/categories/:id` - Delete category
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ success: boolean }`

### Analytics
- `GET /api/analytics/weekly` - Get weekly summary
  - Headers: `Authorization: Bearer <token>`
  - Returns: 
  ```typescript
  {
    totalEntries: number,
    positivePercentage: number,
    negativePercentage: number,
    neutralPercentage: number,
    entriesByDay: Array<{ date: string, count: number }>,
    insights: string[]
  }
  ```

## AI Features (Optional - can use OpenAI/Anthropic API)

### Sentiment Analysis
- The backend should analyze entry content and assign sentiment
- Can use keywords or AI API (GPT/Claude) for analysis
- Return sentiment as part of the entry object

### AI Suggestions
- `POST /api/ai/suggestions` - Get AI suggestions for entry
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ content: string }`
  - Returns: `{ suggestions: string[] }`

### AI Guidance Questions
- `GET /api/ai/questions` - Get contextual questions
  - Headers: `Authorization: Bearer <token>`
  - Query: `?content=<partial_entry_text>`
  - Returns: `{ questions: string[] }`

## Frontend State Management Structure

The frontend currently uses React useState. Here's what needs to be replaced with API calls:

```typescript
// In App.tsx - Current state that needs backend
const [currentUser, setCurrentUser] = useState<User | null>(null);
const [categories, setCategories] = useState<Category[]>([]);
const [entries, setEntries] = useState<Entry[]>([]);
const [isLoggedIn, setIsLoggedIn] = useState(false);

// These functions need to be replaced with API calls:
// 1. handleLogin() -> call /api/auth/login
// 2. handleSaveEntry() -> call /api/entries (POST)
// 3. handleAddCategory() -> call /api/categories (POST)
// 4. Initial data loading -> call /api/entries and /api/categories on mount
```

## Environment Variables Needed

```
VITE_API_BASE_URL=http://localhost:3000
# or your deployed backend URL
```

## Authentication Flow

1. User logs in/signs up
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. All subsequent requests include: `Authorization: Bearer <token>`
5. On app load, check for token and validate with `/api/auth/me`

## CORS Configuration

Backend needs to allow requests from frontend origin:
```javascript
// Example for Express.js
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
```

## Default Categories

When a new user signs up, create these default categories:
- Academic (color: #3B82F6)
- Social (color: #10B981)
- Family (color: #F59E0B)
- Random (color: #6366F1)
