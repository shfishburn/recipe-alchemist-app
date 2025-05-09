import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChefHat, Clock, Star, CircleCheck } from 'lucide-react';

interface Tip {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function LoadingTipCard() {
  const allTips: Tip[] = [
    {
      icon: <ChefHat className="h-5 w-5 text-recipe-green" />,
      title: '🥣 In the Mixing Bowl',
      description: 'Tossing your ingredients into the preview—watch flavors fuse in real time.'
    },
    {
      icon: <Clock className="h-5 w-5 text-recipe-orange" />,
      title: '⏳ Gentle Simmer',
      description: 'Let your virtual stew bubble—macros, micros, and yield estimates are on their way.'
    },
    {
      icon: <Star className="h-5 w-5 text-recipe-yellow" />,
      title: '🔄 Harmonizing Flavors',
      description: 'Balancing taste and texture—your recipe preview is coming into focus.'
    },
    {
      icon: <CircleCheck className="h-5 w-5 text-recipe-blue" />,
      title: '🔬 Scientific Sear',
      description: 'Data is searing—Nutri Score and detailed nutrition will unlock once the preview is ready.'
    },
    {
      icon: <ChefHat className="h-5 w-5 text-recipe-green" />,
      title: '🤖 Sous-Vide AI',
      description: 'AI Cooking Coach loading—soon you can chat and tweak flavors or ingredient ratios.'
    },
    {
      icon: <Star className="h-5 w-5 text-recipe-orange" />,
      title: '🥘 Mise en Place',
      description: 'Mise en place for your shopping list and yield factors will appear after preview.'
    },
    {
      icon: <CircleCheck className="h-5 w-5 text-recipe-blue" />,
      title: '🧪 Lab-Tested Flavor',
      description: 'Crunching vitamin, mineral, and calorie counts—pending completion of your preview.'
    },
    {
      icon: <ChefHat className="h-5 w-5 text-recipe-green" />,
      title: '🌡️ Perfect Temperature',
      description: 'Heating up—full analytics, shopping list, and Cooking Mode become available soon.'
    },
    {
      icon: <Clock className="h-5 w-5 text-recipe-orange" />,
      title: '💡 Chef’s Note',
      description: 'Precision in measurement yields clarity—nutrition insights load shortly.'
    },
    {
      icon: <Star className="h-5 w-5 text-recipe-yellow" />,
      title: '🧂 Seasoned Wisdom',
      description: 'A pinch of science is in the works—sodium counts and seasoning balance arriving soon.'
    },
    {
      icon: <Clock className="h-5 w-5 text-recipe-orange" />,
      title: '🥕 Rooted in Science',
      description: 'Carrot on—fiber counts and glycemic details will be revealed soon.'
    },
    {
      icon: <Star className="h-5 w-5 text-recipe-yellow" />,
      title: '🧀 Cream of the Crop',
      description: 'From curd to count—calcium and fat content analytics loading.'
    },
    {
      icon: <Star className="h-5 w-5 text-recipe-yellow" />,
      title: '🧩 Culinary Puzzle',
      description: 'Solve the flavor equation—answers appear in your nutrition panel shortly.'
    },
    {
      icon: <Star className="h-5 w-5 text-recipe-green" />,
      title: '🎯 Goal Alignment',
      description: 'Personalized goal alignment data will show how this recipe matches your profile.'
    },
    {
      icon: <ChefHat className="h-5 w-5 text-recipe-orange" />,
      title: '🥄 Tailor-Made Taste',
      description: 'Customize for dietary needs—AI Cooking Coach ready to adjust for preferences and conditions.'
    }
  ];

  const [tips, setTips] = useState<Tip[]>([]);
  const [index, setIndex] = useState(0);

  // Fisher–Yates shuffle implementation
  const shuffle = (arr: Tip[]) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  useEffect(() => {
    // Initialize tips with a shuffled array
    setTips(shuffle(allTips));
    setIndex(0);

    const interval = setInterval(() => {
      setIndex(prev => {
        const next = prev + 1;
        if (next >= tips.length) {
          const reshuffled = shuffle(allTips);
          setTips(reshuffled);
          return 0;
        }
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [tips.length]);

  const tip = tips[index] || allTips[0];

  return (
    <Card className="max-w-md w-full mx-auto bg-white/90 border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
      <CardContent className="p-6 flex flex-col items-center text-center min-h-[160px]">
        <div aria-live="polite" className="flex flex-col items-center">
          <div className="mb-1.5">{tip.icon}</div>
          <h4 className="text-base sm:text-lg font-medium mb-2">{tip.title}</h4>
          <p className="text-sm sm:text-base text-muted-foreground">{tip.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
