
import React from 'react';
import { RecipeSectionHeader } from './RecipeSectionHeader';
import { FormattedText } from '@/components/recipe-chat/response/FormattedText';

interface RecipeStepsProps {
  steps: string[];
}

export function RecipeSteps({ steps }: RecipeStepsProps) {
  return (
    <div>
      <RecipeSectionHeader title="Quick Steps" />
      <ol className="list-decimal pl-5 space-y-2">
        {steps.map((step, index) => (
          <li key={index}>
            <FormattedIngredientText text={step} />
          </li>
        ))}
      </ol>
    </div>
  );
}

// Component to process and format ingredient text with styling
function FormattedIngredientText({ text }: { text: string }) {
  // Split by bold markers
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  if (parts.length === 1) {
    return <>{text}</>; // No formatting needed
  }
  
  return (
    <>
      {parts.map((part, i) => {
        // Check if this part is wrapped in bold markers
        if (part.startsWith('**') && part.endsWith('**')) {
          // Extract content between ** markers and render as bold with special styling
          const content = part.substring(2, part.length - 2);
          return (
            <span 
              key={i} 
              className="font-semibold text-recipe-blue bg-recipe-blue/5 px-1.5 py-0.5 rounded-md border border-recipe-blue/10"
            >
              {content}
            </span>
          );
        }
        // Return regular text
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}
