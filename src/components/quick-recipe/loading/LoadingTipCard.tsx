import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Utensils,
  Thermometer,
  Scale,
  TestTube,
  Cpu,
  ShoppingCart,
  Microscope,
  Fire,
  FileText,
  Zap,
  Leaf,
  Cheese,
  Puzzle,
  Target,
  Sliders
} from 'lucide-react';

interface Tip {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function LoadingTipCard() {
  const allTips: Tip[] = [
    {
      icon: <Utensils className="h-5 w-5 text-recipe-green" />,
      title: 'In the Mixing Bowl',
      description: 'Tossing your ingredients into the preview—watch flavors fuse in real time.'
    },
    {
      icon: <Thermometer className="h-5 w-5 text-recipe-orange" />,
      title: 'Gentle Simmer',
      description: 'Let your virtual stew bubble—macros, micros, and yield estimates are on their way.'
    },
    {
      icon: <Scale className="h-5 w-5 text-recipe-yellow" />,
      title: 'Harmonizing Flavors',
      description: 'Balancing taste and texture—your recipe preview is coming into focus.'
    },
    {
      icon: <TestTube className="h-5 w-5 text-recipe-blue" />,
      title: 'Scientific Sear',
      description: 'Data is searing—Nutri Score and detailed nutrition will unlock once the preview is ready.'
    },
    {
      icon: <Cpu className="h-5 w-5 text-recipe-green" />,
      title: 'Sous-Vide AI',
      description: 'AI Cooking Coach loading—soon you can chat and tweak flavors or ingredient ratios.'
    },
    {
      icon: <ShoppingCart className="h-5 w-5 text-recipe-orange" />,
      title: 'Mise en Place',
      description: 'Mise en place for your shopping list and yield factors will appear after preview.'
    },
    {
      icon: <Microscope className="h-5 w-5 text-recipe-blue" />,
      title: 'Lab-Tested Flavor',
      description: 'Crunching vitamin, mineral, and calorie counts—pending completion of your preview.'
    },
    {
      icon: <Fire className="h-5 w-5 text-recipe-green" />,
      title: 'Perfect Temperature',
      description: 'Heating up—full analytics, shopping list, and Cooking Mode become available soon.'
    },
    {
      icon: <FileText className="h-5 w-5 text-recipe-orange" />,
      title: 'Chef’s Note',
      description: 'Precision in measurement yields clarity—nutrition insights load shortly.'
    },
    {
      icon: <Zap className="h-5 w-5 text-recipe-yellow" />,
      title: 'Seasoned Wisdom',
      description: 'A pinch of science is in the works—sodium counts and seasoning balance arriving soon.'
    },
    {
      icon: <Leaf className="h-5 w-5 text-recipe-orange" />,
      title: 'Rooted in Science',
      description: 'Carrot on—fiber counts and glycemic details will be revealed soon.'
    },
    {
      icon: <Cheese className="h-5 w-5 text-recipe-yellow" />,
      title: 'Cream of the Crop',
      description: 'From curd to count—calcium and fat content analytics loading.'
    },
    {
      icon: <Puzzle className="h-5 w-5 text-recipe-yellow" />,
      title: 'Culinary Puzzle',
      description: 'Solve the flavor equation—answers appear in your nutrition panel shortly.'
    },
    {
      icon: <Target className="h-5 w-5 text-recipe-green" />,
      title: 'Goal Alignment',
      description: 'Personalized goal alignment data will show how this recipe matches your profile.'
    },
    {
      icon: <Sliders className="h-5 w-5 text-recipe-orange" />,
      title: 'Tailor-Made Taste',
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
    setTips(shuffle(allTips));
    setIndex(0);
    const interval = setInterval(() => {
      setIndex(prev => {
        const next = prev + 1;
        if (next >= tips.length) {
          setTips(shuffle(allTips));
          return 0;
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [tips.length]);

  const tip = tips[index] || allTips[0];

  return (
    <Card className="w-full bg-white/90 border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
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
