
import React from 'react';
import { FormattedText } from '@/components/recipe-chat/response/FormattedText';
import { cn } from '@/lib/utils';

interface AnalysisSectionProps {
  title: string;
  content: string | null;
  icon: React.ReactNode;
  bgClass?: string;
  borderClass?: string;
}

export function AnalysisSection({ 
  title,
  content,
  icon,
  bgClass = "bg-blue-50/50",
  borderClass = "border-blue-100"
}: AnalysisSectionProps) {
  if (!content) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <div className={cn(`prose prose-sm max-w-none p-4 rounded-lg border`, bgClass, borderClass)}>
        <FormattedText 
          text={content} 
          preserveWhitespace={true} 
          forceScientific={true}
        />
      </div>
    </div>
  );
}
