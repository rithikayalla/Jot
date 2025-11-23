// UPDATED UserProfile.tsx WITH BACKEND INTEGRATION
// Replace your current UserProfile.tsx with this version once backend is ready

import { User, Mail, BookOpen, Calendar, LogOut } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import journalImage from 'figma:asset/029df8237b103edde71ff7d4422cc148a9cd768e.png';

interface UserProfileProps {
  user: {
    name: string;
    email: string;
  };
  entriesCount: number;
  onLogout: () => void;
}

export function UserProfile({ user, entriesCount, onLogout }: UserProfileProps) {
  const joinDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto pt-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2">Profile</h1>
            <p className="text-neutral-600">Your journaling journey</p>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-neutral-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="space-y-6">
          {/* Profile Header */}
          <Card className="p-8 border-neutral-200">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center">
                <User className="w-12 h-12 text-neutral-600" />
              </div>
              <div className="flex-1">
                <h2 className="mb-1">{user.name}</h2>
                <div className="flex items-center gap-2 text-neutral-600 mb-4">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Joined {joinDate}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-6 border-neutral-200">
              <div className="flex flex-col items-center text-center">
                <BookOpen className="w-8 h-8 text-neutral-600 mb-3" />
                <span className="text-3xl mb-1">{entriesCount}</span>
                <span className="text-sm text-neutral-600">Total Entries</span>
              </div>
            </Card>

            <Card className="p-6 border-neutral-200">
              <div className="flex flex-col items-center text-center">
                <Calendar className="w-8 h-8 text-neutral-600 mb-3" />
                <span className="text-3xl mb-1">7</span>
                <span className="text-sm text-neutral-600">Day Streak</span>
              </div>
            </Card>

            <Card className="p-6 border-neutral-200">
              <div className="flex flex-col items-center text-center">
                <User className="w-8 h-8 text-neutral-600 mb-3" />
                <span className="text-3xl mb-1">1</span>
                <span className="text-sm text-neutral-600">Month Active</span>
              </div>
            </Card>
          </div>

          {/* Inspiration Image */}
          <Card className="overflow-hidden border-neutral-200">
            <img 
              src={journalImage} 
              alt="Journal inspiration" 
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="mb-2 text-neutral-900">Keep Going!</h3>
              <p className="text-sm text-neutral-600">
                "The life of every man is a diary in which he means to write one story, and writes another." - J.M. Barrie
              </p>
            </div>
          </Card>

          {/* About */}
          <Card className="p-6 border-neutral-200">
            <h3 className="mb-4 text-neutral-900">About Reflective Journal</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Reflective Journal is your AI-powered companion for mindful journaling. 
              We help you organize your thoughts, track your emotional well-being, and 
              gain insights into your personal growth journey. Whether you prefer free-form 
              writing or organized categories, we're here to support your reflection practice.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
