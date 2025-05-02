
import React from 'react';

export function MacroLegend() {
  return (
    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          *Recommendations based on your personal health profile
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-recipe-purple mr-1.5"></div>
            <span className="text-xs font-medium">Protein</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1.5"></div>
            <span className="text-xs font-medium">Carbs</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1.5"></div>
            <span className="text-xs font-medium">Fat</span>
          </div>
        </div>
      </div>
    </div>
  );
}
