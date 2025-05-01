
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
  
  // Enhanced multi-word handling - not just for 2 words but any multi-word ingredients
  if (normalizedText.includes(' ')) {
    // Create word-reversed versions (for all word combinations)
    const words = normalizedText.split(' ');
    if (words.length === 2) {
      // Simple case: "olive oil" → "oil olive"
      const reversed = `${words[1]} ${words[0]}`;
      aliases.push(reversed);
    } else if (words.length > 2) {
      // For longer phrases, try key word combinations
      // Example: "green bell pepper" → "bell pepper", "green pepper"
      for (let i = 0; i < words.length; i++) {
        for (let j = 0; j < words.length; j++) {
          if (i !== j) {
            const combinedWords = `${words[i]} ${words[j]}`;
            if (!aliases.includes(combinedWords) && combinedWords.length > 3) {
              aliases.push(combinedWords);
            }
          }
        }
      }
    }
  }
  
  // Handle common substitution patterns (expanded list)
  const substitutions: Record<string, string[]> = {
    // Vegetables
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
    'green onion': ['scallion', 'spring onion'],
    'corn': ['maize', 'sweet corn'],
    'tomato': ['roma tomato', 'plum tomato'],
    'potato': ['russet potato', 'white potato'],
    'carrot': ['baby carrot'],
    
    // Proteins
    'ground beef': ['minced beef', 'beef mince', 'hamburger meat'],
    'chicken breast': ['chicken cutlet', 'boneless chicken'],
    'steak': ['beef steak', 'sirloin'],
    
    // Grains
    'all purpose flour': ['plain flour', 'ap flour'],
    'whole wheat': ['wholemeal', 'whole grain'],
    'breadcrumbs': ['bread crumbs', 'panko'],
    
    // Dairy
    'heavy cream': ['double cream', 'whipping cream'],
    'sour cream': ['crème fraîche'],
    'cheddar cheese': ['cheddar', 'sharp cheddar'],
    'parmesan': ['parmigiano', 'parmigiano reggiano'],
    
    // Herbs & Spices
    'chili powder': ['chile powder', 'chilli powder'],
    'black pepper': ['pepper', 'cracked pepper'],
    'cayenne': ['cayenne pepper', 'red pepper'],
    'cumin': ['cumin powder', 'ground cumin'],
    
    // Miscellaneous
    'soy sauce': ['shoyu', 'tamari'],
    'hot sauce': ['chili sauce', 'pepper sauce'],
    'stock': ['broth'],
    'chicken stock': ['chicken broth'],
    'beef stock': ['beef broth'],
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

  // Try with singular/plural variations
  const singularPlural = (word: string): string => {
    if (word.endsWith('s') && word.length > 3) {
      return word.slice(0, -1); // Remove trailing 's'
    } else if (!word.endsWith('s') && !word.endsWith('ch') && !word.endsWith('sh')) {
      return word + 's'; // Add 's'
    }
    return word;
  };

  // Apply singular/plural variations to each alias
  const currentAliases = [...aliases];
  for (const alias of currentAliases) {
    const words = alias.split(' ');
    const lastWord = words[words.length - 1];
    const singularPluralVariation = singularPlural(lastWord);
    
    if (singularPluralVariation !== lastWord) {
      const newAlias = [...words.slice(0, -1), singularPluralVariation].join(' ');
      if (!aliases.includes(newAlias)) {
        aliases.push(newAlias);
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
  
  // Enhanced category extraction with more keywords
  let category;
  if (/\b(meat|beef|chicken|pork|steak|poultry|lamb|turkey|duck|veal|ham|bacon|sausage|meatball|patty)\b/.test(lowerText)) {
    category = 'meat';
  } else if (/\b(fish|salmon|tuna|seafood|shrimp|cod|halibut|tilapia|trout|crab|lobster|clam|mussel|oyster)\b/.test(lowerText)) {
    category = 'seafood';
  } else if (/\b(vegetable|carrot|spinach|broccoli|onion|garlic|celery|lettuce|kale|cabbage|zucchini|squash|potato|cauliflower|asparagus|cucumber)\b/.test(lowerText)) {
    category = 'vegetable';
  } else if (/\b(fruit|apple|orange|banana|berry|lemon|strawberry|blueberry|raspberry|peach|pear|grape|melon|watermelon|pineapple|mango|kiwi)\b/.test(lowerText)) {
    category = 'fruit';
  } else if (/\b(spice|herb|salt|pepper|oregano|basil|thyme|rosemary|sage|cilantro|cinnamon|nutmeg|cumin|paprika|curry|turmeric|ginger)\b/.test(lowerText)) {
    category = 'spice';
  } else if (/\b(oil|fat|butter|margarine|lard|shortening|olive oil|vegetable oil|coconut oil|canola oil|sesame oil|sunflower oil|ghee)\b/.test(lowerText)) {
    category = 'fat';
  } else if (/\b(flour|grain|rice|pasta|bread|wheat|oat|barley|quinoa|couscous|noodle|cereal|cornmeal|semolina|bulgur)\b/.test(lowerText)) {
    category = 'grain';
  } else if (/\b(milk|cheese|yogurt|cream|dairy|butter|buttermilk|sour cream|whipped cream|ice cream|cheddar|mozzarella|parmesan|feta|ricotta)\b/.test(lowerText)) {
    category = 'dairy';
  } else if (/\b(nut|almond|peanut|walnut|pecan|cashew|pistachio|hazelnut|chestnut|macadamia|seed|sesame|sunflower|pumpkin|chia|flax)\b/.test(lowerText)) {
    category = 'nut';
  } else if (/\b(sugar|sweetener|honey|syrup|maple|agave|molasses|brown sugar|powdered sugar|confectioners|cane sugar)\b/.test(lowerText)) {
    category = 'sweetener';
  } else if (/\b(sauce|vinegar|dressing|condiment|mayonnaise|mustard|ketchup|soy sauce|worcestershire|hot sauce|salsa|marinade|gravy)\b/.test(lowerText)) {
    category = 'condiment';
  } else if (/\b(bean|legume|chickpea|lentil|pea|black bean|kidney bean|pinto bean|navy bean|soybean|tofu|tempeh|edamame)\b/.test(lowerText)) {
    category = 'legume';
  }
  
  return {
    isFresh,
    isProcessed,
    preparation,
    category
  };
}

/**
 * Enhanced preprocessor that attempts to clean up ingredient text to improve matching
 * @param text Raw ingredient text
 */
export function preprocessIngredientText(text: string): string {
  if (!text) return '';
  
  let processed = text.toLowerCase().trim();
  
  // Remove common prefixes that don't help with matching
  processed = processed
    .replace(/^about\s+/, '')
    .replace(/^approximately\s+/, '')
    .replace(/^around\s+/, '')
    .replace(/^roughly\s+/, '');
  
  // Remove common qualifiers
  processed = processed
    .replace(/\b(to taste|as needed|optional|divided|separated|packed|heaping|rounded|leveled|or more|or less)\b/g, '')
    .replace(/\bsmall\s+/g, '')
    .replace(/\bmedium\s+/g, '')
    .replace(/\blarge\s+/g, '');
  
  // Handle fractions and ranges
  processed = processed
    .replace(/\d+[\/\-]\d+\s*/, '') // Remove fractions like 1/2 or ranges like 2-3
    .replace(/\d+\s*/, ''); // Remove remaining numbers
  
  // Clean up excess whitespace
  processed = processed.replace(/\s+/g, ' ').trim();
  
  return processed;
}
