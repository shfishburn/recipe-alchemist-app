
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ThumbsUp, ThumbsDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';

interface NutritionFeedbackProps {
  recipeId: string;
  ingredientData?: Record<string, any>;
}

export function NutritionFeedback({ recipeId, ingredientData }: NutritionFeedbackProps) {
  const [open, setOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'accurate' | 'inaccurate' | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to provide feedback",
        variant: "destructive"
      });
      return;
    }

    if (!feedbackType) {
      toast({
        title: "Feedback required",
        description: "Please select whether the nutrition information is accurate or inaccurate",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create feedback entry in database
      const { error } = await supabase
        .from('nutrition_feedback')
        .insert({
          recipe_id: recipeId,
          user_id: user.id,
          feedback_type: feedbackType,
          comment: comment || null,
          ingredient_feedback: ingredientData ? { data: ingredientData } : null,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Thank you!",
        description: "Your feedback helps us improve our nutrition calculations.",
      });

      setOpen(false);
      setFeedbackType(null);
      setComment('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error submitting feedback",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline" 
          size="sm"
          className="flex items-center gap-1 text-xs md:text-sm h-9 md:h-9 px-2 md:px-3"
        >
          <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 mr-1" />
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nutrition Accuracy Feedback</DialogTitle>
          <DialogDescription>
            Is this recipe's nutrition information accurate? Your feedback helps us improve.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 py-4">
          <div className="flex justify-center space-x-4">
            <Button
              variant={feedbackType === 'accurate' ? 'default' : 'outline'}
              onClick={() => setFeedbackType('accurate')}
              className="flex items-center gap-2"
            >
              <ThumbsUp className="h-4 w-4" />
              Accurate
            </Button>
            <Button
              variant={feedbackType === 'inaccurate' ? 'default' : 'outline'}
              onClick={() => setFeedbackType('inaccurate')}
              className="flex items-center gap-2"
            >
              <ThumbsDown className="h-4 w-4" />
              Inaccurate
            </Button>
          </div>
          
          {feedbackType === 'inaccurate' && (
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Additional details (optional)
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Please explain what seems incorrect..."
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!feedbackType || isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
