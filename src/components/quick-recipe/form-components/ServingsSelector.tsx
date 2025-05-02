import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Servings options (removed 6 as requested)
export const SERVINGS_OPTIONS = [1, 2, 4, 8];

interface ServingsSelectorProps {
  selectedServings: number;
  onServingsSelect: (servings: number) => void;
}

export function ServingsSelector({ selectedServings, onServingsSelect }: ServingsSelectorProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customServings, setCustomServings] = useState('');

  const handleCustomServingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numeric input
    if (/^\d*$/.test(value)) {
      setCustomServings(value);
      
      // If there's a valid number, update the selected servings
      if (value && parseInt(value) > 0) {
        onServingsSelect(parseInt(value));
      }
    }
  };

  const handleCustomServingsSelect = () => {
    setShowCustomInput(true);
    // If there's no previous custom value, don't change the selection yet
    if (!customServings) return;
    
    const servings = parseInt(customServings);
    if (servings > 0) {
      onServingsSelect(servings);
    }
  };

  // Reset custom input when selecting a predefined option
  const handlePredefinedSelect = (servings: number) => {
    setShowCustomInput(false);
    onServingsSelect(servings);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-purple-600" />
        <label className="text-base font-medium text-purple-600">How many servings?</label>
      </div>
      <div className="flex flex-wrap gap-2">
        {SERVINGS_OPTIONS.map(servingOption => (
          <Badge 
            key={servingOption}
            variant="outline"
            className={`cursor-pointer px-3 py-1.5 text-sm ${
              selectedServings === servingOption && !showCustomInput
                ? 'bg-purple-600 text-white hover:bg-purple-700' 
                : 'hover:bg-accent'
            }`}
            onClick={() => handlePredefinedSelect(servingOption)}
          >
            {servingOption} {servingOption === 1 ? 'person' : 'people'}
          </Badge>
        ))}
        
        {/* Other (custom) option */}
        <Badge 
          variant="outline"
          className={`cursor-pointer px-3 py-1.5 text-sm ${
            showCustomInput ? 'bg-purple-600 text-white hover:bg-purple-700' : 'hover:bg-accent'
          }`}
          onClick={handleCustomServingsSelect}
        >
          Other
        </Badge>
      </div>

      {/* Custom servings input */}
      {showCustomInput && (
        <div className="mt-2">
          <Input
            type="text"
            value={customServings}
            onChange={handleCustomServingsChange}
            placeholder="Enter number of servings"
            className="w-full max-w-[200px] border-purple-300 focus:border-purple-500"
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
