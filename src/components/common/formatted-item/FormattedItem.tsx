
import React from 'react';
import { FormattableItem, FormattingOptions } from './types';
import { formatItem } from './item-formatter';
import { FormattedIngredientText } from '@/components/recipe-chat/response/FormattedIngredientText';
import { cn } from '@/lib/utils';

interface FormattedItemProps {
  item: FormattableItem;
  options?: FormattingOptions;
  className?: string;
}

/**
 * Universal component for formatting different types of items (ingredients, shopping items)
 * with consistent styling and formatting
 */
export function FormattedItem({ item, options = {}, className }: FormattedItemProps) {
  // Use the item formatter to generate markdown text
  const formattedText = formatItem(item, options);
  
  // Apply additional class names if provided
  const combinedClassName = cn(
    className,
    options.className,
    options.strikethrough && 'text-muted-foreground'
  );
  
  // Use the existing FormattedIngredientText component to handle the markdown
  return (
    <FormattedIngredientText 
      text={formattedText} 
      className={combinedClassName}
    />
  );
}
