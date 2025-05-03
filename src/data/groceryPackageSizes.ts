
export interface GroceryPackageSize {
  ingredient: string;
  category: string;
  standard_qty: number;
  standard_unit: string;
  metric_equiv: string;
  package_sizes: number[];
  package_unit: string;
  notes: string;
}

export const groceryPackageSizes: GroceryPackageSize[] = [
  {
    "ingredient": "Milk",
    "category": "Dairy",
    "standard_qty": 1,
    "standard_unit": "gallon",
    "metric_equiv": "3.785 L",
    "package_sizes": [0.5, 1],
    "package_unit": "gallon",
    "notes": "Sold in half-gallon (64 fl oz) and one-gallon (128 fl oz) jugs as standard."
  },
  {
    "ingredient": "Eggs",
    "category": "Dairy",
    "standard_qty": 12,
    "standard_unit": "count",
    "metric_equiv": "1 dozen",
    "package_sizes": [6, 12, 18],
    "package_unit": "count",
    "notes": "Usually sold by the dozen (12 eggs per carton)."
  },
  {
    "ingredient": "Butter",
    "category": "Dairy",
    "standard_qty": 1,
    "standard_unit": "lb",
    "metric_equiv": "0.454 kg",
    "package_sizes": [0.5, 1],
    "package_unit": "lb",
    "notes": "Standard butter packages are 1 lb (usually four 1/4-lb sticks)."
  },
  {
    "ingredient": "Cheese",
    "category": "Dairy",
    "standard_qty": 1,
    "standard_unit": "lb",
    "metric_equiv": "0.454 kg",
    "package_sizes": [0.5, 1],
    "package_unit": "lb",
    "notes": "Cheese commonly comes in 8 oz blocks or bags (shredded) and 16 oz (1 lb) packages."
  },
  {
    "ingredient": "Ground Beef",
    "category": "Meat",
    "standard_qty": 1,
    "standard_unit": "lb",
    "metric_equiv": "0.454 kg",
    "package_sizes": [1, 3],
    "package_unit": "lb",
    "notes": "Commonly sold in 1 lb packages (tray packs or chubs)."
  },
  {
    "ingredient": "Chicken Breast",
    "category": "Meat",
    "standard_qty": 1,
    "standard_unit": "lb",
    "metric_equiv": "0.454 kg",
    "package_sizes": [1, 2],
    "package_unit": "lb",
    "notes": "Boneless skinless chicken breasts are typically sold in packs totaling ~1 to 2 lbs."
  },
  {
    "ingredient": "Flour",
    "category": "Pantry",
    "standard_qty": 5,
    "standard_unit": "lb",
    "metric_equiv": "2.27 kg",
    "package_sizes": [2, 5, 10],
    "package_unit": "lb",
    "notes": "All-purpose flour is typically sold in a 5 lb paper bag as the standard."
  },
  {
    "ingredient": "Sugar",
    "category": "Pantry",
    "standard_qty": 4,
    "standard_unit": "lb",
    "metric_equiv": "1.81 kg",
    "package_sizes": [4, 10],
    "package_unit": "lb",
    "notes": "A standard bag of sugar in U.S. grocery stores is 4 lb."
  },
  {
    "ingredient": "Rice",
    "category": "Pantry",
    "standard_qty": 1,
    "standard_unit": "lb",
    "metric_equiv": "0.454 kg",
    "package_sizes": [1, 2, 5, 10],
    "package_unit": "lb",
    "notes": "Many brands offer 1 lb or 2 lb bags/boxes for instant or specialty rice."
  },
  {
    "ingredient": "Pasta",
    "category": "Pantry",
    "standard_qty": 1,
    "standard_unit": "lb",
    "metric_equiv": "0.454 kg",
    "package_sizes": [0.75, 1],
    "package_unit": "lb",
    "notes": "A standard box of dry pasta is 1 lb (16 oz)."
  },
  {
    "ingredient": "Canned Tomatoes",
    "category": "Canned Goods",
    "standard_qty": 14.5,
    "standard_unit": "oz",
    "metric_equiv": "411 g",
    "package_sizes": [14.5, 28],
    "package_unit": "oz",
    "notes": "Standard tomato cans ~14.5 oz (411 g)."
  },
  {
    "ingredient": "Broth",
    "category": "Canned Goods",
    "standard_qty": 14.5,
    "standard_unit": "oz",
    "metric_equiv": "411 g",
    "package_sizes": [14.5, 32],
    "package_unit": "oz",
    "notes": "Broths commonly in ~14 oz cans and in 32 oz (1 qt) aseptic cartons."
  },
  {
    "ingredient": "Cooking Oil",
    "category": "Pantry",
    "standard_qty": 1,
    "standard_unit": "gal",
    "metric_equiv": "128 fl oz ≈3.785 L",
    "package_sizes": [48, 128],
    "package_unit": "fl oz",
    "notes": "Vegetable oil is often sold in 48 fl oz bottles (1.5 quarts, ~1.42 L) and 128 fl oz jugs (1 gallon)."
  },
  {
    "ingredient": "Salt",
    "category": "Spices",
    "standard_qty": 26,
    "standard_unit": "oz",
    "metric_equiv": "737 g",
    "package_sizes": [26],
    "package_unit": "oz",
    "notes": "The classic cylindrical container of iodized salt is 26 oz net weight."
  },
  {
    "ingredient": "Pepper",
    "category": "Spices",
    "standard_qty": 4,
    "standard_unit": "oz",
    "metric_equiv": "113 g",
    "package_sizes": [2, 4, 16],
    "package_unit": "oz",
    "notes": "Ground black pepper is commonly sold in tins or jars of about 2 oz to 4 oz for home use."
  },
  {
    "ingredient": "Potatoes",
    "category": "Produce",
    "standard_qty": 5,
    "standard_unit": "lb",
    "metric_equiv": "2.27 kg",
    "package_sizes": [5, 10],
    "package_unit": "lb",
    "notes": "Bagged potatoes are usually 5 lb or 10 lb sacks for russets and other varieties."
  },
  {
    "ingredient": "Onions",
    "category": "Produce",
    "standard_qty": 3,
    "standard_unit": "lb",
    "metric_equiv": "1.36 kg",
    "package_sizes": [2, 3, 5],
    "package_unit": "lb",
    "notes": "Yellow or white onions often come in 2 lb or 3 lb mesh bags."
  }
];
