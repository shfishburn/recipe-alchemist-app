
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useRecipeModifications } from '@/hooks/use-recipe-modifications';
import { QuickRecipe } from '@/types/quick-recipe';
import { IngredientList } from './ingredient/IngredientList';
import { StepList } from './step/StepList';
import { NutritionSummary } from './NutritionSummary';
import { RecipeDisplay } from './RecipeDisplay';
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner";
import { useAuth } from '@/hooks/use-auth';
import { useAuthDrawer } from '@/hooks/use-auth-drawer';
import { LogIn, UserPlus } from 'lucide-react';

interface QuickRecipeModifierProps {
  recipe: QuickRecipe;
  onModifiedRecipe?: (modifiedRecipe: QuickRecipe) => void;
}

export const QuickRecipeModifier: React.FC<QuickRecipeModifierProps> = ({ recipe, onModifiedRecipe }) => {
  const [request, setRequest] = useState('');
  const [immediate, setImmediate] = useState(false);
  const { session } = useAuth();
  const { open: openAuthDrawer } = useAuthDrawer();
  
  // Check for saved request in localStorage
  useEffect(() => {
    const savedRequest = localStorage.getItem('recipe_modification_request');
    if (savedRequest) {
      setRequest(savedRequest);
      // Clear the saved request to prevent it from showing up on every load
      localStorage.removeItem('recipe_modification_request');
    }
  }, []);

  // Save request to localStorage when user is not authenticated and tries to submit
  const saveRequestToLocalStorage = () => {
    if (request.trim()) {
      localStorage.setItem('recipe_modification_request', request);
      localStorage.setItem('recipe_modification_page', window.location.pathname);
    }
  };

  // Handle auth flow
  const handleLogin = () => {
    saveRequestToLocalStorage();
    openAuthDrawer();
  };

  // If user is not authenticated, show auth overlay
  if (!session) {
    return (
      <Card className="relative">
        <CardHeader>
          <CardTitle>Recipe Modification</CardTitle>
          <CardDescription>
            Personalize and improve your recipes with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px] flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md mx-auto p-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Sign in to modify recipes</h3>
              <p className="text-muted-foreground">
                You must be signed in to use the AI-powered recipe editor. Log in now to unlock personalized tweaks, 
                save your history, and get the most out of your AI Cooking Coach.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleLogin} className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                <span>Log In</span>
              </Button>
              <Button onClick={handleLogin} variant="outline" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Sign Up</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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

  // Fix the type comparison error for status === "success" vs "applying"
  // Using type-safe comparison instead of direct string comparison
  const isModificationSuccessful = status === 'success';
  const isApplyingModifications = status === 'applying';

  // Add a callback to notify parent component when modifications are applied
  const handleApplyModifications = useCallback(() => {
    applyModifications();
    if (onModifiedRecipe && modifiedRecipe) {
      onModifiedRecipe(modifiedRecipe);
      toast("Modifications Applied", {
        description: "Your recipe modifications have been applied successfully."
      });
    }
  }, [applyModifications, modifiedRecipe, onModifiedRecipe]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Request Input and Controls */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Recipe Modification Request</CardTitle>
            <CardDescription>Enter your modification request below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="request">Modification Request</Label>
              <Textarea
                id="request"
                placeholder="Make it healthier, reduce carbs, etc."
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                disabled={status === 'loading' || status === 'applying'}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="immediate">Immediate</Label>
              <Switch
                id="immediate"
                checked={immediate}
                onCheckedChange={setImmediate}
                disabled={status === 'loading' || status === 'applying'}
              />
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button
              variant="outline"
              onClick={() => requestModifications(request, immediate)}
              disabled={status === 'loading' || status === 'applying'}
            >
              {status === 'loading' ? 'Loading...' : 'Request Modifications'}
            </Button>
            {status === 'loading' && (
              <Button variant="destructive" onClick={cancelRequest}>
                Cancel
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Status and Error Display */}
        {status === 'error' && (
          <Badge variant="destructive">Error: {error}</Badge>
        )}
        {status === 'not-deployed' && (
          <Badge variant="destructive">Service Not Deployed: {error}</Badge>
        )}
        {status === 'canceled' && (
          <Badge variant="secondary">Request Canceled</Badge>
        )}

        {/* Modification History */}
        {modificationHistory.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="history">
              <AccordionTrigger>Modification History</AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="h-[300px] w-full rounded-md border">
                  <div className="p-4 space-y-4">
                    {modificationHistory.map((entry, index) => (
                      <Card key={index} className="shadow-sm">
                        <CardHeader>
                          <CardTitle>Request: {entry.request}</CardTitle>
                          <CardDescription>Timestamp: {entry.timestamp}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>Reasoning: {entry.response.reasoning}</p>
                          <p>Applied: {entry.applied ? 'Yes' : 'No'}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>

      {/* Recipe Display and Modification Controls */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Modified Recipe</CardTitle>
            <CardDescription>View the modified recipe and apply changes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RecipeDisplay recipe={modifiedRecipe} />
            {modifications && (
              <NutritionSummary nutrition={modifications.nutritionImpact} />
            )}
          </CardContent>
          <CardFooter className="justify-between">
            {isModificationSuccessful && (
              <>
                <Button onClick={handleApplyModifications} disabled={isApplyingModifications}>
                  {isApplyingModifications ? 'Applying...' : 'Apply Modifications'}
                </Button>
                <Button variant="secondary" onClick={rejectModifications}>
                  Reject Modifications
                </Button>
              </>
            )}
            <Button variant="destructive" onClick={resetToOriginal} disabled={status === 'loading' || status === 'applying'}>
              Reset to Original
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
