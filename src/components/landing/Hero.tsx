import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Sparkles } from "lucide-react"
import { apiRequest } from '@/lib/api-client';
import { RecipeCarousel } from './RecipeCarousel';
import type { Recipe } from '@/types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
}

function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  return (
    <Card
      className="w-full max-w-sm mx-auto cursor-pointer hover:shadow-md transition-shadow duration-300"
      onClick={() => onClick(recipe)}
    >
      <CardHeader>
        <CardTitle>{recipe.title}</CardTitle>
        <CardDescription>{recipe.tagline}</CardDescription>
      </CardHeader>
      <CardContent>
        <img
          src={recipe.image_url}
          alt={recipe.title}
          className="w-full h-48 object-cover rounded-md"
        />
      </CardContent>
    </Card>
  );
}

export function Hero() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [ingredients, setIngredients] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const [featuredRecipes, setFeaturedRecipes] = useState<any[]>([]);

  useEffect(() => {
    const fetchFeaturedRecipes = async () => {
      try {
        const response = await apiRequest<any[]>('/api/featured-recipes');
        setFeaturedRecipes(response);
      } catch (error) {
        console.error("Error fetching featured recipes:", error);
        toast({
          title: "Error fetching recipes",
          description: "Failed to load featured recipes. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchFeaturedRecipes();
  }, [toast]);

  const handleGenerateRecipe = async () => {
    if (!ingredients.trim()) {
      toast({
        title: "Missing ingredients",
        description: "Please enter some ingredients to generate a recipe.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiRequest<{ id: string }>('/api/generate-recipe', {
        method: 'POST',
        body: { ingredients },
      });

      if (response?.id) {
        navigate(`/recipes/${response.id}`);
      } else {
        toast({
          title: "Recipe generation failed",
          description: "Failed to generate a recipe. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating recipe:", error);
      toast({
        title: "Error generating recipe",
        description: "An error occurred while generating the recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRecipeClick = (recipe: Recipe) => {
    if (recipe?.id) {
      navigate(`/recipes/${recipe.id}`);
    } else {
      toast({
        title: "Recipe ID missing",
        description: "This recipe does not have a valid ID.",
        variant: "destructive",
      });
    }
  };

  // Helper function to transform featuredRecipes to correct format
  const mapToRecipeType = (recipes: any[]): Recipe[] => {
  return recipes.map(recipe => ({
    id: recipe.id || String(Math.random()),
    title: recipe.title || 'Untitled Recipe',
    tagline: recipe.tagline || recipe.description || '',
    ingredients: recipe.ingredients || [],
    instructions: recipe.instructions || recipe.steps || [],
    servings: recipe.servings || 4,
    image_url: recipe.image_url || '',
    // Include other required fields with defaults
    cuisine: recipe.cuisine || '',
    cuisine_category: recipe.cuisine_category || 'Global',
    user_id: recipe.user_id || '',
    created_at: recipe.created_at || new Date().toISOString(),
    updated_at: recipe.updated_at || new Date().toISOString(),
    science_notes: recipe.science_notes || []
  }));
};

  // Update the section that renders the RecipeCarousel
  const renderFeatureSection = () => {
    if (featuredRecipes && featuredRecipes.length > 0) {
      const formattedRecipes = mapToRecipeType(featuredRecipes);
      return (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 text-center">Featured Recipes</h2>
          <RecipeCarousel 
            recipes={formattedRecipes} 
            onRecipeClick={handleRecipeClick}
            className="max-w-5xl mx-auto"
          />
        </div>
      );
    }
    return null;
  };

  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 items-center md:grid-cols-2">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Unlock Culinary Magic with AI
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Simply provide your ingredients, and our AI will craft a unique
              recipe tailored just for you.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                type="text"
                placeholder="Enter your ingredients (e.g., chicken, rice, vegetables)"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="w-full md:w-auto"
              />
              <Button
                size="lg"
                className="w-full md:w-auto"
                onClick={handleGenerateRecipe}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Recipe
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="/hero-image.webp"
              alt="Delicious Recipe"
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
        {renderFeatureSection()}
      </div>
    </section>
  );
}

// Add default export for lazy loading compatibility
export default Hero;
