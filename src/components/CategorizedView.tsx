import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import type { Category } from '../App';

interface CategorizedViewProps {
  categories: Category[];
  onCategorySelect: (categoryId: string) => void;
  onAddCategory: (name: string, color: string) => void;
}

const colorOptions = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
];

export function CategorizedView({ categories, onCategorySelect, onAddCategory }: CategorizedViewProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName, selectedColor);
      setNewCategoryName('');
      setSelectedColor(colorOptions[0]);
      setShowAddDialog(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto pt-6">
        <div className="mb-8">
          <h1 className="mb-2">Categories</h1>
          <p className="text-neutral-600">Organize your thoughts by category</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Card
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className="flex-shrink-0 px-6 py-3 cursor-pointer border-2 hover:border-neutral-900 transition-all hover:shadow-md"
                style={{ borderColor: 'transparent' }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-neutral-900 whitespace-nowrap">{category.name}</span>
                </div>
              </Card>
            ))}
            
            <Button
              onClick={() => setShowAddDialog(true)}
              variant="outline"
              className="flex-shrink-0 border-2 border-dashed border-neutral-300 hover:border-neutral-900"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>

        <div className="text-center py-20">
          <p className="text-neutral-500 mb-4">Select a category to view your entries</p>
          <p className="text-sm text-neutral-400">or add a new category to get started</p>
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  placeholder="e.g., Work, Health, Hobbies"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="border-neutral-300"
                />
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full transition-all ${
                        selectedColor === color ? 'ring-2 ring-offset-2 ring-neutral-900' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <Button
                onClick={handleAddCategory}
                className="w-full bg-neutral-900 hover:bg-neutral-800"
              >
                Add Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
