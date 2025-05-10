
import React from 'react';
import nutritionDistributionImage from './nutrition-distribution.png';
import { cn } from '@/lib/utils';

interface SimplifiedDistributionPreviewProps {
  className?: string;
  alt?: string;
}

export function SimplifiedDistributionPreview({ 
  className, 
  alt = "Nutrition distribution visualization" 
}: SimplifiedDistributionPreviewProps) {
  return (
    <div className={cn("rounded-lg overflow-hidden bg-white", className)}>
      <img 
        src={nutritionDistributionImage} 
        alt={alt}
        className="w-full h-auto max-h-[180px] object-contain"
        loading="lazy"
      />
    </div>
  );
}
