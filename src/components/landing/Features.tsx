
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Brain, ChefHat, ChartPie, Sparkles } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

const FeatureCard = ({ title, description, icon, className }: FeatureCardProps) => (
  <Card className={cn("overflow-hidden transition-all shadow-elevation-1 hover:shadow-elevation-2", className)}>
    <CardContent className="p-6 space-y-3">
      <div className="p-3 rounded-full bg-primary/10 w-fit">
        {icon}
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default function Features() {
  const features = [
    {
      title: "AI-Powered Creation",
      description: "Generate personalized recipes based on the ingredients you already have in your kitchen.",
      icon: <Brain className="w-6 h-6 text-recipe-primaryPurple" />,
      className: "border-t-4 border-recipe-primaryPurple",
    },
    {
      title: "Nutrition Insights",
      description: "Get detailed nutrition information and understand how each recipe fits your dietary goals.",
      icon: <ChartPie className="w-6 h-6 text-recipe-green" />,
      className: "border-t-4 border-recipe-green",
    },
    {
      title: "Custom Modifications",
      description: "Easily adapt recipes to your dietary preferences, restrictions, and serving sizes.",
      icon: <Sparkles className="w-6 h-6 text-recipe-orange" />,
      className: "border-t-4 border-recipe-orange",
    },
    {
      title: "Chef Assistance",
      description: "Get step-by-step cooking instructions and professional tips for perfect results every time.",
      icon: <ChefHat className="w-6 h-6 text-recipe-teal" />,
      className: "border-t-4 border-recipe-teal",
    },
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="container-page">
        <div className="text-center mb-10">
          <h2 className="material-h2 mb-3">Key Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover how Recipe Alchemy transforms your cooking experience with powerful AI-driven tools.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              className={feature.className}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
