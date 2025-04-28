
import React from 'react';
import type { ChangesResponse } from '@/types/chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface ChangesSummaryProps {
  changes: ChangesResponse;
  isMobile?: boolean;
}

export function ChangesSummary({ changes, isMobile = false }: ChangesSummaryProps) {
  if (!changes) return null;
  
  const hasTitle = !!changes.title;
  const hasIngredients = changes.ingredients?.items && changes.ingredients.items.length > 0;
  const hasInstructions = changes.instructions && changes.instructions.length > 0;
  const hasScienceNotes = changes.science_notes && changes.science_notes.length > 0;
  
  if (!hasTitle && !hasIngredients && !hasInstructions && !hasScienceNotes) return null;

  const textSize = isMobile ? "text-xs" : "text-sm";
  const marginClass = isMobile ? "mt-1.5" : "mt-3";
  
  return (
    <div className={`${marginClass} p-2 sm:p-3 bg-slate-50 rounded-md border border-slate-200`}>
      <h4 className={`font-medium ${textSize} text-slate-700 mb-1.5`}>Changes to be applied:</h4>
      
      <ScrollArea className="max-h-[150px]">
        <div className="space-y-2">
          {hasTitle && (
            <div>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 mb-1">Title</Badge>
              <p className={`${textSize} text-slate-600 pl-1`}>{changes.title}</p>
            </div>
          )}
          
          {hasIngredients && (
            <div>
              <Badge variant="outline" className="bg-green-50 text-green-700 mb-1">
                {changes.ingredients.mode === 'add' ? 'Add Ingredients' : 'Replace Ingredients'}
              </Badge>
              <ul className={`${textSize} list-disc list-inside text-slate-600 pl-1`}>
                {changes.ingredients.items.slice(0, 5).map((ingredient, index) => (
                  <li key={index}>
                    {ingredient.qty} {ingredient.unit} {ingredient.item}
                    {ingredient.notes ? <span className="text-slate-500 italic"> ({ingredient.notes})</span> : ''}
                  </li>
                ))}
                {changes.ingredients.items.length > 5 && (
                  <li>And {changes.ingredients.items.length - 5} more ingredients...</li>
                )}
              </ul>
            </div>
          )}
          
          {hasInstructions && (
            <div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 mb-1">
                {Array.isArray(changes.instructions) && changes.instructions.length === 1 
                  ? '1 Instruction' 
                  : `${changes.instructions.length} Instructions`}
              </Badge>
              <ul className={`${textSize} list-disc list-inside text-slate-600 pl-1`}>
                {Array.isArray(changes.instructions) && 
                  changes.instructions.slice(0, 3).map((instruction, index) => (
                    <li key={index}>
                      {typeof instruction === 'string' 
                        ? instruction.substring(0, 60) + (instruction.length > 60 ? '...' : '')
                        : instruction.action?.substring(0, 60) + (instruction.action?.length > 60 ? '...' : '')}
                    </li>
                  ))}
                {Array.isArray(changes.instructions) && changes.instructions.length > 3 && (
                  <li>And {changes.instructions.length - 3} more steps...</li>
                )}
              </ul>
            </div>
          )}
          
          {hasScienceNotes && (
            <div>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 mb-1">Science Notes</Badge>
              <p className={`${textSize} text-slate-600 pl-1`}>
                {changes.science_notes.length} science notes will be added
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
