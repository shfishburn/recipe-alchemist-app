
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FileText, Utensils, BookOpen, InfoIcon } from 'lucide-react';
import type { ChangesResponse } from '@/types/chat';

interface ChangesSummaryProps {
  changes: ChangesResponse;
}

export function ChangesSummary({ changes }: ChangesSummaryProps) {
  const hasTitle = !!changes.title;
  const hasDescription = !!changes.description || !!changes.tagline;
  const hasIngredients = changes.ingredients?.mode !== 'none' && changes.ingredients?.items?.length > 0;
  const hasInstructions = !!changes.instructions && changes.instructions.length > 0;
  const hasNutrition = !!changes.nutrition;
  const hasNotes = !!changes.science_notes && changes.science_notes.length > 0;
  
  const noChanges = !hasTitle && !hasDescription && !hasIngredients && !hasInstructions && !hasNutrition && !hasNotes;
  
  // If no changes are present, show a message
  if (noChanges) {
    return (
      <Alert className="mb-4">
        <AlertDescription className="text-sm">
          No changes were suggested. You can ask more specific questions to get recipe modifications.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-2 mb-4">
      <h3 className="text-sm font-medium mb-1">The following changes will be applied:</h3>
      
      <ScrollArea className="h-[210px] rounded-md border p-2">
        <div className="space-y-3 pr-3">
          {hasTitle && (
            <div>
              <Badge variant="outline" className="mb-1">Title</Badge>
              <p className="text-sm">{changes.title}</p>
            </div>
          )}
          
          {hasDescription && (
            <div>
              <Badge variant="outline" className="mb-1">Description</Badge>
              <p className="text-sm">{changes.tagline || changes.description}</p>
            </div>
          )}
          
          {hasIngredients && (
            <div>
              <Badge variant="outline" className="mb-1">
                Ingredients ({changes.ingredients.mode === 'replace' ? 'Replace All' : 'Add'})
              </Badge>
              <ul className="text-sm list-disc pl-5 space-y-1">
                {changes.ingredients.items.map((item, index) => (
                  <li key={index}>
                    {typeof item === 'string' 
                      ? item 
                      : `${item.qty} ${item.unit} ${item.item} ${item.notes ? `(${item.notes})` : ''}`
                    }
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {hasInstructions && (
            <div>
              <Badge variant="outline" className="mb-1">Instructions</Badge>
              <ol className="text-sm list-decimal pl-5 space-y-1">
                {changes.instructions.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          )}
          
          {hasNotes && (
            <div>
              <Badge variant="outline" className="mb-1">Science Notes</Badge>
              <ul className="text-sm list-disc pl-5 space-y-1">
                {changes.science_notes!.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
          )}
          
          {hasNutrition && (
            <div>
              <Badge variant="outline" className="mb-1">Nutrition Updates</Badge>
              <ul className="text-sm list-none space-y-1">
                {Object.entries(changes.nutrition!).map(([key, value]) => {
                  // Skip non-numeric values or complex objects
                  if (typeof value !== 'number') return null;
                  return (
                    <li key={key}>
                      {key}: {value} {key.includes('calorie') ? 'kcal' : 'g'}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
