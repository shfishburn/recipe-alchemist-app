
import React from 'react';

interface StepListProps {
  steps: string[];
  onChange?: (steps: string[]) => void;
}

export const StepList: React.FC<StepListProps> = ({ steps, onChange }) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Instructions</h4>
      <ol className="list-decimal pl-5 space-y-1">
        {steps.map((step, index) => (
          <li key={index} className="text-sm">{step}</li>
        ))}
      </ol>
    </div>
  );
};
