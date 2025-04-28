
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ChefHat, Leaf, Lightbulb, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Article {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  slug: string;
}

export const ArticlesList = () => {
  const navigate = useNavigate();
  
  const articles: Article[] = [
    {
      id: 'intelligent-cooking',
      title: 'How Nutrition Analysis Works',
      description: 'The science behind accurate recipe nutrition calculations',
      icon: <Lightbulb className="h-10 w-10 text-recipe-blue" />,
      slug: 'intelligent-cooking'
    },
    {
      id: 'nutrition-tracking',
      title: 'Precise Nutrition Tracking',
      description: 'Learn how we calculate nutrition data based on actual cooking methods and ingredient changes.',
      icon: <Leaf className="h-10 w-10 text-recipe-green" />,
      slug: 'nutrition-tracking'
    },
    {
      id: 'substitutions',
      title: 'Smart Ingredient Substitutions',
      description: 'See how our AI suggests perfect substitutions while maintaining flavor profiles and nutrition.',
      icon: <Utensils className="h-10 w-10 text-recipe-orange" />,
      slug: 'substitutions'
    }
  ];
  
  const handleNavigate = (slug: string) => {
    navigate(`/how-it-works/${slug}`);
  };
  
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <Card key={article.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="mb-4 flex justify-center">
              {article.icon}
            </div>
            <CardTitle className="text-xl text-center">{article.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <CardDescription className="text-center text-base">
              {article.description}
            </CardDescription>
          </CardContent>
          <CardFooter className="pt-2 flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => handleNavigate(article.slug)}
              className="w-full"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Read Article
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
