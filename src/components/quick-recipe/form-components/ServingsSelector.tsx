
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { Input } from '@/components/ui/input';

const SERVING_OPTIONS = [1, 2, 4];

interface ServingsSelectorProps {
  selectedServings: number;
  onServingsChange: (servings: number) => void;
}

export function ServingsSelector({ selectedServings, onServingsChange }: ServingsSelectorProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState<string>(""); 

  const handleBadgeClick = (value: number | string) => {
    if (value === "other") {
      setShowCustomInput(true);
      return;
    }
    
    onServingsChange(value as number);
    setShowCustomInput(false);
    setCustomValue("");
  };

  const handleCustomValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomValue(value);
    
    const numValue = parseInt(value);
    if (numValue > 0) {
      onServingsChange(numValue);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <Users className="h-5 w-5 text-purple-600" />
        <label className="text-base font-medium text-purple-600">How many servings?</label>
      </div>
      <div className="flex flex-wrap gap-3">
        {SERVING_OPTIONS.map(option => (
          <Badge 
            key={option} 
            variant="outline" 
            className={`cursor-pointer hover:bg-accent py-1.5 px-4 text-sm ${
              selectedServings === option && !showCustomInput ? 'bg-purple-600 text-white hover:bg-purple-700' : ''
            }`}
            onClick={() => handleBadgeClick(option)}
          >
            {option}
          </Badge>
        ))}
        <Badge 
          variant="outline" 
          className={`cursor-pointer hover:bg-accent py-1.5 px-4 text-sm ${
            showCustomInput ? 'bg-purple-600 text-white hover:bg-purple-700' : ''
          }`}
          onClick={() => handleBadgeClick("other")}
        >
          Other
        </Badge>
      </div>
      
      {showCustomInput && (
        <div className="mt-2">
          <Input
            type="number"
            min="1"
            placeholder="Enter servings..."
            value={customValue}
            onChange={handleCustomValueChange}
            className="w-32"
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
