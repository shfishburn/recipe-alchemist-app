
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function QuickRecipeEmpty() {
  const navigate = useNavigate();
  
  return (
    <div className="text-center">
      <p className="text-muted-foreground">No recipe found. 
        <Button 
          variant="link" 
          onClick={() => navigate('/')}
          className="p-0 h-auto text-primary underline"
        >
          &nbsp;Return to home
        </Button>
      </p>
    </div>
  );
}
