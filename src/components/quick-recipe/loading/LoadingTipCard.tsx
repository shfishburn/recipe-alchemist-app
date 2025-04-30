
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChefHat, Clock, Star, CircleCheck } from 'lucide-react';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';

interface Tip {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function LoadingTipCard() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const { formData } = useQuickRecipeStore();
  
  // Generic tips that work for all cuisines
  const genericTips: Tip[] = [
    {
      icon: <ChefHat className="h-5 w-5 text-recipe-green" />,
      title: "Preparation is Key",
      description: "Read through the recipe completely before starting to cook."
    },
    {
      icon: <Clock className="h-5 w-5 text-recipe-orange" />,
      title: "Timing Matters",
      description: "For best results, prepare all ingredients before cooking begins."
    },
    {
      icon: <Star className="h-5 w-5 text-recipe-yellow" />,
      title: "Flavor Enhancement",
      description: "Season throughout cooking, not just at the end."
    },
    {
      icon: <CircleCheck className="h-5 w-5 text-recipe-blue" />,
      title: "Quality Ingredients",
      description: "Fresh ingredients make a noticeable difference in flavor."
    }
  ];
  
  // Cuisine-specific tips
  const cuisineTips: Record<string, Tip[]> = {
    'italian': [
      {
        icon: <Star className="h-5 w-5 text-recipe-orange" />,
        title: "Italian Cuisine Tip",
        description: "Use extra virgin olive oil for the best authentic flavor."
      },
      {
        icon: <ChefHat className="h-5 w-5 text-recipe-green" />,
        title: "Pasta Perfection",
        description: "Salt your pasta water until it tastes like the sea."
      }
    ],
    'mexican': [
      {
        icon: <Star className="h-5 w-5 text-recipe-orange" />,
        title: "Mexican Cuisine Tip",
        description: "Toast your spices before using them to enhance their flavors."
      },
      {
        icon: <ChefHat className="h-5 w-5 text-recipe-green" />,
        title: "Authentic Flavor",
        description: "Use lime juice to brighten flavors just before serving."
      }
    ],
    'asian': [
      {
        icon: <Star className="h-5 w-5 text-recipe-orange" />,
        title: "Asian Cuisine Tip",
        description: "Have all ingredients prepped before starting - stir-fries cook quickly!"
      },
      {
        icon: <ChefHat className="h-5 w-5 text-recipe-green" />,
        title: "Rice Perfect",
        description: "Rinse rice until water runs clear for fluffier results."
      }
    ],
    'indian': [
      {
        icon: <Star className="h-5 w-5 text-recipe-orange" />,
        title: "Indian Cuisine Tip",
        description: "Bloom your spices in hot oil to release their full flavor."
      },
      {
        icon: <ChefHat className="h-5 w-5 text-recipe-green" />,
        title: "Curry Secret",
        description: "Add a splash of cream at the end to balance spicy curries."
      }
    ],
    'mediterranean': [
      {
        icon: <Star className="h-5 w-5 text-recipe-orange" />,
        title: "Mediterranean Cuisine Tip",
        description: "Use fresh herbs abundantly for authentic Mediterranean flavors."
      },
      {
        icon: <ChefHat className="h-5 w-5 text-recipe-green" />,
        title: "Healthy Choice",
        description: "Olive oil and lemon juice make a simple, healthy dressing."
      }
    ]
  };
  
  // Ingredient-specific nutrition tips
  const ingredientTips: Record<string, Tip> = {
    'chicken': {
      icon: <CircleCheck className="h-5 w-5 text-recipe-blue" />,
      title: "Chicken Nutrition",
      description: "High in protein and low in fat, especially without the skin."
    },
    'salmon': {
      icon: <CircleCheck className="h-5 w-5 text-recipe-blue" />,
      title: "Salmon Nutrition",
      description: "Rich in omega-3 fatty acids that support heart health."
    },
    'beef': {
      icon: <CircleCheck className="h-5 w-5 text-recipe-blue" />,
      title: "Beef Nutrition",
      description: "Excellent source of iron, zinc and vitamin B12."
    },
    'tofu': {
      icon: <CircleCheck className="h-5 w-5 text-recipe-blue" />,
      title: "Tofu Nutrition",
      description: "Great plant-based protein source with all essential amino acids."
    },
    'lentils': {
      icon: <CircleCheck className="h-5 w-5 text-recipe-blue" />,
      title: "Lentil Nutrition",
      description: "High in fiber and plant protein with low glycemic impact."
    },
    'quinoa': {
      icon: <CircleCheck className="h-5 w-5 text-recipe-blue" />,
      title: "Quinoa Nutrition",
      description: "Complete protein containing all nine essential amino acids."
    },
    'avocado': {
      icon: <CircleCheck className="h-5 w-5 text-recipe-blue" />,
      title: "Avocado Nutrition",
      description: "Rich in healthy fats and potassium for heart health."
    }
  };
  
  // Get all applicable tips based on form data
  const getAllTips = (): Tip[] => {
    let tips = [...genericTips];
    
    // Add cuisine-specific tips if we have cuisine data
    if (formData?.cuisine && formData.cuisine.length > 0) {
      formData.cuisine.forEach(cuisine => {
        const cuisineLower = cuisine.toLowerCase();
        if (cuisineTips[cuisineLower]) {
          tips = [...tips, ...cuisineTips[cuisineLower]];
        }
      });
    }
    
    // Add ingredient-specific tip if we have a main ingredient
    if (formData?.mainIngredient) {
      const ingredient = formData.mainIngredient.toLowerCase();
      // Check for exact or partial matches
      const matchedIngredient = Object.keys(ingredientTips).find(key => 
        ingredient.includes(key) || key.includes(ingredient)
      );
      
      if (matchedIngredient && ingredientTips[matchedIngredient]) {
        tips.push(ingredientTips[matchedIngredient]);
      }
    }
    
    return tips;
  };
  
  // Get all applicable tips
  const tips = getAllTips();
  
  // Rotate through tips
  useEffect(() => {
    if (tips.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % tips.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [tips.length]);
  
  // If no tips, don't render
  if (tips.length === 0) return null;
  
  const currentTip = tips[currentTipIndex];
  
  return (
    <Card className="bg-white/90 shadow-sm border-slate-100">
      <CardContent className="p-4 flex flex-col items-center text-center">
        <div className="mb-2">
          {currentTip.icon}
        </div>
        <h4 className="text-sm font-medium mb-1">{currentTip.title}</h4>
        <p className="text-xs text-muted-foreground">{currentTip.description}</p>
        
        {/* Tip counter dots */}
        {tips.length > 1 && (
          <div className="flex gap-1 mt-3">
            {tips.map((_, index) => (
              <div 
                key={index}
                className={`h-1.5 w-1.5 rounded-full ${currentTipIndex === index ? 'bg-primary' : 'bg-slate-200'}`}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
