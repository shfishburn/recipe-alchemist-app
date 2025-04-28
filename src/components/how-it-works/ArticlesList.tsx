
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ChefHat, Leaf, Lightbulb, Utensils, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ReadTimeDisplay } from './ReadTimeDisplay';

interface Article {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  slug: string;
  keywords: string[];
}

export const ArticlesList = () => {
  const navigate = useNavigate();
  
  const articles: Article[] = [
    {
      id: 'intelligent-cooking',
      title: 'How Nutrition Analysis Works',
      description: 'We don\'t guess what\'s in your food — we measure it with real science. Our system pulls data from trusted sources like USDA FoodData Central, adjusts for cooking methods, tracks both macronutrients and vital micronutrients, and personalizes your nutrition to your body\'s needs. Every recipe you see reflects not just what you cook — but how it truly nourishes you.',
      icon: <Lightbulb className="h-10 w-10 text-recipe-blue" />,
      slug: 'intelligent-cooking',
      keywords: ['nutrition analysis', 'USDA FoodData', 'macronutrients', 'micronutrients', 'personalized nutrition']
    },
    {
      id: 'nutrition-tracking',
      title: 'How Our AI Crafts Smarter Recipes',
      description: 'Our AI builds recipes with real food science — using trusted nutrition data, cooking chemistry, and precision techniques to create meals that are not just delicious, but deeply nourishing. Real science. Real flavor. Real life.',
      icon: <ChefHat className="h-10 w-10 text-recipe-green" />,
      slug: 'nutrition-tracking',
      keywords: ['AI cooking', 'food science', 'recipe generation', 'nutrition data', 'cooking chemistry', 'precision cooking']
    },
    {
      id: 'personalized-nutrition',
      title: 'How We Align Every Recipe to Your Health Goals',
      description: 'Your body is unique — and your food should be too. We start by understanding your energy needs and nutrition goals, from daily calorie targets to protein, carb, and fat ratios. Every recipe we build then adapts to you, balancing macronutrients and key vitamins and minerals, while weaving in smart ingredient choices that boost nutrient absorption naturally.',
      icon: <Activity className="h-10 w-10 text-recipe-purple" />,
      slug: 'personalized-nutrition',
      keywords: ['personalized nutrition', 'health goals', 'macronutrient balance', 'nutrient absorption', 'bioavailability', 'TDEE', 'BMR']
    },
    {
      id: 'substitutions',
      title: 'Smart Ingredient Substitutions',
      description: 'Great cooking isn\'t rigid — it\'s flexible, creative, and alive. With our AI assistant, you can customize recipes in real time, making smart ingredient swaps that preserve flavor, structure, and nutrition. Whether you\'re cooking dairy-free, swapping to whole grains, or adjusting for allergies, our system guides you with real food science — so your meals stay joyful, nourishing, and entirely yours.',
      icon: <Utensils className="h-10 w-10 text-recipe-orange" />,
      slug: 'substitutions',
      keywords: ['ingredient substitutions', 'flavor profiles', 'nutrition balance', 'AI cooking', 'recipe alternatives']
    }
  ];
  
  const handleNavigate = (slug: string) => {
    navigate(`/how-it-works/${slug}`);
  };
  
  return (
    <section aria-labelledby="articles-section" className="py-8">
      <div className="sr-only" id="articles-section">Recipe Alchemist Knowledge Articles</div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {articles.map((article) => {
          return (
            <Card 
              key={article.id} 
              className="flex flex-col h-full hover:shadow-lg transition-shadow"
              itemScope
              itemType="http://schema.org/Article"
            >
              <meta itemProp="keywords" content={article.keywords.join(', ')} />
              <CardHeader className="pb-4">
                <div className="mb-4 flex justify-center" aria-hidden="true">
                  {article.icon}
                </div>
                <CardTitle className="text-xl text-center" itemProp="headline">{article.title}</CardTitle>
                <div className="flex justify-center mt-2">
                  <ReadTimeDisplay text={article.description} />
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-center text-base" itemProp="description">
                  {article.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="pt-2 flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => handleNavigate(article.slug)}
                  className="w-full"
                  aria-label={`Read article about ${article.title}`}
                >
                  <BookOpen className="mr-2 h-4 w-4" aria-hidden="true" />
                  Read Article
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
