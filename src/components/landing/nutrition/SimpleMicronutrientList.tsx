
import React from 'react';

interface MicronutrientItem {
  name: string;
  value: string;
  percentage: string;
  color: string;
}

interface MicronutrientCategory {
  title: string;
  items: MicronutrientItem[];
}

interface MicronutrientData {
  vitamins?: MicronutrientCategory;
  minerals?: MicronutrientCategory;
}

interface SimpleMicronutrientListProps {
  data?: MicronutrientData;
  micronutrientsData?: MicronutrientData;
}

export function SimpleMicronutrientList({ data, micronutrientsData }: SimpleMicronutrientListProps) {
  // Use micronutrientsData as fallback if data is not provided
  const nutrients = data || micronutrientsData;
  
  if (!nutrients) return null;
  
  const { vitamins, minerals } = nutrients;
  
  const renderCategory = (category: MicronutrientCategory) => (
    <div className="mb-3">
      <h5 className="text-xs font-medium text-slate-700 mb-1">{category.title}</h5>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 simpleMicronutrient-table">
        {category.items.slice(0, 4).map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-xs text-slate-600">{item.name}</span>
            <span className="text-xs font-medium">{item.percentage}</span>
          </div>
        ))}
      </div>
    </div>
  );
  
  return (
    <div className="space-y-3 text-sm max-w-full overflow-x-hidden">
      {vitamins && renderCategory(vitamins)}
      {minerals && renderCategory(minerals)}
    </div>
  );
}
