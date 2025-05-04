
import { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ImageDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  title: string;
  onError: () => void;
}

export function ImageDrawer({ open, onOpenChange, imageUrl, title, onError }: ImageDrawerProps) {
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
            <DrawerDescription>Full image view</DrawerDescription>
            <DrawerClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DrawerClose>
          </DrawerHeader>
          <div className="flex flex-col items-center justify-center p-4 pt-0">
            <img
              src={imageUrl}
              alt={title}
              className="max-h-[60vh] object-contain rounded-md"
              onError={onError}
            />
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Reduce Size" : "Expand View"}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
