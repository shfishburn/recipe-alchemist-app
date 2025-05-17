
import React from 'react';
import { Check, X } from 'lucide-react';
import { ChatMessage } from '@/types/chat';

export interface ChangesSummaryProps {
  changes: ChatMessage['changes_suggested'];
  isMobile?: boolean;
}

export function ChangesSummary({ changes, isMobile = false }: ChangesSummaryProps) {
  if (!changes) {
    return <div className="text-sm text-gray-500">No changes were suggested.</div>;
  }

  return (
    <div className="space-y-3">
      {/* Title Changes */}
      {changes.title && (
        <div className="flex gap-2">
          <div className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-blue-100 flex items-center justify-center">
            <Check className="w-3 h-3 text-blue-700" />
          </div>
          <div>
            <p className="text-sm font-medium">Title</p>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
              Update title to "{changes.title}"
            </p>
          </div>
        </div>
      )}

      {/* Ingredient Changes */}
      {changes.ingredients && changes.ingredients.items && changes.ingredients.items.length > 0 && (
        <div className="flex gap-2">
          <div className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-3 h-3 text-green-700" />
          </div>
          <div>
            <p className="text-sm font-medium">Ingredients ({changes.ingredients.mode})</p>
            <ul className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 list-disc list-inside space-y-0.5`}>
              {changes.ingredients.items.map((item, i) => {
                // Handle different item formats
                const ingredientText = typeof item === 'string' 
                  ? item 
                  : typeof item.item === 'string'
                    ? `${item.qty || ''} ${item.unit || ''} ${item.item}`
                    : item.item?.name || 'Ingredient';

                return <li key={i}>{ingredientText}</li>;
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Instruction Changes */}
      {changes.instructions && changes.instructions.length > 0 && (
        <div className="flex gap-2">
          <div className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-orange-100 flex items-center justify-center">
            <Check className="w-3 h-3 text-orange-700" />
          </div>
          <div>
            <p className="text-sm font-medium">Instructions</p>
            <ul className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 list-disc list-inside space-y-0.5`}>
              {changes.instructions.map((instruction, i) => {
                const instructionText = typeof instruction === 'string'
                  ? instruction
                  // Handle instruction object with action property
                  : instruction.action || JSON.stringify(instruction);
                return <li key={i} className="line-clamp-1">{instructionText}</li>;
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Science Notes Changes */}
      {changes.science_notes && changes.science_notes.length > 0 && (
        <div className="flex gap-2">
          <div className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-purple-100 flex items-center justify-center">
            <Check className="w-3 h-3 text-purple-700" />
          </div>
          <div>
            <p className="text-sm font-medium">Science Notes</p>
            <ul className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 list-disc list-inside space-y-0.5`}>
              {changes.science_notes.map((note, i) => (
                <li key={i} className="line-clamp-1">{note}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* No Changes Detected */}
      {!changes.title && 
       (!changes.ingredients || !changes.ingredients.items || changes.ingredients.items.length === 0) && 
       (!changes.instructions || changes.instructions.length === 0) && 
       (!changes.science_notes || changes.science_notes.length === 0) && (
        <div className="flex gap-2">
          <div className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-gray-100 flex items-center justify-center">
            <X className="w-3 h-3 text-gray-700" />
          </div>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
            No specific changes were found in the suggested changes object.
          </p>
        </div>
      )}
    </div>
  );
}
