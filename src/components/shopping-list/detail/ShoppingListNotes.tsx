
import React from 'react';
import { BookOpen, ShoppingBag } from 'lucide-react';
import type { ShoppingList } from '@/types/shopping-list';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ShoppingListNotesProps {
  list: ShoppingList;
}

export function ShoppingListNotes({ list }: ShoppingListNotesProps) {
  // Initialize empty content and then conditionally add to it
  // This avoids early returns that could cause hook order issues
  const hasTips = list.tips && list.tips.length > 0;
  const hasNotes = list.preparation_notes && list.preparation_notes.length > 0;
  
  // Return empty div if no content rather than null
  // This helps maintain consistent component rendering flow
  if (!hasTips && !hasNotes) {
    return <div className="empty-notes"></div>;
  }

  return (
    <div className="space-y-4">
      {/* Shopping Tips */}
      {hasTips && (
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 shadow-sm">
          <div className="flex items-center mb-2">
            <ShoppingBag className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0" />
            <h3 className="font-medium text-amber-800">Shopping Tips</h3>
          </div>
          <ScrollArea className="max-h-[200px]">
            <ul className="space-y-2">
              {list.tips?.map((tip, index) => (
                <li 
                  key={index} 
                  className="text-amber-800 pl-4 border-l-2 border-amber-200 text-sm leading-relaxed break-words"
                >
                  {tip}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      )}

      {/* Preparation Notes */}
      {hasNotes && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
          <div className="flex items-center mb-2">
            <BookOpen className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
            <h3 className="font-medium text-blue-800">Preparation Notes</h3>
          </div>
          <ScrollArea className="max-h-[200px]">
            <ul className="space-y-2">
              {list.preparation_notes?.map((note, index) => (
                <li 
                  key={index} 
                  className="text-blue-800 pl-4 border-l-2 border-blue-200 text-sm leading-relaxed break-words"
                >
                  {note}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
