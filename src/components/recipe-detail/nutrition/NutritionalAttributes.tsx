
import React from 'react';
import { Leaf, Heart, Fish, Zap, DollarSign, Flame, Salt } from 'lucide-react';
import { cn } from '@/lib/utils';

type AttributeType = 'positive' | 'negative';

interface NutritionalAttribute {
  name: string;
  type: AttributeType;
  icon?: string;
  value?: string | number;
}

interface NutritionalAttributesProps {
  positives: NutritionalAttribute[];
  negatives: NutritionalAttribute[];
  className?: string;
}

const attributeIcons: Record<string, React.ElementType> = {
  'Nuts': Heart,
  'Protein': Fish,
  'Fiber': Leaf,
  'Sugar': DollarSign,
  'Calories': Flame,
  'Saturated fat': Zap,
  'Sodium': Salt,
  // Default icon is Leaf
};

export function NutritionalAttributes({
  positives,
  negatives,
  className
}: NutritionalAttributesProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {positives.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-green-600">Positives</h4>
          <div className="grid grid-cols-2 gap-2">
            {positives.map((attr, index) => (
              <AttributeTag key={index} attribute={attr} />
            ))}
          </div>
        </div>
      )}
      
      {negatives.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-red-500">Negatives</h4>
          <div className="grid grid-cols-2 gap-2">
            {negatives.map((attr, index) => (
              <AttributeTag key={index} attribute={attr} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface AttributeTagProps {
  attribute: NutritionalAttribute;
}

function AttributeTag({ attribute }: AttributeTagProps) {
  const Icon = attributeIcons[attribute.name] || Leaf;
  const isPositive = attribute.type === 'positive';
  
  return (
    <div className={cn(
      "flex items-center gap-2 rounded-full px-3 py-1 text-sm",
      isPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
    )}>
      <Icon className="h-4 w-4" />
      <span>{attribute.name}</span>
      {attribute.value && (
        <span className="font-medium">{attribute.value}</span>
      )}
    </div>
  );
}
