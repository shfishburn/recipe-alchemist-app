
import React from 'react';
import { BookOpen, ShoppingBag } from 'lucide-react';
import type { ShoppingList } from '@/types/shopping-list';

interface ShoppingListNotesProps {
  list: ShoppingList;
}

export function ShoppingListNotes({ list }: ShoppingListNotesProps) {
  if ((!list.tips || list.tips.length === 0) && (!list.preparation_notes || list.preparation_notes.length === 0)) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Shopping Tips */}
      {list.tips && list.tips.length > 0 && (
        <div className="p-4 bg-amber-50 rounded-md border border-amber-100">
          <div className="flex items-center mb-3">
            <ShoppingBag className="h-5 w-5 text-amber-600 mr-2" />
            <h3 className="font-medium text-lg text-amber-800">Shopping Tips</h3>
          </div>
          <ul className="space-y-3">
            {list.tips.map((tip, index) => (
              <li key={index} className="text-base text-amber-800 pl-4 border-l-2 border-amber-300">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Preparation Notes */}
      {list.preparation_notes && list.preparation_notes.length > 0 && (
        <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
          <div className="flex items-center mb-3">
            <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-medium text-lg text-blue-800">Preparation Notes</h3>
          </div>
          <ul className="space-y-3">
            {list.preparation_notes.map((note, index) => (
              <li key={index} className="text-base text-blue-800 pl-4 border-l-2 border-blue-300">
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
