
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ListCheck, Settings2, Pill, BookOpen } from 'lucide-react';
import type { ChangesResponse } from '@/types/chat';

interface ChangesSummaryProps {
  changes: ChangesResponse;
  onClick?: () => void;
}

export function ChangesSummary({ changes, onClick }: ChangesSummaryProps) {
  // Count how many different types of changes are being suggested
  const changeCount = [
    !!changes.title, 
    !!changes.tagline || !!changes.description,
    changes.ingredients?.mode !== 'none' && changes.ingredients?.items?.length > 0,
    changes.instructions && changes.instructions.length > 0,
    changes.science_notes && changes.science_notes.length > 0,
    !!changes.nutrition
  ].filter(Boolean).length;
  
  if (changeCount === 0) {
    return null;
  }
  
  return (
    <Card 
      className={`p-3 mb-2 border-l-4 border-l-blue-500 ${onClick ? 'cursor-pointer hover:bg-blue-50 transition-colors' : ''}`}
      onClick={onClick}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-blue-700">
            {changeCount > 1 ? `${changeCount} Changes Suggested` : '1 Change Suggested'}
          </h4>
          <Badge variant="outline" className="text-xs font-normal">
            Review &amp; Apply
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {changes.title && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Settings2 className="w-3 h-3" />
              <span>Title</span>
            </Badge>
          )}
          
          {(changes.tagline || changes.description) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Settings2 className="w-3 h-3" />
              <span>Description</span>
            </Badge>
          )}
          
          {changes.ingredients && changes.ingredients.mode !== 'none' && changes.ingredients.items && changes.ingredients.items.length > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <ListCheck className="w-3 h-3" />
              <span>
                {changes.ingredients.mode === 'replace' ? 'Replace' : 'Add'} {changes.ingredients.items.length} {changes.ingredients.items.length === 1 ? 'ingredient' : 'ingredients'}
              </span>
            </Badge>
          )}
          
          {changes.instructions && changes.instructions.length > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>{changes.instructions.length} {changes.instructions.length === 1 ? 'step' : 'steps'}</span>
            </Badge>
          )}
          
          {changes.nutrition && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Pill className="w-3 h-3" />
              <span>Nutrition</span>
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
