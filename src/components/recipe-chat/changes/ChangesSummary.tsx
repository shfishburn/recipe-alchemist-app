
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { SuggestedChanges, InstructionChange } from '@/types/chat';

interface ChangesSummaryProps {
  changes: SuggestedChanges;
  recipe?: any;
}

export function ChangesSummary({ changes, recipe }: ChangesSummaryProps) {
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
      {changes.title && (
        <div className="mb-3">
          <div className="flex gap-2 items-center">
            <Badge variant="secondary" className="shrink-0">Title</Badge>
            <p>{changes.title}</p>
          </div>
        </div>
      )}
      
      {/* Ingredient changes */}
      {changes.ingredients?.items && changes.ingredients.items.length > 0 && (
        <div className="mb-3">
          <p className="font-medium text-xs uppercase text-slate-500 mb-1">Ingredients</p>
          <div className="pl-2">
            {changes.ingredients.mode === 'replace' ? (
              <p className="text-amber-600 text-xs mb-1">Replacing all ingredients</p>
            ) : (
              <p className="text-green-600 text-xs mb-1">Adding new ingredients</p>
            )}
            <ul className="list-disc pl-4 space-y-1">
              {changes.ingredients.items.map((item, index) => (
                <li key={`ingredient-${index}`}>
                  {typeof item.item === 'string' ? item.item : item.item.name}
                  {item.notes && <span className="text-slate-500"> ({item.notes})</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Instruction changes */}
      {changes.instructions && changes.instructions.length > 0 && (
        <div className="mb-3">
          <p className="font-medium text-xs uppercase text-slate-500 mb-1">Instructions</p>
          <div className="pl-2">
            {changes.instructions.map(formatInstructionChange)}
          </div>
        </div>
      )}
      
      {/* Science notes changes */}
      {changes.science_notes && changes.science_notes.length > 0 && (
        <div className="mb-3">
          <p className="font-medium text-xs uppercase text-slate-500 mb-1">Science Notes</p>
          <div className="pl-2">
            <ul className="list-disc pl-4 space-y-1">
              {changes.science_notes.map((note, index) => (
                <li key={`science-note-${index}`}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* No changes detected */}
      {!changes.title && 
       (!changes.ingredients || !changes.ingredients.items || changes.ingredients.items.length === 0) &&
       (!changes.instructions || changes.instructions.length === 0) &&
       (!changes.science_notes || changes.science_notes.length === 0) && (
        <Alert>
          <p className="text-slate-500">No specific changes were detected in this response.</p>
        </Alert>
      )}
      
      <Separator className="my-2" />
      <p className="text-xs text-slate-500">Review these changes before applying them to your recipe.</p>
    </div>
  );
}
