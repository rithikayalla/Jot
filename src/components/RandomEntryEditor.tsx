import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Sparkles, Check } from 'lucide-react';
import { AIAssistant } from './AIAssistant';

interface RandomEntryEditorProps {
  onSave: (content: string) => void;
  onCancel: () => void;
}

export function RandomEntryEditor({ onSave, onCancel }: RandomEntryEditorProps) {
  const [content, setContent] = useState('');
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const handleDone = () => {
    if (content.trim()) {
      setShowAISuggestions(true);
    }
  };

  const handleFinish = () => {
    onSave(content);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto pt-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="mb-1">Random Entry</h1>
            <p className="text-neutral-600 text-sm">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <Button 
            onClick={onCancel} 
            variant="ghost"
            className="text-neutral-600"
          >
            Cancel
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6 border-neutral-200 min-h-[500px]">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing... What's on your mind today?"
                className="w-full h-full min-h-[450px] resize-none focus:outline-none text-neutral-900 placeholder:text-neutral-400"
              />
            </Card>

            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleDone}
                disabled={!content.trim()}
                className="bg-neutral-900 hover:bg-neutral-800"
              >
                <Check className="w-4 h-4 mr-2" />
                Done
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <AIAssistant 
              isWriting={!showAISuggestions} 
              content={content}
              onFinish={handleFinish}
              showSuggestions={showAISuggestions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
