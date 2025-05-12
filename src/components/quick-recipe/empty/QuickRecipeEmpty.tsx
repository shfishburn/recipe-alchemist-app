
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChefHat, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickRecipeEmpty: React.FC = () => {
  const navigate = useNavigate();
  
  const handleStartOver = () => {
    navigate('/quick-recipe', { replace: true });
  };
  
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-md p-6 flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <ChefHat className="w-8 h-8 text-gray-400" />
      </div>
      
      <h2 className="text-xl font-semibold mb-2">No Recipe Yet</h2>
      
      <p className="text-muted-foreground mb-6">
        Enter your ingredients and preferences to generate a quick recipe
      </p>
      
      <Button
        onClick={handleStartOver}
        variant="outline"
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Generate a Recipe
      </Button>
    </div>
  );
};

export default QuickRecipeEmpty;
