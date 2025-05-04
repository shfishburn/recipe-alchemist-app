
import React from 'react';
import { DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CookingFooterProps {
  currentStep: number;
  completedSteps: number[];
  totalSteps: number;
  onPrevStep: () => void;
  onNextStep: () => void;
}

export function CookingFooter({
  currentStep,
  completedSteps,
  totalSteps,
  onPrevStep,
  onNextStep
}: CookingFooterProps) {
  const completedCount = completedSteps.filter(Boolean).length;
  
  return (
    <DrawerFooter className="border-t px-4">
      <div className="flex justify-between items-center w-full">
        <Button 
          onClick={onPrevStep} 
          disabled={currentStep === 0}
          variant="outline"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <div className="text-center">
          <span className="text-sm text-muted-foreground">
            {completedCount}/{totalSteps} steps
          </span>
          <Progress value={(completedCount / totalSteps) * 100} className="w-24 h-2" />
        </div>
        
        <Button 
          onClick={onNextStep} 
          disabled={currentStep === totalSteps - 1}
          variant={completedSteps[currentStep] ? "default" : "outline"}
        >
          Next
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </DrawerFooter>
  );
}
