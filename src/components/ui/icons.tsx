
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface MetricIconProps {
  metric: string;
  value: string | number;
  unit?: string;
}

export function MetricIcon({ metric, value, unit }: MetricIconProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Badge variant="outline" className="px-2 py-0.5 text-xs">
        {metric}
      </Badge>
      <span className="text-sm font-medium">
        {value}
        {unit && <span className="text-xs text-muted-foreground ml-0.5">{unit}</span>}
      </span>
    </div>
  );
}
