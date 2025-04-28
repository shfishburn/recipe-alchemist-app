
import React from 'react';
import { ChevronRight, CookingPot, Filter, ShoppingBag, Sparkles } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
      <div className="h-12 w-12 flex items-center justify-center rounded-full bg-recipe-blue/10 mb-4">
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
      icon: <Sparkles className="h-6 w-6 text-recipe-blue" />,
      title: "AI-Powered Creation",
      description: "Generate personalized recipes based on your ingredients, dietary needs, and nutritional goals."
    },
    {
      icon: <Filter className="h-6 w-6 text-recipe-blue" />,
      title: "Dietary Customization",
      description: "Tailor recipes to your specific dietary restrictions and preferences automatically."
    },
    {
      icon: <CookingPot className="h-6 w-6 text-recipe-blue" />,
      title: "Interactive Cooking",
      description: "Follow step-by-step instructions with built-in timers and cooking mode."
    },
    {
      icon: <ShoppingBag className="h-6 w-6 text-recipe-blue" />,
      title: "Smart Shopping Lists",
      description: "Generate and manage shopping lists from your favorite recipes automatically."
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container-page">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-bold mb-4">Modern cooking made simple</h2>
          <p className="text-xl text-muted-foreground">
            Our AI-powered tools help you create delicious, healthy meals with less effort.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
