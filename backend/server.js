import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// In-memory database (replace with real database in production)
const users = [];
const entries = [];
const categories = [];

// Initialize OpenAI client if API key is provided
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log('OpenAI initialized');
}

// Helper: Authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Helper: Keyword-based sentiment analysis (fallback)
const analyzeSentimentKeyword = (content) => {
  const positiveWords = ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'love', 'beautiful', 'grateful', 'blessed', 'good', 'fantastic', 'excellent', 'pleased', 'delighted'];
  const negativeWords = ['sad', 'angry', 'frustrated', 'terrible', 'awful', 'hate', 'disappointed', 'stressed', 'worried', 'upset', 'bad', 'horrible', 'awful', 'depressed', 'anxious'];
  
  const lowerContent = content.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerContent.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerContent.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};

// Helper: AI-based sentiment analysis
const analyzeSentimentAI = async (content) => {
  if (!openai) {
    return analyzeSentimentKeyword(content);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Analyze the sentiment of this journal entry. Respond with only one word: 'positive', 'negative', or 'neutral'. Do not include any other text."
        },
        {
          role: "user",
          content: content.substring(0, 1000) // Limit content length
        }
      ],
      temperature: 0.3,
      max_tokens: 10
    });

    const result = response.choices[0].message.content.trim().toLowerCase();
    if (result.includes('positive')) return 'positive';
    if (result.includes('negative')) return 'negative';
    return 'neutral';
  } catch (error) {
    console.error('AI sentiment analysis failed:', error.message);
    return analyzeSentimentKeyword(content);
  }
};

// Helper: Get AI suggestions
const getAISuggestions = async (content) => {
  if (!openai) {
    return [
      "Consider journaling about what you're grateful for today.",
      "Remember to take breaks and practice self-compassion.",
      "Set a small achievable goal for tomorrow based on today's reflections."
    ];
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a thoughtful journaling assistant. Provide 3 short, personalized insights or suggestions (one sentence each) based on this journal entry. Return them as a JSON array of strings. Do not include any other text."
        },
        {
          role: "user",
          content: content.substring(0, 1000)
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    const result = response.choices[0].message.content.trim();
    // Try to parse as JSON array
    try {
      const suggestions = JSON.parse(result);
      if (Array.isArray(suggestions) && suggestions.length > 0) {
        return suggestions;
      }
    } catch (e) {
      // If not JSON, split by newlines or commas
      const lines = result.split('\n').filter(line => line.trim());
      if (lines.length > 0) {
        return lines.slice(0, 3);
      }
    }
    
    return [result.substring(0, 150)];
  } catch (error) {
    console.error('AI suggestions failed:', error.message);
    return [
      "Consider journaling about what you're grateful for today.",
      "Remember to take breaks and practice self-compassion.",
      "Set a small achievable goal for tomorrow based on today's reflections."
    ];
  }
};

// Helper: Get AI guidance questions
const getAIGuidanceQuestions = async (content) => {
  if (!openai) {
    return [
      "What triggered this feeling?",
      "How did this make you feel?",
      "What could you learn from this?",
      "Is there a pattern you notice?",
      "What would you do differently?"
    ];
  }

  try {
    const systemPrompt = content 
      ? "You are a journaling guide. Provide 5 thoughtful, specific questions to help someone reflect deeper on their journal entry. Return them as a JSON array of strings. Do not include any other text."
      : "You are a journaling guide. Provide 5 general, thoughtful questions to help someone get started with journaling. Return them as a JSON array of strings. Do not include any other text.";

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: content || "Help me get started with journaling"
        }
      ],
      temperature: 0.8,
      max_tokens: 200
    });

    const result = response.choices[0].message.content.trim();
    try {
      const questions = JSON.parse(result);
      if (Array.isArray(questions) && questions.length > 0) {
        return questions.slice(0, 5);
      }
    } catch (e) {
      // If not JSON, split by newlines
      const lines = result.split('\n').filter(line => line.trim() && line.match(/[?]/));
      if (lines.length > 0) {
        return lines.slice(0, 5);
      }
    }
    
    return [
      "What triggered this feeling?",
      "How did this make you feel?",
      "What could you learn from this?",
      "Is there a pattern you notice?",
      "What would you do differently?"
    ];
  } catch (error) {
    console.error('AI questions failed:', error.message);
    return [
      "What triggered this feeling?",
      "How did this make you feel?",
      "What could you learn from this?",
      "Is there a pattern you notice?",
      "What would you do differently?"
    ];
  }
};

// Helper: Create default categories for new user
const createDefaultCategories = (userId) => {
  const defaults = [
    { name: 'Academic', color: '#3B82F6' },
    { name: 'Social', color: '#10B981' },
    { name: 'Family', color: '#F59E0B' },
    { name: 'Random', color: '#6366F1' }
  ];

  return defaults.map(cat => {
    const category = {
      id: randomUUID(),
      userId,
      name: cat.name,
      color: cat.color,
      createdAt: new Date().toISOString()
    };
    categories.push(category);
    return category;
  });
};

// ========== AUTHENTICATION ENDPOINTS ==========

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: randomUUID(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    users.push(user);

    // Create default categories
    createDefaultCategories(user.id);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    }
  });
});

// ========== ENTRIES ENDPOINTS ==========

// Get all entries
app.get('/api/entries', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    let userEntries = entries.filter(e => e.userId === userId);

    // Apply filters
    if (req.query.category) {
      userEntries = userEntries.filter(e => e.category === req.query.category);
    }
    if (req.query.startDate) {
      userEntries = userEntries.filter(e => new Date(e.date) >= new Date(req.query.startDate));
    }
    if (req.query.endDate) {
      userEntries = userEntries.filter(e => new Date(e.date) <= new Date(req.query.endDate));
    }

    // Sort by date (newest first)
    userEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ entries: userEntries });
  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get specific entry
app.get('/api/entries/:id', authenticateToken, (req, res) => {
  const entry = entries.find(e => e.id === req.params.id && e.userId === req.user.userId);
  if (!entry) {
    return res.status(404).json({ message: 'Entry not found' });
  }
  res.json({ entry });
});

// Create entry
app.post('/api/entries', authenticateToken, async (req, res) => {
  try {
    const { content, category } = req.body;
    const userId = req.user.userId;

    if (!content || !category) {
      return res.status(400).json({ message: 'Content and category are required' });
    }

    // Analyze sentiment (with AI if available, otherwise keyword-based)
    const sentiment = await analyzeSentimentAI(content);

    const entry = {
      id: randomUUID(),
      userId,
      content,
      category,
      date: new Date().toISOString(),
      sentiment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    entries.push(entry);
    res.status(201).json({ entry });
  } catch (error) {
    console.error('Create entry error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update entry
app.put('/api/entries/:id', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    const entry = entries.find(e => e.id === req.params.id && e.userId === req.user.userId);

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    // Re-analyze sentiment
    entry.content = content;
    entry.sentiment = await analyzeSentimentAI(content);
    entry.updatedAt = new Date().toISOString();

    res.json({ entry });
  } catch (error) {
    console.error('Update entry error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete entry
app.delete('/api/entries/:id', authenticateToken, (req, res) => {
  const index = entries.findIndex(e => e.id === req.params.id && e.userId === req.user.userId);
  if (index === -1) {
    return res.status(404).json({ message: 'Entry not found' });
  }

  entries.splice(index, 1);
  res.json({ success: true });
});

// ========== CATEGORIES ENDPOINTS ==========

// Get all categories
app.get('/api/categories', authenticateToken, (req, res) => {
  const userCategories = categories.filter(c => c.userId === req.user.userId);
  res.json({ categories: userCategories });
});

// Create category
app.post('/api/categories', authenticateToken, (req, res) => {
  try {
    const { name, color } = req.body;
    const userId = req.user.userId;

    if (!name || !color) {
      return res.status(400).json({ message: 'Name and color are required' });
    }

    const category = {
      id: randomUUID(),
      userId,
      name,
      color,
      createdAt: new Date().toISOString()
    };

    categories.push(category);
    res.status(201).json({ category });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update category
app.put('/api/categories/:id', authenticateToken, (req, res) => {
  try {
    const { name, color } = req.body;
    const category = categories.find(c => c.id === req.params.id && c.userId === req.user.userId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name !== undefined) category.name = name;
    if (color !== undefined) category.color = color;

    res.json({ category });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete category
app.delete('/api/categories/:id', authenticateToken, (req, res) => {
  const index = categories.findIndex(c => c.id === req.params.id && c.userId === req.user.userId);
  if (index === -1) {
    return res.status(404).json({ message: 'Category not found' });
  }

  categories.splice(index, 1);
  res.json({ success: true });
});

// ========== ANALYTICS ENDPOINTS ==========

// Get weekly summary
app.get('/api/analytics/weekly', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyEntries = entries.filter(e => {
      const entryDate = new Date(e.date);
      return e.userId === userId && entryDate >= sevenDaysAgo;
    });

    const totalEntries = weeklyEntries.length;
    const positiveEntries = weeklyEntries.filter(e => e.sentiment === 'positive').length;
    const negativeEntries = weeklyEntries.filter(e => e.sentiment === 'negative').length;
    const neutralEntries = weeklyEntries.filter(e => e.sentiment === 'neutral').length;

    const positivePercentage = totalEntries > 0 ? Math.round((positiveEntries / totalEntries) * 100) : 0;
    const negativePercentage = totalEntries > 0 ? Math.round((negativeEntries / totalEntries) * 100) : 0;
    const neutralPercentage = totalEntries > 0 ? Math.round((neutralEntries / totalEntries) * 100) : 0;

    // Group entries by day
    const entriesByDay = {};
    weeklyEntries.forEach(entry => {
      const date = new Date(entry.date).toISOString().split('T')[0];
      entriesByDay[date] = (entriesByDay[date] || 0) + 1;
    });

    const entriesByDayArray = Object.entries(entriesByDay).map(([date, count]) => ({
      date,
      count
    }));

    // Generate insights
    const insights = [];
    if (positivePercentage > 60) {
      insights.push("You're having a great week! Your entries show predominantly positive emotions.");
    }
    if (negativePercentage > 50) {
      insights.push("This week seems challenging. Remember to practice self-care and reach out for support if needed.");
    }
    if (totalEntries === 0) {
      insights.push("Start journaling to get personalized insights about your emotional well-being.");
    }
    if (totalEntries > 0 && totalEntries < 3) {
      insights.push("Try to journal more consistently to get better insights about your emotional patterns.");
    }

    res.json({
      totalEntries,
      positivePercentage,
      negativePercentage,
      neutralPercentage,
      entriesByDay: entriesByDayArray,
      insights
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ========== AI ENDPOINTS ==========

// Get AI suggestions
app.post('/api/ai/suggestions', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const suggestions = await getAISuggestions(content);
    res.json({ suggestions });
  } catch (error) {
    console.error('AI suggestions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get AI guidance questions
app.get('/api/ai/questions', authenticateToken, async (req, res) => {
  try {
    const content = req.query.content || '';
    const questions = await getAIGuidanceQuestions(content);
    res.json({ questions });
  } catch (error) {
    console.error('AI questions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    aiEnabled: !!openai,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api`);
  console.log(`🤖 AI Features: ${openai ? 'Enabled (OpenAI)' : 'Disabled (Keyword-based fallback)'}`);
});

