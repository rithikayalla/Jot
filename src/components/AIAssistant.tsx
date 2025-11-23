import { Card } from './ui/card';
import { Button } from './ui/button';
import { Sparkles, Lightbulb, Heart, Target } from 'lucide-react';

interface AIAssistantProps {
  isWriting: boolean;
  content: string;
  onFinish?: () => void;
  showSuggestions: boolean;
}

const guidingQuestions = [
  "What triggered this feeling?",
  "How did this make you feel?",
  "What could you learn from this?",
  "Is there a pattern you notice?",
  "What would you do differently?",
];

const suggestions = [
  {
    icon: Lightbulb,
    title: "Reflection Prompt",
    text: "Consider journaling about what you're grateful for today.",
  },
  {
    icon: Heart,
    title: "Self-Care Reminder",
    text: "Remember to take breaks and practice self-compassion.",
  },
  {
    icon: Target,
    title: "Goal Setting",
    text: "Set a small achievable goal for tomorrow based on today's reflections.",
  },
];

export function AIAssistant({ isWriting, content, onFinish, showSuggestions }: AIAssistantProps) {
  if (showSuggestions) {
    return (
      <Card className="p-6 border-neutral-200 sticky top-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-neutral-900" />
          <h3 className="text-neutral-900">AI Insights</h3>
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-neutral-50 rounded-lg">
            <p className="text-sm text-neutral-700 mb-2">
              Great work on your entry! Here are some insights:
            </p>
          </div>

          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <div key={index} className="p-3 bg-white border border-neutral-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-neutral-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-900 mb-1">{suggestion.title}</p>
                    <p className="text-xs text-neutral-600">{suggestion.text}</p>
                  </div>
                </div>
              </div>
            );
          })}

          <Button 
            onClick={onFinish}
            className="w-full bg-neutral-900 hover:bg-neutral-800"
          >
            Save Entry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-neutral-200 sticky top-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-neutral-900" />
        <h3 className="text-neutral-900">AI Guidance</h3>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-neutral-600">
          Need help getting started? Here are some prompts to guide your writing:
        </p>

        <div className="space-y-2">
          {guidingQuestions.map((question, index) => (
            <div
              key={index}
              className="p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <p className="text-sm text-neutral-700">{question}</p>
            </div>
          ))}
        </div>

        {content.length > 0 && (
          <div className="pt-4 border-t border-neutral-200">
            <p className="text-xs text-neutral-500">
              Word count: {content.split(/\s+/).filter(w => w.length > 0).length}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
