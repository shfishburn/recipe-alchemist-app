
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BookOpen } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RecipeNameInputProps {
  title: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RecipeNameInput = ({ title, onTitleChange }: RecipeNameInputProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-recipe-blue" />
        <Label 
          htmlFor="title" 
          className="text-lg font-medium"
        >
          Recipe
        </Label>
        <span className="text-xs text-muted-foreground bg-accent/30 px-2 py-0.5 rounded-full">
          Required
        </span>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              <Input
                id="title"
                name="title"
                required
                className="h-12 pl-10 bg-background/50 border-2 focus:border-recipe-blue transition-all duration-200 ease-in-out shadow-sm hover:shadow-md"
                placeholder="Enter recipe name (e.g., 'Pasta', 'Chicken dish')"
                value={title}
                onChange={onTitleChange}
                aria-label="Recipe name input"
              />
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Enter a name for your recipe</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <p className="text-xs text-muted-foreground">
        Your recipe name helps AI understand the dish you're creating
      </p>
    </div>
  );
};

export default RecipeNameInput;
