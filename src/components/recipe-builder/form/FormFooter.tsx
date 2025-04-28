
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Loader2 } from 'lucide-react';

interface FormFooterProps {
  onPreview: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  hasGenerated: boolean;
}

const FormFooter = ({ onPreview, onSubmit, isLoading, hasGenerated }: FormFooterProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onPreview}
        className="w-full sm:w-auto flex items-center justify-center"
        disabled={isLoading}
      >
        <Eye className="mr-2 h-4 w-4" />
        Preview Selection
      </Button>
      
      {!hasGenerated && (
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-recipe-blue hover:bg-recipe-blue/90 w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Your Recipe...
            </>
          ) : (
            'Create My Recipe'
          )}
        </Button>
      )}
    </div>
  );
};

export default FormFooter;
