
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { SuggestedChanges, InstructionChange, ChangesResponse } from '@/types/chat';

interface ChangesSummaryProps {
  changes: SuggestedChanges | ChangesResponse;
  recipe?: any;
  isMobile?: boolean; // Add this property to fix the error
}

export function ChangesSummary({ changes, recipe, isMobile }: ChangesSummaryProps) {
  // Convert any ChangesResponse to SuggestedChanges
  const suggestedChanges = changes as SuggestedChanges;
  
  const formatInstructionChange = (instruction: string | InstructionChange, index: number) => {
    if (typeof instruction === 'string') {
      return (
        <div key={`instruction-${index}`} className="flex gap-2 items-start mb-2">
          <Badge variant="outline" className="mt-0.5 shrink-0">New</Badge>
          <p className="text-sm">{instruction}</p>
        </div>
      );
    }
    
    // Handle instruction change object
    if ('action' in instruction) {
      return (
        <div key={`instruction-action-${index}`} className="flex gap-2 items-start mb-2">
          <Badge 
            variant={instruction.action.toLowerCase().includes('add') ? 'outline' : 'secondary'}
            className="mt-0.5 shrink-0"
          >
            {instruction.action.includes('add') ? 'Add' : 'Update'}
          </Badge>
          <p className="text-sm">{instruction.text || instruction.action}</p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-sm">
      <h4 className="font-medium mb-2">Suggested Changes</h4>
      
      {/* Title changes */}
      {suggestedChanges.title && (
        <div className="mb-3">
          <div className="flex gap-2 items-center">
            <Badge variant="secondary" className="shrink-0">Title</Badge>
            <p>{suggestedChanges.title}</p>
          </div>
        </div>
      )}
      
      {/* Ingredient changes */}
      {suggestedChanges.ingredients?.items && suggestedChanges.ingredients.items.length > 0 && (
        <div className="mb-3">
          <p className="font-medium text-xs uppercase text-slate-500 mb-1">Ingredients</p>
          <div className="pl-2">
            {suggestedChanges.ingredients.mode === 'replace' ? (
              <p className="text-amber-600 text-xs mb-1">Replacing all ingredients</p>
            ) : (
              <p className="text-green-600 text-xs mb-1">Adding new ingredients</p>
            )}
            <ul className="list-disc pl-4 space-y-1">
              {suggestedChanges.ingredients.items.map((item, index) => (
                <li key={`ingredient-${index}`}>
                  {typeof item.item === 'string' 
                    ? item.item 
                    : (item.item && typeof item.item === 'object' && 'name' in item.item) 
                      ? String(item.item.name) 
                      : 'Unknown ingredient'}
                  {item.notes && <span className="text-slate-500"> ({item.notes})</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Instruction changes */}
      {suggestedChanges.instructions && suggestedChanges.instructions.length > 0 && (
        <div className="mb-3">
          <p className="font-medium text-xs uppercase text-slate-500 mb-1">Instructions</p>
          <div className="pl-2">
            {suggestedChanges.instructions.map(formatInstructionChange)}
          </div>
        </div>
      )}
      
      {/* Science notes changes */}
      {suggestedChanges.science_notes && suggestedChanges.science_notes.length > 0 && (
        <div className="mb-3">
          <p className="font-medium text-xs uppercase text-slate-500 mb-1">Science Notes</p>
          <div className="pl-2">
            <ul className="list-disc pl-4 space-y-1">
              {suggestedChanges.science_notes.map((note, index) => (
                <li key={`note-${index}`}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
