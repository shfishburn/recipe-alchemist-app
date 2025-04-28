
export function validateRecipeChanges(response: any) {
  // Parse the response if it's a string
  const changes = typeof response === 'string' ? JSON.parse(response) : response;

  // Validate title if present
  if (changes.title) {
    if (typeof changes.title !== 'string' || changes.title.trim().length === 0) {
      throw new Error('Invalid title format');
    }
    
    // Ensure title isn't a placeholder or default value
    const lowerTitle = changes.title.toLowerCase();
    if (lowerTitle === 'optional new title' || 
        lowerTitle === 'untitled recipe' || 
        lowerTitle === 'new recipe') {
      throw new Error('Title cannot be a generic placeholder');
    }
  }

  // Validate ingredients if present
  if (changes.ingredients) {
    if (!Array.isArray(changes.ingredients)) {
      throw new Error('Ingredients must be an array');
    }
    
    changes.ingredients.forEach((ingredient: any, index: number) => {
      if (!ingredient.qty || !ingredient.unit || !ingredient.item) {
        throw new Error(`Invalid ingredient format at index ${index}`);
      }
    });
  }

  // Validate instructions if present
  if (changes.instructions) {
    if (!Array.isArray(changes.instructions)) {
      throw new Error('Instructions must be an array');
    }

    // Validate cooking instructions
    const cookingSteps = changes.instructions.filter((step: string) => 
      step.toLowerCase().includes('cook') ||
      step.toLowerCase().includes('bake') ||
      step.toLowerCase().includes('grill') ||
      step.toLowerCase().includes('fry')
    );

    cookingSteps.forEach((step: string, index: number) => {
      if (!step.includes('°F') && !step.includes('°C')) {
        throw new Error(`Missing temperature in cooking step ${index + 1}`);
      }
      if (!step.includes('minute') && !step.includes('hour')) {
        throw new Error(`Missing duration in cooking step ${index + 1}`);
      }
    });
  }

  // Validate cooking details if present
  if (changes.cookingDetails) {
    const { temperature, duration, equipment } = changes.cookingDetails;
    
    if (temperature && (!temperature.fahrenheit || !temperature.celsius)) {
      throw new Error('Temperature must include both Fahrenheit and Celsius');
    }
    
    if (duration && (!duration.prep || !duration.cook)) {
      throw new Error('Duration must include both prep and cook times');
    }
    
    if (equipment && (!Array.isArray(equipment) || equipment.length === 0)) {
      throw new Error('Equipment must be a non-empty array');
    }
  }

  return changes;
}
