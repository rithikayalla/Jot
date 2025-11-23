import { Sparkles, FolderOpen } from 'lucide-react';
import { Card } from './ui/card';
import penImage from 'figma:asset/fe56ee1fb7372e08374978400f44651ed1ca56e1.png';

interface ModeSelectionProps {
  onModeSelect: (mode: 'random' | 'categorized') => void;
}

export function ModeSelection({ onModeSelect }: ModeSelectionProps) {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto pt-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <img src={penImage} alt="Pen" className="w-16 h-16 object-contain opacity-80" />
          </div>
          <h1 className="mb-2">What's on your mind?</h1>
          <p className="text-neutral-600">Choose how you'd like to journal today</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Card
            onClick={() => onModeSelect('random')}
            className="p-8 cursor-pointer border-2 border-neutral-200 hover:border-neutral-900 transition-all hover:shadow-lg group"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-100 group-hover:bg-neutral-900 flex items-center justify-center transition-colors">
                <Sparkles className="w-8 h-8 text-neutral-900 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h2 className="mb-2">Random Entry</h2>
                <p className="text-neutral-600">
                  Free-form writing with AI guidance. Let your thoughts flow naturally.
                </p>
              </div>
            </div>
          </Card>

          <Card
            onClick={() => onModeSelect('categorized')}
            className="p-8 cursor-pointer border-2 border-neutral-200 hover:border-neutral-900 transition-all hover:shadow-lg group"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-100 group-hover:bg-neutral-900 flex items-center justify-center transition-colors">
                <FolderOpen className="w-8 h-8 text-neutral-900 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h2 className="mb-2">Categorized Entry</h2>
                <p className="text-neutral-600">
                  Organize your thoughts by category. Keep everything structured and easy to find.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
