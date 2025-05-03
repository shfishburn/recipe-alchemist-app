
import React from 'react';
import { useUnitSystem } from '@/hooks/use-unit-system';
import { Button } from '@/components/ui/button';
import { Ruler, BarChart } from 'lucide-react';

interface UnitSystemToggleProps {
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function UnitSystemToggle({ 
  variant = 'outline', 
  size = 'default',
  className = ''
}: UnitSystemToggleProps) {
  // Use the hook which handles profile synchronization
  const { unitSystem, toggleUnitSystem } = useUnitSystem();
  
  return (
    <Button 
      variant={variant} 
      size={size}
      onClick={toggleUnitSystem}
      className={`flex items-center gap-2 ${className}`}
      aria-label={`Switch to ${unitSystem === 'metric' ? 'imperial' : 'metric'} units`}
    >
      {size !== 'icon' && (
        <span>
          {unitSystem === 'metric' ? 'Metric' : 'Imperial'}
        </span>
      )}
      {unitSystem === 'metric' ? (
        <BarChart className="h-4 w-4" />
      ) : (
        <Ruler className="h-4 w-4" />
      )}
    </Button>
  );
}
