
/**
 * Helper functions for ingredient text processing and matching
 */

// Normalize ingredient text for better matching
export function normalizeIngredientText(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .replace(/[^\w\s,-]/g, '') // Keep commas and hyphens for certain food names
    .replace(/\s+/g, ' ')    // Normalize whitespace
    .trim();
}

// Build variations/aliases of ingredient names to improve matching success rate
export function buildIngredientAliases(normalizedText: string): string[] {
  const aliases: string[] = [normalizedText];
  
  // Remove measurement words that might interfere with matching
  const withoutMeasures = normalizedText
    .replace(/\b(cup|cups|tablespoon|tbsp|teaspoon|tsp|ounce|oz|pound|lb|gram|g|kg|ml|l)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (withoutMeasures !== normalizedText) {
    aliases.push(withoutMeasures);
  }
  
  // Try without modifiers
  const withoutModifiers = normalizedText
    .replace(/\b(fresh|dried|frozen|canned|cooked|raw|ripe|unripe|whole|chopped|minced|sliced|diced|ground|grated|shredded)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (withoutModifiers !== normalizedText && !aliases.includes(withoutModifiers)) {
    aliases.push(withoutModifiers);
  }
  
  // For multi-word ingredients, try word reversal for items like "olive oil" vs "oil, olive"
  if (normalizedText.includes(' ')) {
    const words = normalizedText.split(' ');
    if (words.length === 2) {
      const reversed = `${words[1]} ${words[0]}`;
      aliases.push(reversed);
    }
  }
  
  // Handle common substitution patterns
  const substitutions: Record<string, string[]> = {
    'bell pepper': ['sweet pepper', 'capsicum'],
    'green bell pepper': ['green pepper', 'green capsicum'],
    'red bell pepper': ['red pepper', 'red capsicum'],
    'spring onion': ['scallion', 'green onion'],
    'eggplant': ['aubergine'],
    'zucchini': ['courgette'],
    'cilantro': ['coriander'],
    'arugula': ['rocket'],
    'sweet potato': ['yam'],
    'cooking oil': ['vegetable oil'],
  };
  
  // Add common substitutions if they match
  for (const [original, substitutes] of Object.entries(substitutions)) {
    if (normalizedText.includes(original)) {
      for (const substitute of substitutes) {
        const substituted = normalizedText.replace(original, substitute);
        if (!aliases.includes(substituted)) {
          aliases.push(substituted);
        }
      }
    }
  }
  
  return aliases;
}

// Extract additional semantic information from ingredient text
export function extractIngredientSemantics(text: string): {
  isFresh?: boolean;
  isProcessed?: boolean;
  preparation?: string;
  category?: string;
} {
  const lowerText = text.toLowerCase();
  
  // Extract freshness indicators
  const isFresh = /\b(fresh|raw|ripe|organic)\b/.test(lowerText);
  
  // Extract processing indicators
  const isProcessed = /\b(canned|frozen|dried|pickled|preserved)\b/.test(lowerText);
  
  // Extract preparation method
  let preparation;
  const prepMatch = lowerText.match(/\b(chopped|minced|sliced|diced|ground|grated|shredded|whole|cut)\b/);
  if (prepMatch) {
    preparation = prepMatch[0];
  }
  
  // Basic category extraction
  let category;
  if (/\b(meat|beef|chicken|pork|steak|poultry)\b/.test(lowerText)) {
    category = 'meat';
  } else if (/\b(fish|salmon|tuna|seafood|shrimp)\b/.test(lowerText)) {
    category = 'seafood';
  } else if (/\b(vegetable|carrot|spinach|broccoli|onion|garlic)\b/.test(lowerText)) {
    category = 'vegetable';
  } else if (/\b(fruit|apple|orange|banana|berry|lemon)\b/.test(lowerText)) {
    category = 'fruit';
  } else if (/\b(spice|herb|salt|pepper|oregano|basil|thyme)\b/.test(lowerText)) {
    category = 'spice';
  } else if (/\b(oil|fat|butter|margarine|lard)\b/.test(lowerText)) {
    category = 'fat';
  } else if (/\b(flour|grain|rice|pasta|bread|wheat)\b/.test(lowerText)) {
    category = 'grain';
  } else if (/\b(milk|cheese|yogurt|cream|dairy)\b/.test(lowerText)) {
    category = 'dairy';
  }
  
  return {
    isFresh,
    isProcessed,
    preparation,
    category
  };
}
