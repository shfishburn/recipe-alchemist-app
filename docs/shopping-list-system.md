
# Shopping List System

This document details the Shopping List system, which enables users to create, manage, and organize shopping lists from recipes.

## System Overview

The Shopping List system allows users to:
- Create shopping lists manually or from recipes
- Organize items by department
- Track item completion status
- Search and filter items
- Share lists via copy to clipboard

## Data Model

### Shopping List Type

```typescript
interface ShoppingList {
  id: string;
  title: string;
  user_id: string;
  items: ShoppingListItem[];
  tips?: string[];
  preparation_notes?: string[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

interface ShoppingListItem {
  id: string;
  item: string;
  qty?: number;
  unit?: string;
  department?: string;
  checked: boolean;
  recipe_id?: string;
  notes?: string;
  shop_size_qty?: number;
  shop_size_unit?: string;
}
```

## Key Components

### 1. Shopping List Hook: `useShoppingList`

Located at `src/hooks/shopping-list/use-shopping-list.ts`, this custom hook provides:
- Item grouping by department
- Search functionality
- Sort options
- Item toggling
- Department expansion/collapse

### 2. ShoppingListDetail Component

Located at `src/components/shopping-list/detail/ShoppingListDetail.tsx`, this component:
- Displays all shopping list information
- Shows progress indicators
- Provides item management UI
- Offers list sharing functionality

### 3. Item Organization Utilities

Located at `src/hooks/shopping-list/item-organization.ts`, these utilities:
- Group items by department
- Sort items based on user preferences
- Filter items based on search terms

## Feature: Shopping List from Recipe

The system allows converting recipe ingredients to shopping lists:

1. **Recipe-to-List Workflow**:
   - User selects a recipe to create a list from
   - System offers options to create new list or add to existing
   - Recipe ingredients are converted to shopping items with departments

2. **Package Size Awareness**:
   - System can consider grocery package sizes
   - Helps users buy appropriate quantities
   - Reduces waste by matching recipe needs to available package sizes

## Feature: Intelligent Department Assignment

The system assigns departments to items using:
1. **Common Department Mapping**:
   - Most common ingredients have predefined departments
   - Follows standard grocery store organization

2. **Fallback Logic**:
   - Uses ingredient category as department when specific mapping unavailable
   - Default department for completely unknown items

## User Interactions

### Creating Lists

1. **From Recipe**:
   - On recipe detail page
   - Through shopping list button
   - Options for new list or add to existing

2. **Manually**:
   - From shopping lists page
   - Add individual items with custom form

### Managing Lists

1. **Item Management**:
   - Check/uncheck items
   - Delete items
   - Edit item details
   - Add notes to items

2. **List Organization**:
   - Search filtering
   - Department grouping
   - Sort by various criteria (alphabetical, department, checked status)

## Implementation Details

### Shopping List Service

Located at `src/services/ShoppingListService.ts`, this service:
- Converts recipe ingredients to shopping items
- Handles unit normalization
- Assigns departments to items
- Manages package size calculations

### Database Integration

The system uses Supabase for data storage:
- `shopping_lists` table for list metadata and items
- Row-level security ensures users only see their lists
- Real-time updates for collaborative list management

## Performance Optimizations

The Shopping List system includes several optimizations:

1. **Touch Optimizations**:
   - Larger touch targets for mobile
   - Custom scroll behavior for touch devices

2. **Lazy Loading**:
   - Lists are loaded on demand
   - Pagination for users with many lists

3. **Memoization**:
   - Expensive calculations like department grouping are memoized
   - Prevents unnecessary re-renders

## Future Enhancements

Planned improvements to the Shopping List system:

1. **Smart List Merging**:
   - Improved combination of lists to avoid duplicates
   - Intelligent quantity merging

2. **Barcode Scanning**:
   - Add items via barcode scanning
   - Check off items using phone camera

3. **List Templates**:
   - Save frequently used lists as templates
   - Quick generation of common shopping lists
