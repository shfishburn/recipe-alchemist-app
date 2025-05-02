import React from 'react';
import { Brain, ChartPie, CookingPot, Filter, HeartPulse, ShoppingBag, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: boolean;
}

const FeatureCard = ({ icon, title, description, highlight = false }: FeatureCardProps) => {
  return (
    <div className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-md ${
      highlight ? 'bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 border-blue-100 dark:border-gray-600' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
    }`}>
      <div className={`h-12 w-12 flex items-center justify-center rounded-full mb-4 ${
        highlight ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200' : 'bg-recipe-blue/10 text-recipe-blue'
      }`}>
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered Creation",
      description: "Our advanced AI analyzes your ingredients and preferences to create personalized, delicious recipes tailored just for you.",
      highlight: true
    },
    {
      icon: <ChartPie className="h-6 w-6" />,
      title: "Personalized Nutrition",
      description: "Get detailed macro breakdowns and nutritional insights customized to your dietary goals and preferences.",
      highlight: true
    },
    {
      icon: <Filter className="h-6 w-6" />,
      title: "Dietary Customization",
      description: "Automatically adapt recipes to fit your dietary restrictions, allergies, and personal preferences."
    },
    {
      icon: <HeartPulse className="h-6 w-6" />,
      title: "Health-Focused",
      description: "Optimize meals for your specific health goals with intelligent nutrient balancing and substitutions."
    }
  ];

  const additionalFeatures = [
    {
      icon: <CookingPot className="h-6 w-6" />,
      title: "Smart Cooking",
      description: "Follow interactive step-by-step instructions with built-in timers and cooking mode."
    },
    {
      icon: <ShoppingBag className="h-6 w-6" />,
      title: "Shopping Lists",
      description: "Generate and manage shopping lists from your favorite recipes with automatic organization."
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container-page">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-recipe-blue" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Powered by AI, Personalized for You</h2>
          <p className="text-lg text-muted-foreground">
            Our intelligent tools help you create delicious, healthy meals tailored to your personal nutrition goals.
          </p>
        </div>
        
        {/* Main features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description}
              highlight={feature.highlight}
            />
          ))}
        </div>
        
        {/* Additional features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {additionalFeatures.map((feature, index) => (
            <FeatureCard 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description}
            />
          ))}
        </div>
        
        {/* Call to action - Fixed implementation with asChild */}
        <div className="mt-12 text-center">
          <Button asChild size="lg" className="bg-recipe-blue hover:bg-recipe-blue/90">
            <Link to="/quick-recipe">Try AI Recipe Generation</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;
