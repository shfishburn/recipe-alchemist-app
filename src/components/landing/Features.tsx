
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChefHat, Leaf, Calculator } from 'lucide-react';

const features = [
  {
    title: 'Quick Recipe Generation',
    description: 'Get personalized recipes based on ingredients you have, dietary preferences, and nutrition goals.',
    icon: <ChefHat className="h-10 w-10 text-recipe-green" />,
    action: '/quick-recipe',
    actionText: 'Try Quick Recipe'
  },
  {
    title: 'Nutrition Tracking',
    description: 'Track your nutrition intake with detailed macro and micronutrient breakdowns.',
    icon: <Calculator className="h-10 w-10 text-recipe-green" />,
    action: '/profile',
    actionText: 'View Profile'
  },
  {
    title: 'Dietary Preferences',
    description: 'Set your dietary preferences and restrictions for personalized recipe recommendations.',
    icon: <Leaf className="h-10 w-10 text-recipe-green" />,
    action: '/profile',
    actionText: 'Set Preferences'
  }
];

export const Features: React.FC = () => {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover how Recipe Alchemy can help you create perfect meals tailored to your preferences.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8 mt-8">
          {features.map((feature, i) => (
            <Card key={i} className="flex flex-col justify-between">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild className="w-full bg-recipe-green hover:bg-recipe-green-dark">
                  <Link to={feature.action}>{feature.actionText}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
