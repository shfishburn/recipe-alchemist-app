import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import type { ChangesResponse } from '@/types/chat';

interface ChangesSummaryProps {
  changes: ChangesResponse;
}

export function ChangesSummary({ changes }: ChangesSummaryProps) {
  // Count the number of significant changes
  const changeCount = useMemo(() => {
    let count = 0;
    
    // Title change
    if (changes.title) count++;
    
    // Tagline/Description change
    if (changes.tagline || changes.description) count++;
    
    // Ingredient changes
    if (changes.ingredients && changes.ingredients.mode !== 'none' && 
        changes.ingredients.items && changes.ingredients.items.length > 0) {
      count += changes.ingredients.items.length;
    }
    
    // Instruction changes
    if (changes.instructions && changes.instructions.length > 0) {
      count++;
    }
    
    // Science notes
    if (changes.science_notes && changes.science_notes.length > 0) {
      count++;
    }
    
    // Other metadata changes
    if (changes.cooking_tip) count++;
    if (changes.cuisine) count++;
    
    return count;
  }, [changes]);

  // Show specific change details
  return (
    <div className="space-y-2 text-sm">
      <div className="flex gap-2 flex-wrap">
        {/* Summary badge with count */}
        <Badge variant="outline" className="bg-muted">
          {changeCount} change{changeCount !== 1 ? 's' : ''} suggested
        </Badge>
        
        {/* Title badge */}
        {changes.title && (
          <Badge variant="secondary">
            Title update
          </Badge>
        )}
        
        {/* Description badge */}
        {(changes.tagline || changes.description) && (
          <Badge variant="secondary">
            Description update
          </Badge>
        )}
        
        {/* Ingredients badge */}
        {changes.ingredients && changes.ingredients.mode !== 'none' && (
          <Badge variant="secondary">
            {changes.ingredients.mode === 'add' ? 'Add ingredients' : 'Replace ingredients'}
            {changes.ingredients.items && ` (${changes.ingredients.items.length})`}
          </Badge>
        )}
        
        {/* Instructions badge */}
        {changes.instructions && changes.instructions.length > 0 && (
          <Badge variant="secondary">
            Update instructions
          </Badge>
        )}
        
        {/* Science notes badge */}
        {changes.science_notes && changes.science_notes.length > 0 && (
          <Badge variant="secondary">
            Science notes
          </Badge>
        )}
        
        {/* Other metadata badges */}
        {changes.cooking_tip && (
          <Badge variant="secondary">
            Cooking tip
          </Badge>
        )}
        
        {changes.cuisine && (
          <Badge variant="secondary">
            Cuisine update
          </Badge>
        )}
      </div>
    </div>
  );
}
