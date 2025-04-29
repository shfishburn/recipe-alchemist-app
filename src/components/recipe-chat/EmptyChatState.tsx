
import React from 'react';
import { MessageCircleQuestion, ChefHat, BookOpenCheck, TextSearch } from 'lucide-react';

interface EmptyStateTipProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function EmptyStateTip({ icon, title, description }: EmptyStateTipProps) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function EmptyChatState() {
  return (
    <div className="text-center py-4 sm:py-8 bg-white/60 rounded-lg border border-slate-100 shadow-sm">
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <MessageCircleQuestion className="h-8 w-8 sm:h-10 sm:w-10 text-primary/40" />
        <p className="text-sm sm:text-base font-medium text-slate-700 px-2 sm:px-4">
          Ask our culinary scientist for cooking help
        </p>
        
        <div className="w-full max-w-md mt-2 px-4 sm:px-6">
          <div className="flex flex-col gap-3 text-left">
            <EmptyStateTip 
              icon={<ChefHat className="h-4 w-4 text-primary/70" />}
              title="Cooking Techniques"
              description="Ask about specific cooking methods or how to improve your skills"
            />
            
            <EmptyStateTip 
              icon={<BookOpenCheck className="h-4 w-4 text-green-500/70" />}
              title="Recipe Modifications"
              description="Get suggestions to customize the recipe for dietary needs"
            />
            
            <EmptyStateTip 
              icon={<TextSearch className="h-4 w-4 text-amber-500/70" />}
              title="Scientific Insights"
              description="Learn about the chemistry behind cooking techniques"
            />
          </div>
          
          <div className="border-t border-slate-100 mt-4 pt-3">
            <p className="text-xs text-center text-slate-500">
              You can also upload a recipe image or paste a URL to analyze
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
