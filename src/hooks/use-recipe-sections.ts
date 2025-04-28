
import { useState, useEffect } from 'react';

type SectionState = {
  ingredients: boolean;
  instructions: boolean;
  nutrition: boolean;
  science: boolean;
  chef: boolean;
};

export function useRecipeSections() {
  const [sections, setSections] = useState<SectionState>(() => {
    const saved = localStorage.getItem('recipe-sections');
    return saved ? JSON.parse(saved) : {
      ingredients: true,
      instructions: true,
      nutrition: true,
      science: true,
      chef: true,
    };
  });

  useEffect(() => {
    localStorage.setItem('recipe-sections', JSON.stringify(sections));
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
      science: true,
      chef: true,
    });
  };

  const collapseAll = () => {
    setSections({
      ingredients: false,
      instructions: false,
      nutrition: false,
      science: false,
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
