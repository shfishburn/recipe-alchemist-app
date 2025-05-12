
import React from 'react';

interface QuickRecipeInstructionsProps {
  instructions: string[] | undefined;
}

export function QuickRecipeInstructions({ instructions = [] }: QuickRecipeInstructionsProps) {
  return (
    <div className="space-y-4">
      <ol className="list-decimal pl-5 space-y-4">
        {instructions?.map((instruction, index) => (
          <li key={index} className="text-gray-700 dark:text-gray-300">
            {instruction}
          </li>
        ))}
      </ol>
    </div>
  );
}
