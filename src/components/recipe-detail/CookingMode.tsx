
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, X, Timer } from 'lucide-react';
import type { Recipe } from '@/types/recipe';
import { ingredientToReactNode } from '@/utils/react-node-helpers';
import { ScienceNotes } from './ScienceNotes';
import { CookModeTimer } from './cooking-mode/CookModeTimer';
import { cn } from '@/lib/utils';

interface CookingModeProps {
  recipe: Recipe;
  onClose: () => void;
}

export function CookingMode({ recipe, onClose }: CookingModeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTimer, setShowTimer] = useState(false);
  
  // Total steps including title slide
  const totalSteps = recipe.instructions ? recipe.instructions.length + 1 : 1;
  
  // Get all ingredient names for reference during cooking
  const ingredientNames = recipe.ingredients.map(ing => 
    typeof ing.item === 'string' ? ing.item : ing.item.name
  );
  
  // Navigate to next step
  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Show title screen content
  const renderTitleScreen = () => (
    <div className="text-center space-y-6">
      <h1 className="text-3xl font-bold">{recipe.title}</h1>
      
      <div className="text-lg text-gray-600">
        Ready to start cooking?
      </div>
      
      <div className="text-sm text-gray-500">
        {recipe.ingredients.length} ingredients • {totalSteps - 1} steps
      </div>
      
      <div className="pt-4">
        <Button
          onClick={nextStep}
          className="font-medium text-base px-8 py-6 h-auto"
          size="lg"
        >
          Start Cooking <ChevronRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
  
  // Show current instruction step
  const renderInstructionStep = () => {
    const stepIndex = currentStep - 1;
    const instruction = recipe.instructions?.[stepIndex] || '';
    
    // Highlight ingredient mentions in the instruction
    const highlightedInstruction = addIngredientHighlights(instruction, ingredientNames);
    
    // Get relevant science notes for this step
    const stepScienceNotes = recipe.science_notes 
      ? recipe.science_notes
          .filter(note => 
            note.toLowerCase().includes(instruction.toLowerCase().substr(0, 30))
          )
      : [];
    
    return (
      <div className="space-y-6 h-full flex flex-col">
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-500 mb-4">
            Step {currentStep} of {totalSteps - 1}
          </div>
          
          <div className="text-xl leading-relaxed">{highlightedInstruction}</div>
          
          {/* Show relevant science notes */}
          {stepScienceNotes.length > 0 && (
            <div className="mt-8">
              <ScienceNotes notes={stepScienceNotes} compact />
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t mt-auto">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="gap-1"
          >
            <ChevronLeft /> Previous
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowTimer(!showTimer)}
            className="gap-1"
          >
            <Timer className="h-4 w-4" /> Timer
          </Button>
          
          <Button
            onClick={nextStep}
            disabled={currentStep === totalSteps - 1}
            className="gap-1"
          >
            Next <ChevronRight />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-50 border-b p-4 flex justify-between items-center">
        <div className="font-medium">Cooking Mode</div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto p-6 md:p-8 lg:p-12">
        <div className="max-w-3xl mx-auto">
          {currentStep === 0 ? renderTitleScreen() : renderInstructionStep()}
        </div>
      </div>
      
      {/* Timer overlay */}
      <CookModeTimer
        isOpen={showTimer}
        onClose={() => setShowTimer(false)}
      />
    </div>
  );
}

// Helper function to highlight ingredients in instruction text
function addIngredientHighlights(instruction: string, ingredients: (string | React.ReactNode)[]): React.ReactNode {
  // Convert ReactNode ingredients to strings for matching
  const ingredientStrings = ingredients.map(ing => 
    typeof ing === 'string' ? ing : String(ing)
  );
  
  // Find all ingredient mentions in the instruction
  let result = instruction;
  
  ingredientStrings.forEach(ingredient => {
    if (typeof ingredient === 'string') {
      // Case-insensitive replacement with highlighting
      const regex = new RegExp(`(${ingredient})`, 'gi');
      result = result.replace(regex, '<span class="font-semibold text-recipe-green">$1</span>');
    }
  });
  
  // Split by highlighted parts and create React nodes
  const parts = result.split(/(<span.*?<\/span>)/);
  
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('<span')) {
          // Extract the content between >< tags
          const content = part.match(/>([^<]*)</)?.[1] || '';
          return <span key={i} className="font-semibold text-recipe-green">{content}</span>;
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}
