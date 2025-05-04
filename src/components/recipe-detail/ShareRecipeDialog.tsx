
import React, { useState } from 'react';
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Mail, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Recipe } from '@/types/recipe';

interface ShareRecipeDialogProps {
  recipe: Recipe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareRecipeDialog({ recipe, open, onOpenChange }: ShareRecipeDialogProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  // Generate shareable link
  const recipeUrl = `${window.location.origin}/recipes/${recipe.slug || recipe.id}`;
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(recipeUrl);
      setCopied(true);
      toast({
        title: "Link copied",
        description: "Recipe link copied to clipboard",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast({
        title: "Copy failed",
        description: "Could not copy link to clipboard",
        variant: "destructive",
      });
    }
  };
  
  const handleShareViaEmail = () => {
    const subject = encodeURIComponent(`Check out this recipe: ${recipe.title}`);
    const body = encodeURIComponent(`I thought you might like this recipe for ${recipe.title}:\n\n${recipeUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>Share Recipe</DrawerTitle>
          <DrawerDescription>
            Share this recipe with friends and family
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 py-2">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="link">Recipe Link</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="link"
                  value={recipeUrl}
                  readOnly
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  size="icon" 
                  onClick={handleCopyLink}
                  className="flex-shrink-0"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Label>Share Options</Label>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={handleShareViaEmail}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={handleCopyLink}
                >
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Copy Link
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
