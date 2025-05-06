
import React from 'react';
import { MessageCircleQuestion, ChefHat, BookOpenCheck, TextSearch } from 'lucide-react';

interface EmptyStateTipProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconColor?: string;
}

function EmptyStateTip({ icon, title, description, iconColor = "text-primary/70" }: EmptyStateTipProps) {
  return (
    <div className="flex items-start gap-3">
      <div className={`mt-0.5 ${iconColor}`}>
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
    <div className="text-center py-6 sm:py-8 bg-white/70 rounded-lg border border-slate-100/50 shadow-sm">
      <div className="flex flex-col items-center gap-4 sm:gap-5">
        <div className="bg-green-50 p-3 rounded-full">
          <MessageCircleQuestion className="h-8 w-8 sm:h-10 sm:w-10 text-green-500/80" />
        </div>
        
        <p className="text-base sm:text-lg font-medium text-slate-800 px-2 sm:px-4 mb-2">
          Ask our culinary scientist for cooking help
        </p>
        
        <div className="w-full max-w-md mt-1 px-6 sm:px-8">
          <div className="flex flex-col gap-4 text-left">
            <EmptyStateTip 
              icon={<ChefHat className="h-5 w-5" />}
              title="Cooking Techniques"
              description="Ask about specific cooking methods or how to improve your skills"
              iconColor="text-green-600/80"
            />
            
            <EmptyStateTip 
              icon={<BookOpenCheck className="h-5 w-5" />}
              title="Recipe Modifications"
              description="Get suggestions to customize the recipe for dietary needs"
              iconColor="text-blue-500/70"
            />
            
            <EmptyStateTip 
              icon={<TextSearch className="h-5 w-5" />}
              title="Scientific Insights"
              description="Learn about the chemistry behind cooking techniques"
              iconColor="text-amber-500/80"
            />
          </div>
          
          <div className="border-t border-slate-100 mt-5 pt-4">
            <p className="text-xs text-center text-slate-500">
              You can also upload a recipe image or paste a URL to analyze
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
