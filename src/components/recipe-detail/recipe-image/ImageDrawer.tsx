
import { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, ImagePlus, Edit, X } from 'lucide-react';

interface ImageDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string | null;
  imageError: boolean;
  title: string;
  onError: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
  onCustomize: () => void;
}

export function ImageDrawer({ 
  open, 
  onOpenChange, 
  imageUrl, 
  imageError,
  title, 
  onError,
  onGenerate,
  isGenerating,
  onCustomize
}: ImageDrawerProps) {
  const [expanded, setExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Safe mounting/unmounting lifecycle
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  // Don't render when not mounted
  if (!isMounted) return null;

  return (
    <Drawer 
      open={open} 
      onOpenChange={(value) => {
        if (onOpenChange) {
          // Short delay to allow animations to complete before state changes
          setTimeout(() => onOpenChange(value), 50);
        }
      }}
    >
      <DrawerContent className={expanded ? "h-[95vh]" : "h-[70vh] drawer-content image-view-touch"}>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="text-center">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>
              {imageUrl && !imageError ? "Recipe Image" : "Generate Recipe Image"}
            </DrawerDescription>
            <DrawerClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DrawerClose>
          </DrawerHeader>
          
          <div className="flex flex-col items-center justify-center px-4 pb-6 pt-0">
            {imageUrl && !imageError ? (
              <>
                <img
                  src={imageUrl}
                  alt={title}
                  className="max-h-[40vh] object-contain rounded-md"
                  onError={onError}
                />
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? "Reduce Size" : "Expand View"}
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <ImagePlus className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Generate Recipe Image</h3>
                <p className="text-muted-foreground mb-6">
                  Create a beautiful AI-generated image for your recipe
                </p>
              </div>
            )}
          </div>
          
          <DrawerFooter className="px-4 pb-8">
            <div className="flex flex-wrap justify-center gap-2">
              {imageUrl && !imageError ? (
                <>
                  <Button
                    onClick={onCustomize}
                    variant="outline"
                    className="text-muted-foreground hover:text-foreground hover:bg-muted touch-target-base"
                    disabled={isGenerating}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Customize
                  </Button>
                  <Button
                    onClick={onGenerate}
                    disabled={isGenerating}
                    variant="secondary"
                    className="bg-recipe-blue text-white hover:bg-recipe-blue/80 touch-target-base"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Regenerate
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={onGenerate}
                  disabled={isGenerating}
                  variant="secondary"
                  className="bg-recipe-blue text-white hover:bg-recipe-blue/80 touch-target-base w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <ImagePlus className="mr-2 h-4 w-4" />
                      Generate Image
                    </>
                  )}
                </Button>
              )}
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
