
export interface GroceryPackageSize {
  ingredient: string;
  category: string;
  package_sizes: number[];
  package_unit: string;
}

export const groceryPackageSizes: GroceryPackageSize[] = [
  {
    ingredient: "flour",
    category: "Pantry",
    package_sizes: [500, 1000, 2000],
    package_unit: "g"
  },
  {
    ingredient: "sugar",
    category: "Pantry",
    package_sizes: [500, 1000],
    package_unit: "g"
  },
  {
    ingredient: "milk",
    category: "Dairy & Eggs",
    package_sizes: [500, 1000, 2000],
    package_unit: "ml"
  },
  {
    ingredient: "butter",
    category: "Dairy & Eggs",
    package_sizes: [125, 250, 500],
    package_unit: "g"
  },
  {
    ingredient: "rice",
    category: "Pantry",
    package_sizes: [500, 1000, 2000],
    package_unit: "g"
  },
  {
    ingredient: "pasta",
    category: "Pantry",
    package_sizes: [250, 500, 1000],
    package_unit: "g"
  },
  {
    ingredient: "oil",
    category: "Pantry",
    package_sizes: [500, 750, 1000],
    package_unit: "ml"
  },
  {
    ingredient: "bread",
    category: "Bakery",
    package_sizes: [1],
    package_unit: "loaf"
  },
  {
    ingredient: "eggs",
    category: "Dairy & Eggs",
    package_sizes: [6, 12, 18],
    package_unit: ""
  },
  {
    ingredient: "chicken",
    category: "Meat & Seafood",
    package_sizes: [500, 1000],
    package_unit: "g"
  },
  {
    ingredient: "beef",
    category: "Meat & Seafood",
    package_sizes: [250, 500, 1000],
    package_unit: "g"
  },
  {
    ingredient: "tomatoes",
    category: "Produce",
    package_sizes: [400, 800],
    package_unit: "g"
  },
  {
    ingredient: "cheese",
    category: "Dairy & Eggs",
    package_sizes: [200, 400],
    package_unit: "g"
  },
  {
    ingredient: "yogurt",
    category: "Dairy & Eggs",
    package_sizes: [125, 500, 1000],
    package_unit: "g"
  },
  {
    ingredient: "beans",
    category: "Pantry",
    package_sizes: [400],
    package_unit: "g"
  },
  {
    ingredient: "salt",
    category: "Pantry",
    package_sizes: [250, 500],
    package_unit: "g"
  }
];
