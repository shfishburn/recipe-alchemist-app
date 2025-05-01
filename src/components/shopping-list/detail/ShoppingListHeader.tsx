
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Copy, ClipboardCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ShoppingList } from '@/types/shopping-list';

interface ShoppingListHeaderProps {
  list: ShoppingList;
  onDelete?: (id: string) => Promise<void>;
  itemsByDepartment: Record<string, any[]>;
  onCopyToClipboard: () => void;
  completionPercentage?: number;
  completedCount?: number;
  totalItems?: number;
}

export function ShoppingListHeader({ 
  list, 
  onDelete, 
  itemsByDepartment, 
  onCopyToClipboard,
  completionPercentage = 0,
  completedCount = 0,
  totalItems = 0
}: ShoppingListHeaderProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    onCopyToClipboard();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CardHeader className="px-0 pt-0 sticky top-0 z-10 pb-1">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <CardTitle className="text-2xl font-bold">{list.title}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {totalItems} items • {completedCount} completed
          </p>
        </div>
        <div className="flex gap-2">
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(list.id)}
              className="flex items-center gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-2"
          >
            {copied ? (
              <>
                <ClipboardCheck className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>
    </CardHeader>
  );
}
