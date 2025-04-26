
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const popularFlavorTags = [
  "Sweet", "Savory", "Spicy", "Tangy", "Smoky", 
  "Crispy", "Creamy", "Fresh", "Zesty", "Rich"
];

interface FlavorTagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  id?: string;
}

const FlavorTagsInput = ({ tags, onChange, id = "flavor-tags" }: FlavorTagsInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag: string) => {
    const normalizedTag = tag.trim().toLowerCase();
    if (normalizedTag && !tags.map(t => t.toLowerCase()).includes(normalizedTag)) {
      onChange([...tags, normalizedTag]);
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      addTag(inputValue);
      setInputValue("");
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handleSuggestionClick = (tag: string) => {
    addTag(tag);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Flavor Tags</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <Badge 
            key={index} 
            variant="secondary"
            className="flex items-center gap-1 capitalize"
          >
            {tag}
            <button 
              onClick={() => removeTag(index)}
              className="ml-1 rounded-full hover:bg-muted p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        id={id}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type and press Enter to add tags"
        className="flex-1"
      />
      <div className="mt-2">
        <p className="text-xs text-muted-foreground mb-2">Popular flavor tags:</p>
        <div className="flex flex-wrap gap-2">
          {popularFlavorTags
            .filter(tag => !tags.map(t => t.toLowerCase()).includes(tag.toLowerCase()))
            .map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="cursor-pointer hover:bg-secondary"
                onClick={() => handleSuggestionClick(tag)}
              >
                {tag}
              </Badge>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FlavorTagsInput;
