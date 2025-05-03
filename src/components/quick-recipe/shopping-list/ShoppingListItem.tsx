
import React from 'react';
import { ShoppingItem } from './types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Check, Info } from 'lucide-react';
import { useUnitSystem } from '@/hooks/use-unit-system';

interface ShoppingListItemProps {
  item: ShoppingItem;
  index: number;
  onToggle: (index: number) => void;
}

export function ShoppingListItem({ item, index, onToggle }: ShoppingListItemProps) {
  const { unitSystem } = useUnitSystem();
  
  // Extract ingredient details from either the structured fields or the original ingredientData
  const hasDetails = !!(item.notes || item.ingredientData?.notes);
  const notes = item.notes || (item.ingredientData?.notes || '');
  
  // Extract quality indicators and storage tips if available
  const qualityIndicators = item.quality_indicators || item.originalIngredient?.quality_indicators;
  const storageTips = item.storage_tips || item.originalIngredient?.storage_tips;
  const alternatives = item.alternatives || item.originalIngredient?.alternatives;
  
  // Determine if we should show additional item details
  const showDetails = hasDetails || qualityIndicators || storageTips || alternatives || 
    (item.ingredientData && typeof item.ingredientData.item === 'object');
  
  // Extract item name for display
  const itemName = item.item || '';
  const quantity = item.quantity || '';
  const unit = item.unit || '';
  
  // Apply unit system conversion if possible
  const getConvertedUnit = (value: number | string, unit: string): {value: string, unit: string} => {
    if (!value) return {value: '', unit: ''};
    
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numericValue)) return {value: String(value), unit};
    
    // Convert units based on user preference
    if (unitSystem === 'imperial') {
      // Convert metric to imperial
      if (unit === 'g' && numericValue >= 100) {
        return {value: (numericValue / 453.59).toFixed(2), unit: 'lb'};
      } else if (unit === 'g') {
        return {value: (numericValue / 28.35).toFixed(1), unit: 'oz'};
      } else if (unit === 'kg') {
        return {value: (numericValue * 2.20462).toFixed(2), unit: 'lb'};
      } else if (unit === 'ml' && numericValue >= 240) {
        return {value: (numericValue / 240).toFixed(2), unit: 'cup'};
      } else if (unit === 'ml') {
        return {value: (numericValue / 29.57).toFixed(1), unit: 'fl oz'};
      } else if (unit === 'l') {
        return {value: (numericValue * 4.22675).toFixed(2), unit: 'cup'};
      } else if (unit === 'cm') {
        return {value: (numericValue / 2.54).toFixed(1), unit: 'in'};
      }
    } else {
      // Convert imperial to metric
      if (unit === 'lb') {
        return {value: (numericValue * 453.59).toFixed(0), unit: 'g'};
      } else if (unit === 'oz') {
        return {value: (numericValue * 28.35).toFixed(0), unit: 'g'};
      } else if (unit === 'cup') {
        return {value: (numericValue * 240).toFixed(0), unit: 'ml'};
      } else if (unit === 'fl oz') {
        return {value: (numericValue * 29.57).toFixed(0), unit: 'ml'};
      } else if (unit === 'in') {
        return {value: (numericValue * 2.54).toFixed(1), unit: 'cm'};
      }
    }
    
    return {value: String(value), unit};
  };
  
  // Convert based on unit system preference
  const converted = getConvertedUnit(quantity, unit);
  
  // Create a more readable display format
  const displayText = item.text || `${converted.value} ${converted.unit} ${itemName}`.trim();

  return (
    <div 
      className={`flex items-start gap-2 p-4 rounded-md cursor-pointer transition-colors
        ${item.checked 
          ? 'bg-green-50 hover:bg-green-100' 
          : 'bg-muted/40 hover:bg-muted/60'}`}
      onClick={() => onToggle(index)}
    >
      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-1">
        {item.checked && <Check className="h-4 w-4 text-green-600" />}
      </div>
      <div 
        className={`text-sm flex-1 pt-1 ${item.checked ? 'line-through text-muted-foreground' : ''}`}
      >
        <div className="flex items-center gap-1 flex-wrap">
          {/* Format to make the item name stand out */}
          {converted.value && converted.unit ? (
            <span className="text-base">
              {converted.value} {converted.unit}{' '}
              <strong>{itemName}</strong>
            </span>
          ) : (
            <span className="text-base">{displayText}</span>
          )}
          
          {showDetails && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center justify-center h-5 w-5 ml-1">
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </span>
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
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded ml-2 mt-1 inline-block">
            Pantry Staple
          </span>
        )}
        
        {/* Always show alternatives in the UI itself for better visibility */}
        {alternatives && alternatives.length > 0 && (
          <div className="text-xs text-muted-foreground mt-1.5">
            Alternatives: {alternatives.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
}
