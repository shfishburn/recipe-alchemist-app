
import { normalizeRecipeResponse } from '@/utils/recipe-normalization';

describe('Recipe Normalization', () => {
  it('should normalize a valid recipe response', () => {
    const mockData = {
      title: 'Test Recipe',
      tagline: 'A test recipe',
      ingredients: [
        {
          qty: 1,
          unit: 'cup',
          item: 'flour'
        }
      ],
      instructions: ['Step 1', 'Step 2'],
      servings: 4,
      prep_time_min: 10,
      cook_time_min: 20
    };

    const normalized = normalizeRecipeResponse(mockData);

    // Check required fields are present
    expect(normalized).toHaveProperty('title', 'Test Recipe');
    expect(normalized).toHaveProperty('tagline', 'A test recipe');
    expect(normalized).toHaveProperty('servings', 4);
    
    // Check arrays are properly handled
    expect(normalized.ingredients).toHaveLength(1);
    expect(normalized.instructions).toHaveLength(2);
    expect(normalized.instructions).toEqual(['Step 1', 'Step 2']);
    expect(normalized.steps).toEqual(['Step 1', 'Step 2']);
    
    // Check ingredient normalization
    expect(normalized.ingredients[0]).toHaveProperty('qty_metric', 1);
    expect(normalized.ingredients[0]).toHaveProperty('unit_metric', 'cup');
    expect(normalized.ingredients[0]).toHaveProperty('qty_imperial', 1);
    expect(normalized.ingredients[0]).toHaveProperty('unit_imperial', 'cup');
  });

  it('should handle alternate property names', () => {
    const mockData = {
      title: 'Test Recipe',
      description: 'A test description',
      ingredients: [
        {
          qty: 1,
          unit: 'cup',
          item: 'flour'
        }
      ],
      steps: ['Step 1', 'Step 2'],
      servings: 4,
      prepTime: 10,
      cookTime: 20
    };

    const normalized = normalizeRecipeResponse(mockData);

    // Check property name normalization
    expect(normalized).toHaveProperty('tagline', 'A test description');
    expect(normalized).toHaveProperty('instructions', ['Step 1', 'Step 2']);
    expect(normalized).toHaveProperty('prep_time_min', 10);
    expect(normalized).toHaveProperty('cook_time_min', 20);
    expect(normalized).toHaveProperty('prepTime', 10);
    expect(normalized).toHaveProperty('cookTime', 20);
  });

  it('should handle ingredients with metric/imperial units already defined', () => {
    const mockData = {
      title: 'Test Recipe',
      ingredients: [
        {
          qty_metric: 250,
          unit_metric: 'g',
          qty_imperial: 1,
          unit_imperial: 'cup',
          item: 'flour'
        }
      ],
      instructions: ['Step 1'],
      servings: 4
    };

    const normalized = normalizeRecipeResponse(mockData);

    // Check ingredient units are preserved
    expect(normalized.ingredients[0]).toHaveProperty('qty_metric', 250);
    expect(normalized.ingredients[0]).toHaveProperty('unit_metric', 'g');
    expect(normalized.ingredients[0]).toHaveProperty('qty_imperial', 1);
    expect(normalized.ingredients[0]).toHaveProperty('unit_imperial', 'cup');
  });

  it('should throw error for invalid/empty recipe data', () => {
    // Test null data
    expect(() => normalizeRecipeResponse(null as any)).toThrow('Invalid recipe data');
    
    // Test missing title
    expect(() => normalizeRecipeResponse({ ingredients: [] } as any)).toThrow('Invalid recipe data');
    
    // Test missing ingredients
    expect(() => normalizeRecipeResponse({ title: 'Test' } as any)).toThrow('Invalid recipe data');
  });

  it('should provide default values for missing fields', () => {
    const minimalData = {
      title: 'Minimal Recipe',
      ingredients: [{ item: 'something' }]
    };

    const normalized = normalizeRecipeResponse(minimalData as any);

    // Check defaults
    expect(normalized).toHaveProperty('servings', 4);
    expect(normalized).toHaveProperty('instructions', []);
    expect(normalized).toHaveProperty('steps', []);
    expect(normalized).toHaveProperty('science_notes', []);
    expect(normalized).toHaveProperty('flavor_tags', []);
  });
});
