
import React, { useState, useRef, useEffect } from 'react';
import { useRecipeModifications } from '@/hooks/use-recipe-modifications';
import { QuickRecipe } from '@/types/quick-recipe';
import { QuickRecipeNutritionSummary } from './nutrition/QuickRecipeNutritionSummary';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ErrorDisplay } from '@/components/ui/error-display';
import { Separator } from '@/components/ui/separator';
import { send, MessagesSquare, Check, X, PanelLeftClose, ArrowUpRight, Undo2 } from 'lucide-react';
import { toast } from 'sonner';

interface QuickRecipeModifierProps {
  recipe: QuickRecipe;
  onModifiedRecipe?: (recipe: QuickRecipe) => void;
}

export function QuickRecipeModifier({ recipe, onModifiedRecipe }: QuickRecipeModifierProps) {
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Use our custom hook for recipe modifications
  const {
    status,
    error,
    modifications,
    modifiedRecipe,
    modificationRequest,
    modificationHistory,
    isModified,
    requestModifications,
    applyModifications,
    rejectModifications,
    cancelRequest,
    resetToOriginal
  } = useRecipeModifications(recipe);
  
  // Notify parent component when recipe is modified
  useEffect(() => {
    if (isModified && onModifiedRecipe) {
      onModifiedRecipe(modifiedRecipe);
    }
  }, [isModified, modifiedRecipe, onModifiedRecipe]);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [modificationHistory.length, modifications]);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) {
      toast({ 
        title: "Empty request",
        description: "Please enter a modification request"
      });
      return;
    }
    
    // Request modifications with the immediate flag set to true
    requestModifications(trimmedValue, true);
    setInputValue('');
    
    // Focus back on input after sending
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };
  
  // Handle key press in textarea
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter without Shift
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  // Render modification history items
  const renderHistoryItems = () => {
    if (modificationHistory.length === 0) {
      return (
        <div className="flex items-center justify-center h-24 text-muted-foreground">
          <p>No modification requests yet</p>
        </div>
      );
    }
    
    return modificationHistory.map((entry, index) => (
      <div key={index} className="space-y-4">
        {/* User request */}
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
            <span className="text-sm font-medium">You</span>
          </div>
          <div className="flex-1">
            <p className="bg-muted rounded-lg p-3 text-sm">{entry.request}</p>
          </div>
        </div>

        {/* AI response */}
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <MessagesSquare className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <div className="bg-primary/10 rounded-lg p-3 text-sm">
              <p className="mb-2">{entry.response.reasoning}</p>
              
              {/* Status indicator for this modification */}
              <div className="mt-3 text-xs flex items-center gap-1">
                <Badge 
                  variant={entry.applied ? "outline" : "secondary"}
                  className={entry.applied ? "bg-green-50 text-green-700 border-green-200" : ""}
                >
                  {entry.applied ? "Applied" : "Not applied"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        {/* Separator between conversations except for the last one */}
        {index < modificationHistory.length - 1 && (
          <Separator className="my-4" />
        )}
      </div>
    ));
  };

  // Render pending message if there's a current request
  const renderPendingMessage = () => {
    if (status !== 'loading') return null;
    
    return (
      <div className="space-y-4">
        {/* User message */}
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
            <span className="text-sm font-medium">You</span>
          </div>
          <div className="flex-1">
            <p className="bg-muted rounded-lg p-3 text-sm">{modificationRequest}</p>
          </div>
        </div>

        {/* AI typing indicator */}
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <MessagesSquare className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <div className="bg-primary/10 rounded-lg p-3 text-sm animate-pulse">
              <div className="flex items-center gap-1">
                <div className="bg-primary/25 h-2 w-2 rounded-full animate-bounce"></div>
                <div className="bg-primary/25 h-2 w-2 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="bg-primary/25 h-2 w-2 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render current modification if there's one
  const renderCurrentModification = () => {
    if (!modifications || status !== 'success') return null;
    
    return (
      <div className="space-y-4">
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <MessagesSquare className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <div className="bg-primary/10 rounded-lg p-3 text-sm">
              <p className="mb-2">{modifications.reasoning}</p>
              
              {/* Proposed modifications summary */}
              <div className="mt-3 p-2 bg-background rounded border">
                <h4 className="font-medium text-xs uppercase text-muted-foreground mb-1">Proposed Changes:</h4>
                <ul className="text-xs space-y-1 list-disc pl-4">
                  {modifications.modifications.title && (
                    <li>Change title to "{modifications.modifications.title}"</li>
                  )}
                  {modifications.modifications.description && (
                    <li>Update description</li>
                  )}
                  {modifications.modifications.ingredients && (
                    <li>
                      {modifications.modifications.ingredients.length} ingredient {modifications.modifications.ingredients.length === 1 ? 'change' : 'changes'}
                    </li>
                  )}
                  {modifications.modifications.steps && (
                    <li>
                      {modifications.modifications.steps.length} step {modifications.modifications.steps.length === 1 ? 'change' : 'changes'}
                    </li>
                  )}
                  <li className="mt-2">
                    <span className="font-medium">Nutrition impact: </span>
                    {modifications.nutritionImpact.summary}
                  </li>
                </ul>
              </div>
              
              {/* Action buttons */}
              <div className="mt-3 flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={rejectModifications}
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button 
                  size="sm"
                  onClick={applyModifications}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Apply Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <Card className="border-2 border-recipe-green/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Recipe Modifications</span>
          {isModified && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetToOriginal}
              className="text-xs h-7 gap-1"
            >
              <Undo2 className="h-3 w-3" />
              Reset All Changes
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <Tabs defaultValue="chat" className="px-4">
        <TabsList className="mb-2 grid grid-cols-2 h-9">
          <TabsTrigger value="chat" className="text-xs">
            <MessagesSquare className="h-3.5 w-3.5 mr-1.5" />
            Modification Chat
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="text-xs">
            <PanelLeftClose className="h-3.5 w-3.5 mr-1.5" />
            Nutrition Summary
          </TabsTrigger>
        </TabsList>
        
        {/* Chat tab */}
        <TabsContent value="chat" className="p-0 pt-2">
          <div className="h-[350px] flex flex-col">
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="space-y-4 pb-2">
                {/* Messages */}
                {renderHistoryItems()}
                
                {/* Pending message */}
                {renderPendingMessage()}
                
                {/* Current modification */}
                {renderCurrentModification()}
                
                {/* Error message */}
                {status === 'error' && error && (
                  <ErrorDisplay 
                    error={error} 
                    variant="inline" 
                    size="sm"
                    onRetry={() => requestModifications(modificationRequest, true)}
                  />
                )}
                
                {/* Scroll anchor */}
                <div ref={chatEndRef} />
              </div>
            </div>
            
            {/* Input form */}
            <form onSubmit={handleSubmit} className="mt-3">
              <div className="relative">
                <Textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Modify recipe (e.g., 'Make this recipe low-carb')"
                  className="pr-12 min-h-[80px] resize-none"
                  disabled={status === 'loading' || status === 'applying'}
                />
                <Button
                  size="sm"
                  type="submit"
                  disabled={status === 'loading' || status === 'applying' || !inputValue.trim()}
                  className="absolute bottom-2 right-2 h-8 w-8 p-0"
                >
                  <send className="h-4 w-4" />
                </Button>
              </div>
              
              {status === 'loading' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={cancelRequest}
                  className="mt-2 w-full"
                >
                  Cancel
                </Button>
              )}
            </form>
          </div>
        </TabsContent>
        
        {/* Nutrition tab */}
        <TabsContent value="nutrition" className="pt-2 pb-0 px-0">
          <QuickRecipeNutritionSummary 
            recipe={modifiedRecipe}
            nutritionImpact={status === 'success' ? modifications?.nutritionImpact : undefined}
          />
          
          <div className="mt-3 text-xs text-center text-muted-foreground">
            <p>
              {isModified 
                ? "The recipe has been modified. This may affect the nutritional content."
                : "No modifications have been applied yet."}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

// Import Badge from Shadcn UI
function Badge({ children, variant = 'default', className = '' }) {
  const baseStyles = 'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset';
  
  const variantStyles = {
    default: 'bg-primary/10 text-primary ring-primary/20',
    secondary: 'bg-secondary text-secondary-foreground ring-secondary/20',
    destructive: 'bg-destructive/10 text-destructive ring-destructive/20',
    outline: 'bg-background text-foreground ring-border',
  };
  
  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
