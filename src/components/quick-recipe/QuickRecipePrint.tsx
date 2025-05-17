
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { PrintRecipe } from './print/PrintRecipe';
import type { QuickRecipe } from '@/types/quick-recipe';

interface QuickRecipePrintProps {
  recipe: QuickRecipe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickRecipePrint({ recipe, open, onOpenChange }: QuickRecipePrintProps) {
  const printRef = useRef<HTMLDivElement>(null);
  
  // Setup react-to-print handler
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `${recipe.title} - Recipe Alchemy`,
    // Do not use onBeforeGetContent, it's not in the UseReactToPrintOptions type
  });
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-0">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-lg">Print Recipe</h2>
          <Button 
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
        
        <div className="overflow-y-auto">
          <div ref={printRef}>
            <PrintRecipe recipe={recipe} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
