import React from 'react';
import { ChatMessage } from '@/types/chat';
import { Card, CardContent } from '@/components/ui/card';
import { CheckIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define instruction change type locally since it's no longer imported
interface InstructionChange {
  action: string;
  [key: string]: any;
}

interface ChangesSummaryProps {
  chatMessage: ChatMessage;
  onApplyChanges?: () => void;
  disabledApply?: boolean;
  isApplying?: boolean;
  hideControls?: boolean;
}

export function ChangesSummary({
  chatMessage,
  onApplyChanges,
  disabledApply = false,
  isApplying = false,
  hideControls = false,
}: ChangesSummaryProps) {
  // Helper function to render changes
  const renderChanges = () => {
    if (!chatMessage.changes_suggested) {
      return <p className="text-muted-foreground">No changes suggested.</p>;
    }
    
    const { title, ingredients, instructions, science_notes } = chatMessage.changes_suggested;
    
    return (
      <>
        {title && (
          <div className="mb-2">
            <p className="text-sm font-medium mb-1">Title:</p>
            <p className="text-sm">{title}</p>
          </div>
        )}
        
        {ingredients?.items && ingredients.items.length > 0 && (
          <div className="mb-2">
            <p className="text-sm font-medium mb-1">
              Ingredients ({ingredients.mode === 'add' ? 'Add' : ingredients.mode === 'replace' ? 'Replace' : 'Update'}):
            </p>
            <ul className="text-sm list-disc list-inside">
              {ingredients.items.map((ingredient, idx) => (
                <li key={idx}>
                  {typeof ingredient === 'string' 
                    ? ingredient 
                    : `${ingredient.qty || ''} ${ingredient.unit || ''} ${
                        typeof ingredient.item === 'string' 
                          ? ingredient.item 
                          : ingredient.item?.name || 'Ingredient'
                      }`}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {instructions && instructions.length > 0 && (
          <div className="mb-2">
            <p className="text-sm font-medium mb-1">Instructions:</p>
            <ol className="text-sm list-decimal list-inside">
              {instructions.map((instruction, idx) => {
                // Handle both string and object instructions
                const instructionText = typeof instruction === 'string' 
                  ? instruction 
                  : (instruction as InstructionChange).action;
                
                return <li key={idx}>{instructionText}</li>;
              })}
            </ol>
          </div>
        )}
        
        {science_notes && science_notes.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-1">Science Notes:</p>
            <ul className="text-sm list-disc list-inside">
              {science_notes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </>
    );
  };
  
  return (
    <Card className="mt-4 mb-4">
      <CardContent className="pt-4">
        <div className="mb-3">
          <h3 className="text-lg font-medium">Suggested Changes</h3>
          <p className="text-muted-foreground text-sm">
            The following changes can be applied to your recipe.
          </p>
        </div>
        
        <div className="p-3 bg-muted/50 rounded-md">
          {renderChanges()}
        </div>
        
        {!hideControls && chatMessage.changes_suggested && (
          <div className="mt-4 flex justify-end">
            <Button
              onClick={onApplyChanges}
              disabled={disabledApply || isApplying}
              className="flex items-center space-x-1"
            >
              {isApplying ? (
                <>
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>Applying...</span>
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 mr-1" />
                  <span>Apply Changes</span>
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
