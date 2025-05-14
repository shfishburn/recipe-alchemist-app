
import React from 'react';

interface FormattedItemProps {
  item: any;
  options?: {
    highlight?: 'name' | 'none';
    strikethrough?: boolean;
  };
  className?: string;
}

export function FormattedItem({ item, options = {}, className = '' }: FormattedItemProps) {
  const { highlight = 'none', strikethrough = false } = options;
  
  // Handle different item structures
  const itemName = typeof item === 'string' 
    ? item 
    : item.name || item.item || '';
    
  const quantity = item.quantity || item.qty || '';
  const unit = item.unit || '';
  
  // Build display text
  let displayText = itemName;
  if (quantity || unit) {
    displayText = `${quantity} ${unit} ${itemName}`.trim();
  }
  
  const textClasses = [
    className,
    strikethrough ? 'line-through text-muted-foreground' : '',
  ].filter(Boolean).join(' ');

  return <span className={textClasses}>{displayText}</span>;
}
