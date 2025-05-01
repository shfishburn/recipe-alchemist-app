
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingItem } from './types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface ShoppingListItemProps {
  item: ShoppingItem;
  index: number;
  onToggle: (index: number) => void;
}

export function ShoppingListItem({ item, index, onToggle }: ShoppingListItemProps) {
  // Extract ingredient details from either the structured fields or the original ingredientData
  const hasDetails = !!(item.notes || item.ingredientData?.notes);
  const notes = item.notes || (item.ingredientData?.notes || '');
  
  // Extract quality indicators and storage tips if available
  const qualityIndicators = item.quality_indicators || item.originalIngredient?.quality_indicators;
  const storageTips = item.storage_tips || item.originalIngredient?.storage_tips;
  const alternatives = item.originalIngredient?.alternatives;
  
  // Determine if we should show additional item details
  const showDetails = hasDetails || qualityIndicators || storageTips || alternatives || 
    (item.ingredientData && typeof item.ingredientData.item === 'object');
  
  // Extract item name for display
  const itemName = item.item || '';
  const quantity = item.quantity || '';
  const unit = item.unit || '';

  // Create a more readable display format
  const displayText = item.text || `${quantity} ${unit} ${itemName}`.trim();

  return (
    <div className="flex items-start gap-2 p-2 bg-muted/40 rounded-md group hover:bg-muted/60 transition-colors">
      <Checkbox 
        id={`item-${index}`}
        checked={item.checked}
        onCheckedChange={() => onToggle(index)}
        className="mt-0.5"
      />
      <label 
        htmlFor={`item-${index}`}
        className={`text-sm flex-1 cursor-pointer ${item.checked ? 'line-through text-muted-foreground' : ''}`}
      >
        <div className="flex items-center gap-1">
          {/* Format to make the item name stand out */}
          {quantity && unit ? (
            <span>{quantity} {unit} <strong>{itemName}</strong></span>
          ) : (
            <span>{displayText}</span>
          )}
          
          {showDetails && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground inline-block cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  {qualityIndicators && (
                    <p className="font-medium text-sm mb-1">{qualityIndicators}</p>
                  )}
                  {notes && (
                    <p className="text-xs mb-1">{notes}</p>
                  )}
                  {storageTips && (
                    <p className="text-xs text-muted-foreground">{storageTips}</p>
                  )}
                  {alternatives && alternatives.length > 0 && (
                    <p className="text-xs mt-1">
                      <span className="font-medium">Alternatives:</span> {alternatives.join(', ')}
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        {item.pantryStaple && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded ml-2">
            Pantry Staple
          </span>
        )}
        
        {alternatives && alternatives.length > 0 && (
          <div className="text-xs text-muted-foreground mt-0.5">
            Alternatives: {alternatives.join(', ')}
          </div>
        )}
      </label>
    </div>
  );
}
