
import React from 'react';
import { Check, MessageSquare, ShoppingBag, History } from 'lucide-react';

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
      icon: <Check className="h-6 w-6 text-recipe-blue" />,
      title: "Create Recipe",
      description: "Generate healthy recipes based on your preferences, ingredients, and dietary needs."
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-recipe-blue" />,
      title: "Iterate with AI",
      description: "Chat with our AI assistant to customize and perfect your recipes."
    },
    {
      icon: <History className="h-6 w-6 text-recipe-blue" />,
      title: "Save & Browse",
      description: "Store your favorite recipes and their versions for easy access anytime."
    },
    {
      icon: <ShoppingBag className="h-6 w-6 text-recipe-blue" />,
      title: "Shopping List",
      description: "Automatically create shopping lists from one or multiple recipes."
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container-page">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-bold mb-4">Cook smarter, not harder</h2>
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
