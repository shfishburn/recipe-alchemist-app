
import React from 'react';

export function MacroLegend() {
  return (
    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground mb-2 sm:mb-0">
          *Recommendations based on your personal health profile
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-recipe-purple mr-1.5"></div>
            <span className="text-xs">Protein</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1.5"></div>
            <span className="text-xs">Carbs</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1.5"></div>
            <span className="text-xs">Fat</span>
          </div>
        </div>
      </div>
    </div>
  );
}
