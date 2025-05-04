
import React, { useState } from 'react';
import { BookOpen, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import type { ShoppingList } from '@/types/shopping-list';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ShoppingListNotesProps {
  list: ShoppingList;
}

export function ShoppingListNotes({ list }: ShoppingListNotesProps) {
  const [showTips, setShowTips] = useState(false);
  const [showPrep, setShowPrep] = useState(false);
  
  // Initialize empty content and then conditionally add to it
  // This avoids early returns that could cause hook order issues
  const hasTips = list.tips && list.tips.length > 0;
  const hasNotes = list.preparation_notes && list.preparation_notes.length > 0;
  
  // Return empty div if no content rather than null
  // This helps maintain consistent component rendering flow
  if (!hasTips && !hasNotes) {
    return <div className="empty-notes text-center text-muted-foreground py-4">No notes or tips available.</div>;
  }

  return (
    <div className="space-y-4">
      {/* Shopping Tips */}
      {hasTips && (
        <Collapsible open={showTips} onOpenChange={setShowTips} className="w-full">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex w-full justify-between p-3 bg-amber-50 rounded-lg border border-amber-100 shadow-sm">
              <div className="flex items-center">
                <ShoppingBag className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0" />
                <h3 className="font-medium text-amber-800">Shopping Tips</h3>
              </div>
              {showTips ? (
                <ChevronUp className="h-4 w-4 text-amber-600" />
              ) : (
                <ChevronDown className="h-4 w-4 text-amber-600" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2 p-3 bg-amber-50/50 rounded-b-lg border-x border-b border-amber-100">
              <ScrollArea className="max-h-[200px] pr-2">
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
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Preparation Notes */}
      {hasNotes && (
        <Collapsible open={showPrep} onOpenChange={setShowPrep} className="w-full">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex w-full justify-between p-3 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                <h3 className="font-medium text-blue-800">Preparation Notes</h3>
              </div>
              {showPrep ? (
                <ChevronUp className="h-4 w-4 text-blue-600" />
              ) : (
                <ChevronDown className="h-4 w-4 text-blue-600" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2 p-3 bg-blue-50/50 rounded-b-lg border-x border-b border-blue-100">
              <ScrollArea className="max-h-[200px] pr-2">
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
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
