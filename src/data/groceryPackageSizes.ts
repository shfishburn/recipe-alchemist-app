
/**
 * Enhanced grocery package size database
 * Contains standard packaging information for common grocery items
 */

export interface GroceryPackageSize {
  ingredient: string;
  category: string;
  package_sizes: number[];
  package_unit: string;
  standard_qty?: number;
  standard_unit?: string;
  metric_equiv?: string;
  notes?: string;
}

export const groceryPackageSizes: GroceryPackageSize[] = [
  // Dairy Category
  {
    ingredient: "milk",
    category: "Dairy & Eggs",
    package_sizes: [0.5, 1],
    package_unit: "gallon",
    standard_qty: 1,
    standard_unit: "gallon",
    metric_equiv: "3.785 L",
    notes: "Sold in half-gallon (64 fl oz) and one-gallon (128 fl oz) jugs as standard."
  },
  {
    ingredient: "eggs",
    category: "Dairy & Eggs",
    package_sizes: [6, 12, 18],
    package_unit: "count",
    standard_qty: 12,
    standard_unit: "count",
    metric_equiv: "1 dozen",
    notes: "Usually sold by the dozen (12 eggs per carton)."
  },
  {
    ingredient: "butter",
    category: "Dairy & Eggs",
    package_sizes: [0.5, 1],
    package_unit: "lb",
    standard_qty: 1,
    standard_unit: "lb",
    metric_equiv: "0.454 kg",
    notes: "Standard butter packages are 1 lb (usually four 1/4-lb sticks)."
  },
  {
    ingredient: "cheese",
    category: "Dairy & Eggs",
    package_sizes: [0.5, 1],
    package_unit: "lb",
    standard_qty: 1, 
    standard_unit: "lb",
    metric_equiv: "0.454 kg",
    notes: "Commonly in 8 oz blocks or bags (shredded) and 16 oz (1 lb) packages."
  },
  {
    ingredient: "yogurt",
    category: "Dairy & Eggs",
    package_sizes: [6, 32],
    package_unit: "oz",
    standard_qty: 6,
    standard_unit: "oz",
    metric_equiv: "170 g",
    notes: "Single-serve cups are typically ~6 oz. Multi-serve tubs are usually 32 oz (1 quart)."
  },
  {
    ingredient: "sour cream",
    category: "Dairy & Eggs",
    package_sizes: [8, 16, 24],
    package_unit: "oz",
    standard_qty: 16,
    standard_unit: "oz",
    metric_equiv: "473 mL",
    notes: "Sold in 8 oz half-pint, 16 oz pint, or larger 24 oz tubs."
  },
  {
    ingredient: "cottage cheese",
    category: "Dairy & Eggs",
    package_sizes: [16, 24, 32],
    package_unit: "oz",
    standard_qty: 16,
    standard_unit: "oz",
    metric_equiv: "454 g",
    notes: "Commonly in 16 oz (1 lb) containers."
  },
  {
    ingredient: "cream",
    category: "Dairy & Eggs",
    package_sizes: [16, 32],
    package_unit: "fl oz",
    standard_qty: 16,
    standard_unit: "fl oz",
    metric_equiv: "473 mL",
    notes: "Liquid dairy creams are often sold in pint cartons (16 fl oz)."
  },
  
  // Meat & Seafood Category
  {
    ingredient: "ground beef",
    category: "Meat & Seafood",
    package_sizes: [1, 3],
    package_unit: "lb",
    standard_qty: 1,
    standard_unit: "lb",
    metric_equiv: "0.454 kg",
    notes: "Commonly sold in 1 lb packages or family packs of ~3 lb."
  },
  {
    ingredient: "chicken breast",
    category: "Meat & Seafood",
    package_sizes: [1, 2],
    package_unit: "lb",
    standard_qty: 1,
    standard_unit: "lb",
    metric_equiv: "0.454 kg",
    notes: "Typically sold in packs of 1-2 lbs with 3-4 breasts per pack."
  },
  {
    ingredient: "chicken",
    category: "Meat & Seafood",
    package_sizes: [3, 5],
    package_unit: "lb",
    standard_qty: 1,
    standard_unit: "each",
    metric_equiv: "1.8 kg",
    notes: "Whole chickens typically weigh between 3-5 lbs each."
  },
  {
    ingredient: "bacon",
    category: "Meat & Seafood",
    package_sizes: [0.75, 1],
    package_unit: "lb",
    standard_qty: 1,
    standard_unit: "lb",
    metric_equiv: "0.454 kg",
    notes: "Standard packages are 12 oz (0.75 lb) or 16 oz (1 lb)."
  },
  {
    ingredient: "ham",
    category: "Meat & Seafood",
    package_sizes: [0.5, 1],
    package_unit: "lb",
    standard_qty: 0.5,
    standard_unit: "lb",
    metric_equiv: "0.227 kg",
    notes: "Pre-packaged deli meats often in 8 oz (half-pound) pouches."
  },
  {
    ingredient: "hot dogs",
    category: "Meat & Seafood",
    package_sizes: [0.75, 1],
    package_unit: "lb",
    standard_qty: 0.75,
    standard_unit: "lb",
    metric_equiv: "0.340 kg",
    notes: "Most packs are 12 oz (usually 8 hot dogs)."
  },
  {
    ingredient: "sausage",
    category: "Meat & Seafood",
    package_sizes: [1],
    package_unit: "lb",
    standard_qty: 1,
    standard_unit: "lb",
    metric_equiv: "0.454 kg",
    notes: "Breakfast sausage typically in 1 lb rolls or 12 oz links packages."
  },
  {
    ingredient: "shrimp",
    category: "Meat & Seafood",
    package_sizes: [1, 2],
    package_unit: "lb",
    standard_qty: 1,
    standard_unit: "lb",
    metric_equiv: "0.454 kg",
    notes: "Frozen shrimp commonly in 1 lb bags."
  },
  {
    ingredient: "salmon",
    category: "Meat & Seafood",
    package_sizes: [1],
    package_unit: "lb",
    standard_qty: 1,
    standard_unit: "lb",
    metric_equiv: "0.454 kg",
    notes: "Fresh fillets usually cut to ~1 lb pieces."
  },
  {
    ingredient: "tuna",
    category: "Meat & Seafood",
    package_sizes: [5, 12],
    package_unit: "oz",
    standard_qty: 5,
    standard_unit: "oz",
    metric_equiv: "142 g",
    notes: "Standard cans are ~5 oz (142 g) each."
  },
  {
    ingredient: "beef",
    category: "Meat & Seafood",
    package_sizes: [1, 2],
    package_unit: "lb",
    standard_qty: 1,
    standard_unit: "lb",
    metric_equiv: "0.454 kg",
    notes: "Typically sold in 1 lb packages or steaks of similar weight."
  },
  
  // Produce Category
  {
    ingredient: "apples",
    category: "Produce",
    package_sizes: [3, 5],
    package_unit: "lb",
    standard_qty: 3,
    standard_unit: "lb",
    metric_equiv: "1.36 kg",
    notes: "Often in 3 lb and 5 lb bags, or sold individually by weight."
  },
  {
    ingredient: "bananas",
    category: "Produce",
    package_sizes: [1, 2.5],
    package_unit: "lb",
    standard_qty: 1,
    standard_unit: "lb",
    metric_equiv: "0.454 kg",
    notes: "Typically sold loose by the pound. Average bunch weighs ~2.5 lb."
  },
  {
    ingredient: "oranges",
    category: "Produce",
    package_sizes: [4, 8],
    package_unit: "lb",
    standard_qty: 4,
    standard_unit: "lb",
    metric_equiv: "1.81 kg",
    notes: "Commonly sold in mesh bags of 4 lb or 8 lb."
  },
  {
    ingredient: "grapes",
    category: "Produce",
    package_sizes: [2],
    package_unit: "lb",
    standard_qty: 2,
    standard_unit: "lb",
    metric_equiv: "0.907 kg",
    notes: "Usually sold in plastic bags around 2 lb per bag."
  },
  {
    ingredient: "strawberries",
    category: "Produce",
    package_sizes: [1, 2],
    package_unit: "lb",
    standard_qty: 1,
    standard_unit: "lb",
    metric_equiv: "0.454 kg",
    notes: "Sold in 1 lb (16 oz) containers most commonly."
  },
  {
    ingredient: "blueberries",
    category: "Produce",
    package_sizes: [6, 18],
    package_unit: "oz",
    standard_qty: 6,
    standard_unit: "oz",
    metric_equiv: "170 g",
    notes: "Common package is a 6 oz clamshell. Larger 18 oz also available."
  },
  {
    ingredient: "potatoes",
    category: "Produce",
    package_sizes: [5, 10],
    package_unit: "lb",
    standard_qty: 5,
    standard_unit: "lb",
    metric_equiv: "2.27 kg",
    notes: "Bagged potatoes are usually 5 lb or 10 lb sacks."
  },
  {
    ingredient: "onions",
    category: "Produce",
    package_sizes: [2, 3, 5],
    package_unit: "lb",
    standard_qty: 3,
    standard_unit: "lb",
    metric_equiv: "1.36 kg",
    notes: "Yellow or white onions often come in 2 lb or 3 lb mesh bags."
  },
  {
    ingredient: "carrots",
    category: "Produce",
    package_sizes: [1, 2],
    package_unit: "lb",
    standard_qty: 1,
    standard_unit: "lb",
    metric_equiv: "0.454 kg",
    notes: "Whole carrots typically in 1 lb bags. 2 lb bags for baby-cut carrots."
  },
  {
    ingredient: "lettuce",
    category: "Produce",
    package_sizes: [5, 10],
    package_unit: "oz",
    standard_qty: 10,
    standard_unit: "oz",
    metric_equiv: "283 g",
    notes: "Packaged salad greens in 5 oz and 10 oz bags."
  },
  {
    ingredient: "tomatoes",
    category: "Produce",
    package_sizes: [1, 2],
    package_unit: "lb",
    standard_qty: 1,
    standard_unit: "lb",
    metric_equiv: "0.454 kg",
    notes: "Sold loose by weight, or in clamshell packages of cherry varieties."
  },
  
  // Pantry Category
  {
    ingredient: "flour",
    category: "Pantry",
    package_sizes: [2, 5, 10],
    package_unit: "lb",
    standard_qty: 5,
    standard_unit: "lb",
    metric_equiv: "2.27 kg",
    notes: "All-purpose flour typically sold in a 5 lb paper bag as standard."
  },
  {
    ingredient: "sugar",
    category: "Pantry",
    package_sizes: [4, 10],
    package_unit: "lb",
    standard_qty: 4,
    standard_unit: "lb",
    metric_equiv: "1.81 kg",
    notes: "A standard bag of granulated sugar is 4 lb."
  },
  {
    ingredient: "brown sugar",
    category: "Pantry",
    package_sizes: [2, 4],
    package_unit: "lb",
    standard_qty: 2,
    standard_unit: "lb",
    metric_equiv: "0.907 kg",
    notes: "Most commonly sold in 2 lb bags/boxes."
  },
  {
    ingredient: "baking powder",
    category: "Pantry",
    package_sizes: [8],
    package_unit: "oz",
    standard_qty: 8,
    standard_unit: "oz",
    metric_equiv: "227 g",
    notes: "Standard can of baking powder is ~8 oz."
  },
  {
    ingredient: "oil",
    category: "Pantry",
    package_sizes: [48, 128],
    package_unit: "fl oz",
    standard_qty: 48,
    standard_unit: "fl oz",
    metric_equiv: "1.42 L",
    notes: "Vegetable oil is often sold in 48 fl oz bottles (1.5 quarts)."
  },
  {
    ingredient: "vinegar",
    category: "Pantry",
    package_sizes: [16, 32, 128],
    package_unit: "fl oz",
    standard_qty: 32,
    standard_unit: "fl oz",
    metric_equiv: "946 mL",
    notes: "White vinegar is often in 32 fl oz (1 qt) bottles."
  },
  {
    ingredient: "salt",
    category: "Pantry",
    package_sizes: [26],
    package_unit: "oz",
    standard_qty: 26,
    standard_unit: "oz",
    metric_equiv: "737 g",
    notes: "The classic cylindrical container is 26 oz net weight."
  },
  {
    ingredient: "pepper",
    category: "Pantry",
    package_sizes: [2, 4],
    package_unit: "oz",
    standard_qty: 4,
    standard_unit: "oz",
    metric_equiv: "113 g",
    notes: "Ground black pepper commonly sold in tins or jars of about 2-4 oz."
  },
  {
    ingredient: "rice",
    category: "Pantry",
    package_sizes: [1, 2, 5, 10],
    package_unit: "lb",
    standard_qty: 2,
    standard_unit: "lb",
    metric_equiv: "0.907 kg",
    notes: "Common sizes are 1 lb, 2 lb, and 5 lb bags."
  },
  {
    ingredient: "pasta",
    category: "Pantry",
    package_sizes: [0.75, 1],
    package_unit: "lb",
    standard_qty: 1,
    standard_unit: "lb",
    metric_equiv: "0.454 kg",
    notes: "A standard box of dry pasta is 1 lb (16 oz)."
  },
  {
    ingredient: "peanut butter",
    category: "Pantry",
    package_sizes: [1, 2.5, 5],
    package_unit: "lb",
    standard_qty: 1,
    standard_unit: "lb",
    metric_equiv: "0.454 kg",
    notes: "Common jar sizes: 16 oz (1 lb), 28 oz, and 40 oz."
  },
  {
    ingredient: "cereal",
    category: "Pantry",
    package_sizes: [12, 18],
    package_unit: "oz",
    standard_qty: 12,
    standard_unit: "oz",
    metric_equiv: "340 g",
    notes: "A typical box is ~12 oz to 18 oz."
  },
  {
    ingredient: "oatmeal",
    category: "Pantry",
    package_sizes: [18, 42],
    package_unit: "oz",
    standard_qty: 18,
    standard_unit: "oz",
    metric_equiv: "510 g",
    notes: "Oats often come in 18 oz canisters (standard) or 42 oz (large)."
  },
  
  // Canned Goods Category
  {
    ingredient: "beans",
    category: "Pantry",
    package_sizes: [15, 29],
    package_unit: "oz",
    standard_qty: 15,
    standard_unit: "oz",
    metric_equiv: "425 g",
    notes: "Standard cans around 15 oz, family size around 29 oz."
  },
  {
    ingredient: "tomato sauce",
    category: "Pantry",
    package_sizes: [8, 15, 24],
    package_unit: "oz",
    standard_qty: 15,
    standard_unit: "oz",
    metric_equiv: "425 g",
    notes: "Common sizes include 8 oz cans and 15 oz cans."
  },
  {
    ingredient: "soup",
    category: "Pantry",
    package_sizes: [10.5, 18],
    package_unit: "oz",
    standard_qty: 10.5,
    standard_unit: "oz",
    metric_equiv: "298 g",
    notes: "Condensed soups are ~10.5 oz cans. Ready-to-serve soups ~18 oz."
  },
  {
    ingredient: "broth",
    category: "Pantry",
    package_sizes: [14.5, 32],
    package_unit: "oz",
    standard_qty: 32,
    standard_unit: "oz",
    metric_equiv: "946 mL",
    notes: "Common in 14.5 oz cans and 32 oz (1 qt) cartons."
  }
];
