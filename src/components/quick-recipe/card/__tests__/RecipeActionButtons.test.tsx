
// Find the section where the mock recipe is created without steps
// Update it to include steps property:

const mockRecipe = {
  title: "Mock Recipe",
  ingredients: [{ item: "Ingredient 1", qty: 1, unit: "cup" }],
  instructions: ["Step 1", "Step 2"],
  steps: ["Step 1", "Step 2"], // Add this line to fix the type error
  servings: 4
};
