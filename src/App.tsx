import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { ModeSelection } from './components/ModeSelection';
import { RandomEntryEditor } from './components/RandomEntryEditor';
import { CategorizedView } from './components/CategorizedView';
import { CategoryEditor } from './components/CategoryEditor';
import { WeeklySummary } from './components/WeeklySummary';
import { AllEntriesView } from './components/AllEntriesView';
import { NavigationBar } from './components/NavigationBar';
import { UserProfile } from './components/UserProfile';

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
  const [currentUser, setCurrentUser] = useState({ name: '', email: '' });
  const [currentView, setCurrentView] = useState<'mode' | 'random' | 'categorized' | 'all-entries' | 'summary' | 'profile'>('mode');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Academic', color: '#3B82F6' },
    { id: '2', name: 'Social', color: '#10B981' },
    { id: '3', name: 'Family', color: '#F59E0B' },
    { id: 'random', name: 'Random', color: '#6366F1' },
  ]);

  const [entries, setEntries] = useState<Entry[]>([]);

  const handleLogin = (name: string, email: string) => {
    setCurrentUser({ name, email });
    setIsLoggedIn(true);
  };

  const handleModeSelect = (mode: 'random' | 'categorized') => {
    if (mode === 'random') {
      setCurrentView('random');
    } else {
      setCurrentView('categorized');
    }
  };

  const handleSaveEntry = (content: string, category: string) => {
    const sentiment = analyzeSentiment(content);
    const newEntry: Entry = {
      id: Date.now().toString(),
      content,
      category,
      date: new Date(),
      sentiment,
    };
    setEntries([...entries, newEntry]);
  };

  const analyzeSentiment = (content: string): 'positive' | 'negative' | 'neutral' => {
    const positiveWords = ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'love', 'beautiful', 'grateful', 'blessed'];
    const negativeWords = ['sad', 'angry', 'frustrated', 'terrible', 'awful', 'hate', 'disappointed', 'stressed', 'worried', 'upset'];
    
    const lowerContent = content.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerContent.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerContent.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  const handleAddCategory = (name: string, color: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      color,
    };
    setCategories([...categories, newCategory]);
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
          <UserProfile user={currentUser} entriesCount={entries.length} />
        )}
      </main>
    </div>
  );
}
