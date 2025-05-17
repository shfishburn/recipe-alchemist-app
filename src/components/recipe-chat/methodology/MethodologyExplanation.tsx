
import React from 'react';

export function MethodologyExplanation() {
  return (
    <div className="prose prose-sm max-w-none">
      <p>
        Our recipe assistant analyzes your recipe scientifically to provide the most accurate culinary advice.
        Here's how it works:
      </p>
      
      <h4>Analysis Process</h4>
      <ol>
        <li>
          <strong>Ingredient Analysis:</strong> We examine ingredient combinations to identify potential 
          enhancements based on molecular gastronomy principles.
        </li>
        <li>
          <strong>Technique Review:</strong> Our system evaluates cooking methods to suggest optimizations 
          for texture, flavor development, and nutrient retention.
        </li>
        <li>
          <strong>Nutritional Assessment:</strong> We calculate nutritional values and offer balanced 
          adjustments when possible.
        </li>
        <li>
          <strong>Flavor Pairing:</strong> Using a database of complementary flavor compounds, 
          we can suggest ingredient substitutions or additions.
        </li>
      </ol>
      
      <p className="text-sm text-muted-foreground mt-4">
        While our system is built on scientific principles, cooking is both art and science. 
        Feel free to adapt suggestions to your personal taste preferences.
      </p>
    </div>
  );
}
