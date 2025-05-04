
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Trash2 } from 'lucide-react';
import type { ShoppingList } from '@/types/shopping-list';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ShoppingListHeaderProps {
  list: ShoppingList;
  onDelete?: (id: string) => Promise<void>;
  onCopyToClipboard: () => Promise<void>;
  itemsByDepartment: Record<string, any[]>;
  completionPercentage: number;
  completedCount: number;
  totalItems: number;
}

export function ShoppingListHeader({ 
  list, 
  onDelete,
  onCopyToClipboard,
  completionPercentage,
  completedCount,
  totalItems
}: ShoppingListHeaderProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="pb-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold truncate">{list.title}</h2>
          <p className="text-sm text-muted-foreground">
            Created {formatDate(list.created_at)} · {completedCount} of {totalItems} items complete
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onCopyToClipboard}
            className="text-sm"
          >
            <Copy className="h-4 w-4 mr-1.5" />
            Copy
          </Button>
          
          {onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-sm border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete shopping list?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    shopping list and all its items.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDelete(list.id)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
}
