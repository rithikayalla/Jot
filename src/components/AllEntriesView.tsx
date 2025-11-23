import { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import type { Entry, Category } from '../App';

interface AllEntriesViewProps {
  entries: Entry[];
  categories: Category[];
}

export function AllEntriesView({ entries, categories }: AllEntriesViewProps) {
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const filteredEntries = filterCategory 
    ? entries.filter(e => e.category === filterCategory)
    : entries;

  const sortedEntries = [...filteredEntries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getCategoryColor = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.color || '#6366F1';
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown';
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto pt-6">
        <div className="mb-8">
          <h1 className="mb-2">All Entries</h1>
          <p className="text-neutral-600">Your complete journal history</p>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          <Button
            onClick={() => setFilterCategory(null)}
            variant={filterCategory === null ? "default" : "outline"}
            className={filterCategory === null ? "bg-neutral-900" : ""}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setFilterCategory(category.id)}
              variant={filterCategory === category.id ? "default" : "outline"}
              className={filterCategory === category.id ? "bg-neutral-900" : ""}
            >
              <div
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: category.color }}
              />
              {category.name}
            </Button>
          ))}
        </div>

        {sortedEntries.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-500 mb-2">No entries yet</p>
            <p className="text-sm text-neutral-400">Start journaling to see your entries here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedEntries.map((entry) => (
              <Card
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className="p-6 cursor-pointer hover:shadow-md transition-all border-neutral-200 hover:border-neutral-400"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getCategoryColor(entry.category) }}
                    />
                    <span className="text-sm text-neutral-600">
                      {getCategoryName(entry.category)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <Calendar className="w-4 h-4" />
                    {new Date(entry.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                
                <p className="text-neutral-900 line-clamp-3">
                  {entry.content}
                </p>

                {entry.sentiment && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      entry.sentiment === 'positive' ? 'bg-green-500' :
                      entry.sentiment === 'negative' ? 'bg-red-500' :
                      'bg-gray-400'
                    }`} />
                    <span className="text-xs text-neutral-500 capitalize">
                      {entry.sentiment} tone
                    </span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
          <DialogContent className="bg-white max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {selectedEntry && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getCategoryColor(selectedEntry.category) }}
                      />
                      <span className="text-sm text-neutral-600">
                        {getCategoryName(selectedEntry.category)}
                      </span>
                    </div>
                    <div>
                      {new Date(selectedEntry.date).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                )}
              </DialogTitle>
            </DialogHeader>
            
            <div className="pt-4">
              <div className="p-4 bg-neutral-50 rounded-lg max-h-96 overflow-y-auto">
                <p className="text-neutral-900 whitespace-pre-wrap">
                  {selectedEntry?.content}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
