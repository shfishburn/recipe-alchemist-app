import { ChatMessage } from '@/types/chat';

// Define the InstructionChange type that was previously imported
interface InstructionChange {
  action: string;
  [key: string]: any;
}

export const highlightText = (
  text: string,
  changesSuggested: ChatMessage['changes_suggested']
): string => {
  if (!changesSuggested) {
    return text;
  }

  let highlightedText = text;

  // Highlight title changes
  if (changesSuggested.title) {
    const titleRegex = new RegExp(changesSuggested.title, 'gi');
    highlightedText = highlightedText.replace(
      titleRegex,
      (match) => `<mark class="bg-yellow-200">${match}</mark>`
    );
  }

  // Highlight ingredient changes
  if (changesSuggested.ingredients?.items) {
    changesSuggested.ingredients.items.forEach((ingredient) => {
      if (typeof ingredient === 'string') {
        const ingredientRegex = new RegExp(ingredient, 'gi');
        highlightedText = highlightedText.replace(
          ingredientRegex,
          (match) => `<mark class="bg-lime-200">${match}</mark>`
        );
      } else {
        // Check if ingredient.item is a string or an object with a name property
        const ingredientName = typeof ingredient.item === 'string' ? ingredient.item : ingredient.item?.name;
        if (ingredientName) {
          const ingredientRegex = new RegExp(ingredientName, 'gi');
          highlightedText = highlightedText.replace(
            ingredientRegex,
            (match) => `<mark class="bg-lime-200">${match}</mark>`
          );
        }
      }
    });
  }

  // Highlight instruction changes
  if (changesSuggested.instructions) {
    changesSuggested.instructions.forEach((instruction) => {
      // Check if instruction is a string or an object with an action property
      const instructionText = typeof instruction === 'string' ? instruction : (instruction as InstructionChange).action;
      if (instructionText) {
        const instructionRegex = new RegExp(instructionText, 'gi');
        highlightedText = highlightedText.replace(
          instructionRegex,
          (match) => `<mark class="bg-orange-200">${match}</mark>`
        );
      }
    });
  }

  // Highlight science_notes changes
  if (changesSuggested.science_notes) {
    changesSuggested.science_notes.forEach((note) => {
      const noteRegex = new RegExp(note, 'gi');
      highlightedText = highlightedText.replace(
        noteRegex,
        (match) => `<mark class="bg-purple-200">${match}</mark>`
      );
    });
  }

  return highlightedText;
};
