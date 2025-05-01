
import React from 'react';
import type { ShoppingList } from '@/types/shopping-list';

interface ShoppingListNotesProps {
  list: ShoppingList;
}

export function ShoppingListNotes({ list }: ShoppingListNotesProps) {
  if ((!list.tips || list.tips.length === 0) && (!list.preparation_notes || list.preparation_notes.length === 0)) {
    return null;
  }

  return (
    <>
      {/* Shopping Tips */}
      {list.tips && list.tips.length > 0 && (
        <div className="mb-6 p-4 bg-muted rounded-md">
          <h3 className="font-medium mb-2">Shopping Tips:</h3>
          <ul className="list-disc list-inside space-y-1">
            {list.tips.map((tip, index) => (
              <li key={index} className="text-sm text-muted-foreground">{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Preparation Notes */}
      {list.preparation_notes && list.preparation_notes.length > 0 && (
        <div className="mb-6 p-4 bg-muted/50 rounded-md">
          <h3 className="font-medium mb-2">Preparation Notes:</h3>
          <ul className="list-disc list-inside space-y-1">
            {list.preparation_notes.map((note, index) => (
              <li key={index} className="text-sm text-muted-foreground">{note}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
