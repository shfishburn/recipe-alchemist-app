
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { QuickRecipe } from '@/types/quick-recipe';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PrintRecipe } from './print/PrintRecipe';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Printer, Loader2 } from 'lucide-react';

export interface QuickRecipePrintProps {
  recipe: QuickRecipe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerPrint?: boolean;
}

export function QuickRecipePrint({
  recipe,
  open,
  onOpenChange,
  triggerPrint = false,
}: QuickRecipePrintProps) {
  const [isPrinting, setIsPrinting] = React.useState(false);
  const componentRef = useRef<HTMLDivElement>(null);
  
  // Setup print handler
  const handlePrint = useReactToPrint({
    documentTitle: `${recipe.title} | Recipe Alchemy`,
    onBeforeGetContent: () => {
      setIsPrinting(true);
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 200);
      });
    },
    onAfterPrint: () => {
      setIsPrinting(false);
      onOpenChange(false);
    },
    // contentRef is the correct property name, not content
    contentRef: componentRef,
  });
  
  // Auto-trigger print if requested
  React.useEffect(() => {
    if (open && triggerPrint && handlePrint) {
      handlePrint();
    }
  }, [open, triggerPrint, handlePrint]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Print: {recipe.title}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 h-full overflow-auto print:h-auto print:overflow-visible">
          <div ref={componentRef} className="p-4 print:p-0">
            <PrintRecipe recipe={recipe} />
          </div>
        </ScrollArea>
        
        <DialogFooter className="mt-4">
          <Button 
            onClick={() => {
              if (handlePrint) handlePrint();
            }}
            disabled={isPrinting}
            className="w-full sm:w-auto"
          >
            {isPrinting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preparing...
              </>
            ) : (
              <>
                <Printer className="mr-2 h-4 w-4" />
                Print Recipe
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
