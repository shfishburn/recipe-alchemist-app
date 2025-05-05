
import { useState, useEffect } from 'react';

type SectionState = {
  ingredients: boolean;
  instructions: boolean;
  nutrition: boolean;
  analysis: boolean;
  chef: boolean;
};

export function useRecipeSections() {
  const [sections, setSections] = useState<SectionState>(() => {
    const saved = localStorage.getItem('recipe-sections-v2');
    // If we have saved settings, use them. Otherwise check if old settings exist and migrate them.
    if (saved) {
      return JSON.parse(saved);
    } else {
      const oldSaved = localStorage.getItem('recipe-sections');
      if (oldSaved) {
        const oldSections = JSON.parse(oldSaved);
        // Migrate old settings, mapping 'science' to 'analysis'
        return {
          ingredients: oldSections.ingredients,
          instructions: oldSections.instructions,
          nutrition: oldSections.nutrition,
          analysis: oldSections.science || true,
          chef: oldSections.chef,
        };
      }
      // Default to everything open if no settings found
      return {
        ingredients: true,
        instructions: true,
        nutrition: true,
        analysis: true,
        chef: true,
      };
    }
  });

  useEffect(() => {
    localStorage.setItem('recipe-sections-v2', JSON.stringify(sections));
  }, [sections]);

  const toggleSection = (section: keyof SectionState) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const expandAll = () => {
    setSections({
      ingredients: true,
      instructions: true,
      nutrition: true,
      analysis: true,
      chef: true,
    });
  };

  const collapseAll = () => {
    setSections({
      ingredients: false,
      instructions: false,
      nutrition: false,
      analysis: false,
      chef: false,
    });
  };

  return {
    sections,
    toggleSection,
    expandAll,
    collapseAll,
  };
}
