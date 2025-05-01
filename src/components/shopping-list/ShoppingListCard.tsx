
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ShoppingList } from '@/types/shopping-list';
import { Check, Calendar, ShoppingBag, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';

interface ShoppingListCardProps {
  list: ShoppingList;
  onClick: () => void;
  onDelete?: (id: string) => Promise<void>;
}

export function ShoppingListCard({ list, onClick, onDelete }: ShoppingListCardProps) {
  const completedItems = list.items.filter(item => item.checked).length;
  const progress = list.items.length ? Math.round((completedItems / list.items.length) * 100) : 0;
  const createdAt = new Date(list.created_at);
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });
  
  // Count departments
  const departments = new Set<string>();
  list.items.forEach(item => {
    if (item.department) {
      departments.add(item.department);
    }
  });
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(list.id);
    }
  };
  
  return (
    <Card 
      className="cursor-pointer hover:border-primary transition-colors overflow-hidden"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span className="truncate">{list.title}</span>
          <div className="flex items-center gap-2">
            {progress === 100 && <Check className="h-4 w-4 text-green-500" />}
            {onDelete && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 hover:bg-destructive/10"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
                <span className="sr-only">Delete list</span>
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="mb-2">
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>{completedItems}/{list.items.length} items</span>
          </div>
          
          {departments.size > 0 && (
            <>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                {departments.size} {departments.size === 1 ? 'category' : 'categories'}
              </span>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 text-xs text-muted-foreground flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        <span>{timeAgo}</span>
      </CardFooter>
    </Card>
  );
}
