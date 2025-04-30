
import React from 'react';

export function PersonalizedSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="container-page">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">Personalized Nutrition</h2>
            <p className="text-muted-foreground mb-6">
              Get customized nutritional insights for every recipe based on your dietary preferences and goals.
            </p>
            <ul className="space-y-2">
              {["Custom macronutrient targets", "Dietary restriction filters", "Allergy warnings", "Portion recommendations"].map((item, i) => (
                <li key={i} className="flex items-center">
                  <span className="bg-primary/20 text-primary rounded-full p-1 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 bg-muted/30 rounded-lg h-64 flex items-center justify-center">
            <span className="text-muted-foreground">Personalization Preview</span>
          </div>
        </div>
      </div>
    </section>
  );
}
