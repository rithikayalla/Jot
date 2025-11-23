import { useState } from 'react';
import { ArrowLeft, Plus, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import type { Category, Entry } from '../App';

interface CategoryEditorProps {
  category: Category;
  entries: Entry[];
  onSaveEntry: (content: string) => void;
  onBack: () => void;
}

export function CategoryEditor({ category, entries, onSaveEntry, onBack }: CategoryEditorProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [newEntryContent, setNewEntryContent] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

  const handleSave = () => {
    if (newEntryContent.trim()) {
      onSaveEntry(newEntryContent);
      setNewEntryContent('');
      setShowEditor(false);
    }
  };

  // Group entries by month
  const entriesByMonth = entries.reduce((acc, entry) => {
    const monthYear = new Date(entry.date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(entry);
    return acc;
  }, {} as Record<string, Entry[]>);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto pt-6">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-neutral-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <h1>{category.name}</h1>
            </div>
          </div>

          <Button
            onClick={() => setShowEditor(true)}
            className="bg-neutral-900 hover:bg-neutral-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Entry
          </Button>
        </div>

        {Object.keys(entriesByMonth).length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-500 mb-4">No entries yet</p>
            <p className="text-sm text-neutral-400">Click "New Entry" to get started</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(entriesByMonth).map(([monthYear, monthEntries]) => (
              <div key={monthYear}>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-neutral-600" />
                  <h3 className="text-neutral-900">{monthYear}</h3>
                  <span className="text-sm text-neutral-500">({monthEntries.length})</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {monthEntries.map((entry) => (
                    <Card
                      key={entry.id}
                      onClick={() => setSelectedEntry(entry)}
                      className="p-4 cursor-pointer hover:shadow-md transition-all border-neutral-200 hover:border-neutral-400"
                    >
                      <div className="flex flex-col h-32">
                        <p className="text-xs text-neutral-500 mb-2">
                          {new Date(entry.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-sm text-neutral-700 line-clamp-4 flex-1">
                          {entry.content}
                        </p>
                        {entry.sentiment && (
                          <div className={`mt-2 w-2 h-2 rounded-full ${
                            entry.sentiment === 'positive' ? 'bg-green-500' :
                            entry.sentiment === 'negative' ? 'bg-red-500' :
                            'bg-gray-400'
                          }`} />
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Entry Dialog */}
        <Dialog open={showEditor} onOpenChange={setShowEditor}>
          <DialogContent className="bg-white max-w-3xl">
            <DialogHeader>
              <DialogTitle>New Entry - {category.name}</DialogTitle>
            </DialogHeader>
            
            <div className="pt-4">
              <textarea
                value={newEntryContent}
                onChange={(e) => setNewEntryContent(e.target.value)}
                placeholder="Start writing..."
                className="w-full h-64 resize-none focus:outline-none text-neutral-900 placeholder:text-neutral-400 p-4 border border-neutral-200 rounded-lg"
              />
              
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  onClick={() => setShowEditor(false)}
                  variant="ghost"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!newEntryContent.trim()}
                  className="bg-neutral-900 hover:bg-neutral-800"
                >
                  Save Entry
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Entry Dialog */}
        <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
          <DialogContent className="bg-white max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {selectedEntry && new Date(selectedEntry.date).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
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
