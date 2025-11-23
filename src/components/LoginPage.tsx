import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import penImage from 'figma:asset/fe56ee1fb7372e08374978400f44651ed1ca56e1.png';

interface LoginPageProps {
  onLogin: (name: string, email: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp && name && email && password) {
      onLogin(name, email);
    } else if (!isSignUp && email && password) {
      onLogin(email.split('@')[0], email);
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
                className="border-neutral-300"
              />
            </div>

            <Button type="submit" className="w-full bg-neutral-900 hover:bg-neutral-800">
              {isSignUp ? 'Create Account' : 'Login'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-neutral-600 hover:text-neutral-900"
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
