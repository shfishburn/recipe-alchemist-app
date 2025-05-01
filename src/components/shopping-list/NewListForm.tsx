
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface NewListFormProps {
  newListTitle: string;
  onNewListTitleChange: (value: string) => void;
  onCreateList: () => void;
}

export function NewListForm({ 
  newListTitle, 
  onNewListTitleChange, 
  onCreateList 
}: NewListFormProps) {
  return (
    <div className="flex space-x-2">
      <Input 
        placeholder="New shopping list name" 
        value={newListTitle}
        onChange={(e) => onNewListTitleChange(e.target.value)}
      />
      <Button 
        onClick={onCreateList}
        disabled={!newListTitle.trim()}
      >
        <Plus className="h-4 w-4 mr-1" />
        Create
      </Button>
    </div>
  );
}
