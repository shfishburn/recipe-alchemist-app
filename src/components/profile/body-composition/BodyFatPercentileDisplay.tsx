
import React from 'react';
import { Card } from '@/components/ui/card';
import { getBodyFatPercentile } from '@/utils/body-composition';

interface BodyFatPercentileDisplayProps {
  bodyFatPercentage: number;
  gender: string;
  age: number;
}

export function BodyFatPercentileDisplay({ 
  bodyFatPercentage, 
  gender, 
  age 
}: BodyFatPercentileDisplayProps) {
  const { percentile, category, healthRisks } = getBodyFatPercentile(age, gender, bodyFatPercentage);

  const getCategoryColor = (category: string | undefined) => {
    if (!category) return 'bg-gray-200';
    
    switch(category.toLowerCase()) {
      case 'elite': return 'bg-indigo-500 text-white';
      case 'fitness': return 'bg-blue-500 text-white';
      case 'average': return 'bg-green-500 text-white';
      case 'overweight': return 'bg-yellow-500';
      case 'obese': return 'bg-orange-500 text-white';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-sm font-medium">Percentile</p>
          <p className="text-2xl font-bold">{percentile !== undefined ? `${percentile}th` : 'N/A'}</p>
        </div>
        
        {category && (
          <div className="flex-1">
            <div className={`px-3 py-1 rounded-full text-center text-sm font-medium ${getCategoryColor(category)}`}>
              {category}
            </div>
          </div>
        )}
      </div>
      
      {healthRisks && healthRisks.length > 0 && (
        <Card className="p-3 bg-yellow-50 border-yellow-200">
          <p className="text-sm font-medium mb-1">Health Considerations:</p>
          <ul className="text-xs list-disc list-inside">
            {healthRisks.map((risk, index) => (
              <li key={index}>{risk}</li>
            ))}
          </ul>
        </Card>
      )}
      
      <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
        <div className="absolute top-0 left-0 h-6 flex items-center">
          <div className="h-full bg-blue-500" style={{ width: `${percentile || 0}%` }}></div>
          <div className="h-4 w-4 rounded-full bg-white border-2 border-blue-500 absolute" 
               style={{ left: `${percentile || 0}%`, transform: 'translateX(-50%)' }}></div>
        </div>
        
        <div className="absolute top-0 left-0 w-full h-full flex justify-between text-xs px-2 text-gray-600">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        Percentile based on {gender} adults aged {age} from CDC NHANES data
      </p>
    </div>
  );
}
