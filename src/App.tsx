import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { ModeSelection } from './components/ModeSelection';
import { RandomEntryEditor } from './components/RandomEntryEditor';
import { CategorizedView } from './components/CategorizedView';
import { CategoryEditor } from './components/CategoryEditor';
import { WeeklySummary } from './components/WeeklySummary';
import { AllEntriesView } from './components/AllEntriesView';
import { NavigationBar } from './components/NavigationBar';
import { UserProfile } from './components/UserProfile';
import { authAPI, entriesAPI, categoriesAPI } from './services/api';

export interface Entry {
  id: string;
  content: string;
  category: string;
  date: Date;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({ name: '', email: '' });
  const [currentView, setCurrentView] = useState<'mode' | 'random' | 'categorized' | 'all-entries' | 'summary' | 'profile'>('mode');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authAPI.isAuthenticated()) {
          const user = await authAPI.getCurrentUser();
          setCurrentUser(user);
          setIsLoggedIn(true);
          await loadUserData();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        authAPI.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Load user categories and entries
  const loadUserData = async () => {
    try {
      const [categoriesData, entriesData] = await Promise.all([
        categoriesAPI.getAll(),
        entriesAPI.getAll(),
      ]);
      
      setCategories(categoriesData);
      setEntries(entriesData);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const handleLogin = async (name: string, email: string, password: string, isSignUp: boolean) => {
    try {
      const user = isSignUp 
        ? await authAPI.signup(name, email, password)
        : await authAPI.login(email, password);
      
      setCurrentUser(user);
      setIsLoggedIn(true);
      await loadUserData();
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Let LoginPage handle the error display
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    setIsLoggedIn(false);
    setCurrentUser({ name: '', email: '' });
    setCategories([]);
    setEntries([]);
    setCurrentView('mode');
  };

  const handleModeSelect = (mode: 'random' | 'categorized') => {
    if (mode === 'random') {
      setCurrentView('random');
    } else {
      setCurrentView('categorized');
    }
  };

  const handleSaveEntry = async (content: string, category: string) => {
    try {
      // Backend will handle sentiment analysis using AI
      const newEntry = await entriesAPI.create(content, category);
      setEntries([...entries, newEntry]);
    } catch (error) {
      console.error('Failed to save entry:', error);
      alert('Failed to save entry. Please try again.');
    }
  };

  const handleAddCategory = async (name: string, color: string) => {
    try {
      const newCategory = await categoriesAPI.create(name, color);
      setCategories([...categories, newCategory]);
    } catch (error) {
      console.error('Failed to add category:', error);
      alert('Failed to add category. Please try again.');
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleNavigation = (view: 'mode' | 'all-entries' | 'summary' | 'profile') => {
    setCurrentView(view);
    if (view === 'mode') {
      setSelectedCategory(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <NavigationBar onNavigate={handleNavigation} currentView={currentView} />
      
      <main className="pb-20">
        {currentView === 'mode' && (
          <ModeSelection onModeSelect={handleModeSelect} />
        )}
        
        {currentView === 'random' && (
          <RandomEntryEditor
            onSave={(content) => {
              handleSaveEntry(content, 'random');
              setCurrentView('mode');
            }}
            onCancel={() => setCurrentView('mode')}
          />
        )}
        
        {currentView === 'categorized' && !selectedCategory && (
          <CategorizedView
            categories={categories.filter(c => c.id !== 'random')}
            onCategorySelect={handleCategorySelect}
            onAddCategory={handleAddCategory}
          />
        )}
        
        {currentView === 'categorized' && selectedCategory && (
          <CategoryEditor
            category={categories.find(c => c.id === selectedCategory)!}
            entries={entries.filter(e => e.category === selectedCategory)}
            onSaveEntry={(content) => {
              handleSaveEntry(content, selectedCategory);
              setSelectedCategory(null);
            }}
            onBack={() => setSelectedCategory(null)}
          />
        )}
        
        {currentView === 'all-entries' && (
          <AllEntriesView entries={entries} categories={categories} />
        )}
        
        {currentView === 'summary' && (
          <WeeklySummary entries={entries} />
        )}
        
        {currentView === 'profile' && (
          <UserProfile user={currentUser} entriesCount={entries.length} onLogout={handleLogout} />
        )}
      </main>
    </div>
  );
}
