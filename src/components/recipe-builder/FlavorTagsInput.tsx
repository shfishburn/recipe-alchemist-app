
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChefHat, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FlavorCategory {
  name: string;
  tags: string[];
}

const flavorCategories: FlavorCategory[] = [
  {
    name: "Texture and Mouthfeel",
    tags: ["Silky", "Crunchy", "Tender", "Flaky", "Velvety", "Juicy", "Crisp"]
  },
  {
    name: "Flavor Complexity",
    tags: ["Aromatic", "Earthy", "Herbaceous", "Nutty", "Pungent", "Buttery", "Caramelized", "Fruity", "Malty", "Peppery"]
  },
  {
    name: "Flavor Intensity",
    tags: ["Delicate", "Bold", "Robust", "Intense", "Mild", "Subtle"]
  },
  {
    name: "Specific Taste Categories",
    tags: ["Bitter", "Briny", "Citrusy", "Fermented", "Floral", "Gamey", "Honeyed", "Mellow", "Minty", "Roasted", "Woodsy", "Astringent"]
  }
];

// Flatten all tags for quick access
const popularFlavorTags = flavorCategories.flatMap(category => category.tags);

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

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <ChefHat className="h-4 w-4 text-recipe-blue" />
        <Label htmlFor={id} className="text-base">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>Flavor Profile</TooltipTrigger>
              <TooltipContent className="max-w-[200px] text-wrap">
                Add flavors that define your recipe's taste profile
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <Badge 
            key={index} 
            variant="secondary"
            className="flex items-center gap-1 capitalize bg-recipe-blue/10 text-recipe-blue hover:bg-recipe-blue/20"
          >
            {tag}
            <button 
              onClick={() => removeTag(index)}
              className="ml-1 rounded-full hover:bg-recipe-blue/30 p-0.5"
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
        placeholder="Type and press Enter to add flavors"
        className="border-recipe-blue/20 focus-visible:ring-recipe-blue"
      />

      <div className="mt-4 space-y-4">
        {flavorCategories.map((category) => (
          <div key={category.name} className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">{category.name}:</p>
            <div className="flex flex-wrap gap-2">
              {category.tags
                .filter(tag => !tags.map(t => t.toLowerCase()).includes(tag.toLowerCase()))
                .map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-recipe-blue/10 hover:text-recipe-blue transition-colors"
                    onClick={() => addTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2">Press Enter to add each flavor</p>
    </div>
  );
};

export default FlavorTagsInput;
