import { Home, BookOpen, User, BarChart3 } from 'lucide-react';

interface NavigationBarProps {
  onNavigate: (view: 'mode' | 'all-entries' | 'summary' | 'profile') => void;
  currentView: string;
}

export function NavigationBar({ onNavigate, currentView }: NavigationBarProps) {
  const navItems = [
    { id: 'mode', icon: Home, label: 'Home' },
    { id: 'all-entries', icon: BookOpen, label: 'Entries' },
    { id: 'summary', icon: BarChart3, label: 'Summary' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as any)}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors ${
                  isActive ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
