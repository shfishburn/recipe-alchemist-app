
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/recipe';

interface RecipeAnalysisProps {
  recipe: Recipe;
  isVisible: boolean;
}

export function RecipeAnalysis({ recipe, isVisible }: RecipeAnalysisProps) {
  const { data: analysis, isLoading } = useQuery({
    queryKey: ['recipe-analysis', recipe.id],
    queryFn: async () => {
      if (!isVisible) return null;
      
      const { data, error } = await supabase.functions.invoke('recipe-chat', {
        body: { 
          recipe,
          userMessage: "Please provide a detailed scientific analysis of this recipe, including chemical processes, cooking techniques, and troubleshooting tips.",
          sourceType: 'analysis'
        }
      });

      if (error) throw error;
      return data;
    },
    enabled: isVisible,
  });

  if (!isVisible) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Scientific Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            {analysis?.generatedText || 'No analysis available'}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
