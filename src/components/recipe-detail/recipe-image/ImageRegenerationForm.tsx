
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, RefreshCw, Image } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

interface ImageRegenerationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipeId: string;
  recipeTitle: string;
  onRegenerationComplete: () => void;
}

export function ImageRegenerationForm({
  open,
  onOpenChange,
  recipeId,
  recipeTitle,
  onRegenerationComplete
}: ImageRegenerationFormProps) {
  const [guidance, setGuidance] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to regenerate images",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    try {
      const response = await supabase.functions.invoke('generate-recipe-image', {
        body: {
          recipeId,
          title: recipeTitle,
          guidance,
          referenceUrl: useWebSearch ? referenceUrl : undefined,
          useWebSearch
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to regenerate image');
      }

      toast({
        title: "Image regenerated",
        description: "Your new recipe image has been created successfully"
      });
      
      onRegenerationComplete();
      onOpenChange(false);
    } catch (error) {
      console.error('Error regenerating image:', error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to regenerate image",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Regenerate Recipe Image</DialogTitle>
          <DialogDescription>
            Customize how you want the recipe image to look
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guidance">AI Guidance</Label>
            <Textarea
              id="guidance"
              placeholder="Describe how you want the image to look (e.g., 'Make it more appetizing', 'Show it on a rustic wooden table', 'Use warmer lighting')"
              value={guidance}
              onChange={(e) => setGuidance(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="useWebSearch" 
              checked={useWebSearch} 
              onCheckedChange={(checked) => setUseWebSearch(checked === true)}
            />
            <Label htmlFor="useWebSearch" className="text-sm font-normal cursor-pointer">
              Use web images as reference
            </Label>
          </div>
          
          {useWebSearch && (
            <div className="space-y-2">
              <Label htmlFor="referenceUrl">Reference Image URL (optional)</Label>
              <Input
                id="referenceUrl"
                placeholder="https://example.com/image.jpg"
                type="url"
                value={referenceUrl}
                onChange={(e) => setReferenceUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Provide a URL to a reference image or leave blank to let AI search for relevant images
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isGenerating}
              className="ml-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Image className="mr-2 h-4 w-4" />
                  Regenerate Image
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
