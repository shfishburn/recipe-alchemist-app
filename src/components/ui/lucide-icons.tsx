
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

export interface IconProps extends React.SVGAttributes<SVGElement> {
  name: keyof typeof LucideIcons;
  size?: number | string;
  strokeWidth?: number;
  color?: string;
}

const Icon = ({ 
  name, 
  size = 24, 
  strokeWidth = 2,
  color = "currentColor",
  ...props 
}: IconProps) => {
  // Type check to ensure the icon exists
  if (!(name in LucideIcons)) {
    console.error(`Icon "${name}" not found in Lucide icons`);
    return null;
  }
  
  // Safely access the icon component
  const LucideIcon = LucideIcons[name] as React.FC<LucideProps>;
  
  return (
    <LucideIcon 
      size={size} 
      strokeWidth={strokeWidth} 
      color={color} 
      {...props} 
    />
  );
};

export { Icon };
