
import React from 'react';
import { InfoIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface NutritionInfoCardProps {
  title: string;
  content: string;
  variant?: 'info' | 'warning' | 'success';
}

export function NutritionInfoCard({
  title,
  content,
  variant = 'info'
}: NutritionInfoCardProps) {
  const variantStyles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      titleColor: 'text-blue-700',
      textColor: 'text-blue-600',
      iconColor: 'text-blue-500'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      titleColor: 'text-amber-700',
      textColor: 'text-amber-600',
      iconColor: 'text-amber-500'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-100',
      titleColor: 'text-green-700',
      textColor: 'text-green-600',
      iconColor: 'text-green-500'
    }
  };

  const styles = variantStyles[variant];

  return (
    <Card className={`${styles.bg} ${styles.border}`}>
      <CardContent className="p-3 flex items-start space-x-2">
        <InfoIcon className={`h-5 w-5 ${styles.iconColor} flex-shrink-0 mt-0.5`} />
        <div>
          <h5 className={`text-sm font-medium ${styles.titleColor}`}>{title}</h5>
          <p className={`text-xs ${styles.textColor}`}>{content}</p>
        </div>
      </CardContent>
    </Card>
  );
}
