import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { QuickRecipeDisplay } from '@/components/quick-recipe/QuickRecipeDisplay';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { QuickRecipe } from '@/types/quick-recipe';
import { Json } from '@/integrations/supabase/types';

function RecipePreviewPage() {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [recipe, setRecipe] = useState<QuickRecipe | null>(
    state?.recipeData || null
  );

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  const convertToDbFormat = (recipe: QuickRecipe) => {
    const { title, ingredients, instructions, servings, prepTime, cookTime, description, nutrition, tagline } = recipe;

    const ingredientsJson: Json = ingredients.map(ingredient => ({
      qty: ingredient.qty || 1,
      unit: ingredient.unit || '',
      item: typeof ingredient.item === 'string' ? ingredient.item :
            (ingredient.item ? JSON.stringify(ingredient.item) : ''),
      qty_metric: ingredient.qty_metric || ingredient.qty || 1,
      unit_metric: ingredient.unit_metric || ingredient.unit || '',
      qty_imperial: ingredient.qty_imperial || ingredient.qty || 1,
      unit_imperial: ingredient.unit_imperial || ingredient.unit || ''
    })) as Json;

    return {
      title: title,
      tagline: tagline || description,
      servings: servings,
      prep_time_min: prepTime,
      cook_time_min: cookTime,
      ingredients: ingredientsJson,
      instructions: instructions,
      nutrition: nutrition as Json,
      user_id: user?.id
    };
  };

  const handleSave = async (recipe: QuickRecipe) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You must be logged in to save recipes.",
      });
      navigate('/login');
      return;
    }

    setIsSaving(true);
    try {
      const recipeData = convertToDbFormat(recipe);

      const { data: savedRecipe, error } = await supabase
        .from('recipes')
        .insert([recipeData])
        .select()
        .single();

      if (error) {
        console.error("Error saving recipe:", error);
        toast({
          title: "Error Saving Recipe",
          description: "There was an error saving the recipe. Please try again.",
          variant: "destructive",
        });
      } else {
        console.log("Recipe saved successfully:", savedRecipe);
        setSaveSuccess(true);
        toast({
          title: "Recipe Saved!",
          description: "This recipe has been saved to your profile.",
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!recipe) {
    return (
      <div className="container mx-auto mt-10">
        <Helmet>
          <title>Recipe Not Found | Recipe Alchemy</title>
          <meta name="description" content="Recipe not found." />
        </Helmet>
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Recipe Not Found</h2>
            <p className="text-gray-500">The recipe you are looking for could not be found.</p>
            <Link to="/" className="text-blue-600 hover:underline">
              Go back to the homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10">
      <Helmet>
        <title>{recipe.title} Preview | Recipe Alchemy</title>
        <meta name="description" content={`Preview of ${recipe.title}.`} />
      </Helmet>
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:underline">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>
      <QuickRecipeDisplay recipe={recipe} />
      <div className="mt-6 flex justify-center">
        <Button 
          onClick={() => handleSave(recipe)}
          disabled={isSaving || saveSuccess}
        >
          {isSaving ? 'Saving...' : saveSuccess ? 'Saved' : 'Save Recipe'}
        </Button>
      </div>
    </div>
  );
}

export default RecipePreviewPage;
