import { TrendingUp, Smile, Frown, Meh, Calendar, BookOpen } from 'lucide-react';
import { Card } from './ui/card';
import type { Entry } from '../App';

interface WeeklySummaryProps {
  entries: Entry[];
}

export function WeeklySummary({ entries }: WeeklySummaryProps) {
  // Get entries from the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const weeklyEntries = entries.filter(
    entry => new Date(entry.date) >= sevenDaysAgo
  );

  const totalEntries = weeklyEntries.length;
  const positiveEntries = weeklyEntries.filter(e => e.sentiment === 'positive').length;
  const negativeEntries = weeklyEntries.filter(e => e.sentiment === 'negative').length;
  const neutralEntries = weeklyEntries.filter(e => e.sentiment === 'neutral').length;

  const positivePercentage = totalEntries > 0 ? Math.round((positiveEntries / totalEntries) * 100) : 0;
  const negativePercentage = totalEntries > 0 ? Math.round((negativeEntries / totalEntries) * 100) : 0;
  const neutralPercentage = totalEntries > 0 ? Math.round((neutralEntries / totalEntries) * 100) : 0;

  const insights = [
    {
      condition: positivePercentage > 60,
      text: "You're having a great week! Your entries show predominantly positive emotions.",
      color: "text-green-600",
    },
    {
      condition: negativePercentage > 50,
      text: "This week seems challenging. Remember to practice self-care and reach out for support if needed.",
      color: "text-amber-600",
    },
    {
      condition: totalEntries === 0,
      text: "Start journaling to get personalized insights about your emotional well-being.",
      color: "text-neutral-600",
    },
    {
      condition: totalEntries > 0 && totalEntries < 3,
      text: "Try to journal more consistently to get better insights about your emotional patterns.",
      color: "text-blue-600",
    },
  ];

  const activeInsight = insights.find(i => i.condition);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto pt-6">
        <div className="mb-8">
          <h1 className="mb-2">Weekly Summary</h1>
          <p className="text-neutral-600">Your emotional patterns from the last 7 days</p>
        </div>

        <div className="grid gap-6 mb-8">
          {/* Overview Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="p-6 border-neutral-200">
              <div className="flex flex-col">
                <BookOpen className="w-6 h-6 text-neutral-600 mb-2" />
                <span className="text-3xl mb-1">{totalEntries}</span>
                <span className="text-sm text-neutral-600">Entries</span>
              </div>
            </Card>

            <Card className="p-6 border-neutral-200 bg-green-50">
              <div className="flex flex-col">
                <Smile className="w-6 h-6 text-green-600 mb-2" />
                <span className="text-3xl mb-1">{positivePercentage}%</span>
                <span className="text-sm text-neutral-600">Positive</span>
              </div>
            </Card>

            <Card className="p-6 border-neutral-200 bg-red-50">
              <div className="flex flex-col">
                <Frown className="w-6 h-6 text-red-600 mb-2" />
                <span className="text-3xl mb-1">{negativePercentage}%</span>
                <span className="text-sm text-neutral-600">Negative</span>
              </div>
            </Card>

            <Card className="p-6 border-neutral-200 bg-neutral-50">
              <div className="flex flex-col">
                <Meh className="w-6 h-6 text-neutral-600 mb-2" />
                <span className="text-3xl mb-1">{neutralPercentage}%</span>
                <span className="text-sm text-neutral-600">Neutral</span>
              </div>
            </Card>
          </div>

          {/* Sentiment Breakdown */}
          {totalEntries > 0 && (
            <Card className="p-6 border-neutral-200">
              <h3 className="mb-4 text-neutral-900">Emotional Breakdown</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-neutral-600">Positive</span>
                    <span className="text-sm text-neutral-900">{positivePercentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${positivePercentage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-neutral-600">Negative</span>
                    <span className="text-sm text-neutral-900">{negativePercentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 transition-all"
                      style={{ width: `${negativePercentage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-neutral-600">Neutral</span>
                    <span className="text-sm text-neutral-900">{neutralPercentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-neutral-400 transition-all"
                      style={{ width: `${neutralPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* AI Insights */}
          <Card className="p-6 border-neutral-200 bg-neutral-50">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-neutral-900 mt-0.5" />
              <div className="flex-1">
                <h3 className="mb-2 text-neutral-900">AI Insights</h3>
                {activeInsight && (
                  <p className={`text-sm ${activeInsight.color}`}>
                    {activeInsight.text}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Suggestions */}
          <Card className="p-6 border-neutral-200">
            <h3 className="mb-4 text-neutral-900">Suggestions for Growth</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-2" />
                <p className="text-sm text-neutral-700">
                  Try journaling at the same time each day to build a consistent habit
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-2" />
                <p className="text-sm text-neutral-700">
                  When writing about challenges, also note what you learned from them
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-2" />
                <p className="text-sm text-neutral-700">
                  Consider adding entries about gratitude to boost positive emotions
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-2" />
                <p className="text-sm text-neutral-700">
                  Review past entries monthly to identify patterns and track personal growth
                </p>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
