// UPDATED LoginPage.tsx WITH BACKEND INTEGRATION
// Replace your current LoginPage.tsx with this version once backend is ready

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import penImage from 'figma:asset/fe56ee1fb7372e08374978400f44651ed1ca56e1.png';

interface LoginPageProps {
  onLogin: (name: string, email: string, password: string, isSignUp: boolean) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isSignUp && (!name || !email || !password)) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!isSignUp && (!email || !password)) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await onLogin(name, email, password, isSignUp);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img src={penImage} alt="Pen" className="w-20 h-20 object-contain" />
          </div>
          <h1 className="mb-2">Reflective Journal</h1>
          <p className="text-neutral-600">Your AI-powered mindful companion</p>
        </div>

        <Card className="p-6 border-neutral-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="mb-1">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
              <p className="text-neutral-600 text-sm">
                {isSignUp ? 'Start your journaling journey' : 'Continue your journey'}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="border-neutral-300"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="border-neutral-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="border-neutral-300"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-neutral-900 hover:bg-neutral-800"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Login')}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                disabled={isLoading}
                className="text-sm text-neutral-600 hover:text-neutral-900 disabled:opacity-50"
              >
                {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
