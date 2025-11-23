import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Sparkles, Lightbulb, Heart, Target, Loader2 } from 'lucide-react';
import { aiAPI } from '../services/api';

interface AIAssistantProps {
  isWriting: boolean;
  content: string;
  onFinish?: () => void;
  showSuggestions: boolean;
}

// Fallback data in case API fails
const defaultGuidingQuestions = [
  "What triggered this feeling?",
  "How did this make you feel?",
  "What could you learn from this?",
  "Is there a pattern you notice?",
  "What would you do differently?",
];

const defaultSuggestions = [
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

const iconMap: Record<string, typeof Lightbulb> = {
  'lightbulb': Lightbulb,
  'heart': Heart,
  'target': Target,
};

export function AIAssistant({ isWriting, content, onFinish, showSuggestions }: AIAssistantProps) {
  const [guidanceQuestions, setGuidanceQuestions] = useState<string[]>(defaultGuidingQuestions);
  const [suggestions, setSuggestions] = useState<Array<{ icon: typeof Lightbulb; title: string; text: string }>>(defaultSuggestions);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [questionsError, setQuestionsError] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState(false);

  // Fetch guidance questions when content changes (debounced)
  useEffect(() => {
    if (showSuggestions) return; // Don't fetch questions when showing suggestions

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    
    const fetchQuestions = async () => {
      // Only show loading if there's content (to avoid showing loading on initial mount)
      if (content.length > 0) {
        setIsLoadingQuestions(true);
      }
      setQuestionsError(false);
      
      try {
        const questions = await aiAPI.getGuidanceQuestions(content || undefined);
        if (questions && Array.isArray(questions) && questions.length > 0) {
          setGuidanceQuestions(questions);
        }
      } catch (error) {
        console.error('Failed to fetch guidance questions:', error);
        setQuestionsError(true);
        // Keep default questions on error
      } finally {
        if (content.length > 0) {
          setIsLoadingQuestions(false);
        }
      }
    };

    // Debounce API calls - wait 500ms after user stops typing
    // Only fetch if content is not empty (to avoid unnecessary initial call)
    if (content.length > 0) {
      timeoutId = setTimeout(() => {
        fetchQuestions();
      }, 500);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [content, showSuggestions]);

  // Fetch suggestions when showSuggestions becomes true
  useEffect(() => {
    if (!showSuggestions || !content.trim()) return;

    const fetchSuggestions = async () => {
      setIsLoadingSuggestions(true);
      setSuggestionsError(false);

      try {
        const apiSuggestions = await aiAPI.getSuggestions(content);
        if (apiSuggestions && Array.isArray(apiSuggestions) && apiSuggestions.length > 0) {
          // Transform API suggestions to match component format
          const formattedSuggestions = apiSuggestions.map((suggestion: string, index: number) => {
            // Try to parse if it's an object, otherwise treat as string
            if (typeof suggestion === 'object' && suggestion !== null) {
              const obj = suggestion as any;
              const iconName = obj.icon?.toLowerCase() || 'lightbulb';
              return {
                icon: iconMap[iconName] || Lightbulb,
                title: obj.title || 'Insight',
                text: obj.text || obj.suggestion || String(suggestion),
              };
            }
            
            // If it's just a string, map to one of our icons
            const iconKeys = Object.keys(iconMap);
            const iconName = iconKeys[index % iconKeys.length];
            return {
              icon: iconMap[iconName],
              title: 'Insight',
              text: String(suggestion),
            };
          });
          setSuggestions(formattedSuggestions);
        }
      } catch (error) {
        console.error('Failed to fetch AI suggestions:', error);
        setSuggestionsError(true);
        // Keep default suggestions on error
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [showSuggestions, content]);

  if (showSuggestions) {
    return (
      <Card className="p-6 border-neutral-200 sticky top-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-neutral-900" />
          <h3 className="text-neutral-900">AI Insights</h3>
        </div>

        <div className="space-y-4">
          {isLoadingSuggestions ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-neutral-400 animate-spin" />
              <span className="ml-2 text-sm text-neutral-600">Generating insights...</span>
            </div>
          ) : (
            <>
              <div className="p-3 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-700 mb-2">
                  {suggestionsError 
                    ? "Using default insights. AI suggestions unavailable." 
                    : "Great work on your entry! Here are some insights:"}
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
            </>
          )}

          <Button 
            onClick={onFinish}
            disabled={isLoadingSuggestions}
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

        {isLoadingQuestions && content.length > 0 ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-4 h-4 text-neutral-400 animate-spin" />
            <span className="ml-2 text-xs text-neutral-500">Loading personalized questions...</span>
          </div>
        ) : (
          <div className="space-y-2">
            {guidanceQuestions.map((question, index) => (
              <div
                key={index}
                className="p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <p className="text-sm text-neutral-700">{question}</p>
              </div>
            ))}
            {questionsError && (
              <p className="text-xs text-neutral-500 italic">
                Using default questions. AI guidance unavailable.
              </p>
            )}
          </div>
        )}

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
