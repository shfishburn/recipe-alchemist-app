
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { ShoppingList } from '@/types/shopping-list';
import { Check } from 'lucide-react';

interface ShoppingListCardProps {
  list: ShoppingList;
  onClick: () => void;
}

export function ShoppingListCard({ list, onClick }: ShoppingListCardProps) {
  const completedItems = list.items.filter(item => item.checked).length;
  
  return (
    <Card 
      className="cursor-pointer hover:border-primary transition-colors"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle>{list.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Check className="h-4 w-4" />
            {completedItems}/{list.items.length}
          </div>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">
            {list.items.length} items
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
