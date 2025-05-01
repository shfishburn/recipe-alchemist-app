
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface NutritionFeedbackProps {
  recipeId: string; 
  ingredientData?: Record<string, any>;
}

export function NutritionFeedback({ recipeId, ingredientData }: NutritionFeedbackProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'accurate' | 'inaccurate' | null>(null);
  const [comment, setComment] = useState('');
  const [ingredientFeedback, setIngredientFeedback] = useState<Record<string, 'correct' | 'incorrect'>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  // Get ingredients with match data for targeted feedback
  const ingredientEntries = ingredientData ? 
    Object.entries(ingredientData)
      .filter(([_, data]) => data?.matched_food)
      .map(([name, data]) => ({
        name,
        matchedFood: data.matched_food,
        confidence: data.confidence_score || 0
      }))
    : [];
  
  const handleIngredientFeedback = (ingredientName: string, status: 'correct' | 'incorrect') => {
    setIngredientFeedback(prev => ({
      ...prev,
      [ingredientName]: status
    }));
  };
  
  const handleSubmitFeedback = async () => {
    if (!user || !recipeId) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('nutrition_feedback').insert({
        recipe_id: recipeId,
        user_id: user.id,
        feedback_type: feedbackType,
        comment,
        ingredient_feedback: ingredientFeedback,
        created_at: new Date().toISOString()
      });
      
      if (error) throw error;
      
      toast({
        title: "Feedback submitted",
        description: "Thank you for helping us improve our nutrition data!",
      });
      
      setIsOpen(false);
      setComment('');
      setFeedbackType(null);
      setIngredientFeedback({});
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs flex items-center gap-1 h-7 px-2 text-muted-foreground hover:text-foreground"
        >
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nutrition Data Feedback</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div>
            <Label>How accurate is the nutrition data?</Label>
            <div className="flex space-x-4 mt-2">
              <Button
                type="button"
                variant={feedbackType === 'accurate' ? 'default' : 'outline'}
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setFeedbackType('accurate')}
              >
                <ThumbsUp className="h-4 w-4" />
                Accurate
              </Button>
              
              <Button
                type="button"
                variant={feedbackType === 'inaccurate' ? 'default' : 'outline'}
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setFeedbackType('inaccurate')}
              >
                <ThumbsDown className="h-4 w-4" />
                Inaccurate
              </Button>
            </div>
          </div>
          
          {ingredientEntries.length > 0 && (
            <div>
              <Label className="mb-2 inline-block">Ingredient Matches</Label>
              <div className="space-y-2 border rounded-md p-2 bg-muted/50">
                {ingredientEntries.map(({ name, matchedFood }) => (
                  <div key={name} className="flex items-center justify-between text-sm">
                    <div className="flex-1">
                      <span className="font-medium">{name}</span>
                      <span className="text-muted-foreground"> → </span>
                      <span>{matchedFood}</span>
                    </div>
                    <RadioGroup 
                      value={ingredientFeedback[name]} 
                      onValueChange={(value) => handleIngredientFeedback(name, value as 'correct' | 'incorrect')}
                      className="flex space-x-2"
                    >
                      <div className="flex items-center">
                        <RadioGroupItem value="correct" id={`${name}-correct`} />
                        <Label htmlFor={`${name}-correct`} className="pl-1 text-xs">✓</Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="incorrect" id={`${name}-incorrect`} />
                        <Label htmlFor={`${name}-incorrect`} className="pl-1 text-xs">✗</Label>
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <Label htmlFor="feedback-comment">Additional Comments</Label>
            <Textarea 
              id="feedback-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1"
              placeholder="Tell us what's incorrect or could be improved..."
            />
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleSubmitFeedback}
            disabled={isSubmitting || !feedbackType}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
