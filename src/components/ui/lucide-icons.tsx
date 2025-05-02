
import React from 'react';
import * as LucideIcons from 'lucide-react';

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
  const LucideIcon = LucideIcons[name];
  
  if (!LucideIcon) {
    console.error(`Icon "${name}" not found in Lucide icons`);
    return null;
  }

  return <LucideIcon size={size} strokeWidth={strokeWidth} color={color} {...props} />;
};

export { Icon };
