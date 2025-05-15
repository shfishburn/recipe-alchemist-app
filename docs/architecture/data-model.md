# Data Model

This document outlines the data model for the Recipe Alchemy application, including database schemas and data structures.

## Database Schema

The application uses a relational database schema with the following tables:

### 1. Users

Stores user account information.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Profiles

Stores user profile details.

```sql
CREATE TABLE profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    display_name VARCHAR(255),
    avatar_url VARCHAR(255),
    bio TEXT,
    dietary_preferences JSONB,
    body_composition JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Recipes

Stores recipe metadata.

```sql
CREATE TABLE recipes (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    cuisine VARCHAR(100),
    dietary_restrictions JSONB,
    servings INTEGER,
    image_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Ingredients

Stores individual ingredient information.

```sql
CREATE TABLE ingredients (
    id UUID PRIMARY KEY,
    recipe_id UUID REFERENCES recipes(id),
    name VARCHAR(255) NOT NULL,
    quantity DECIMAL,
    unit VARCHAR(50),
    preparation VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Instructions

Stores recipe instructions.

```sql
CREATE TABLE instructions (
    id UUID PRIMARY KEY,
    recipe_id UUID REFERENCES recipes(id),
    step_number INTEGER NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Nutrition

Stores nutritional information for recipes.

```sql
CREATE TABLE nutrition (
    id UUID PRIMARY KEY,
    recipe_id UUID REFERENCES recipes(id),
    calories DECIMAL,
    protein DECIMAL,
    fat DECIMAL,
    carbohydrates DECIMAL,
    sugar DECIMAL,
    fiber DECIMAL,
    sodium DECIMAL,
    cholesterol DECIMAL,
    vitamin_a DECIMAL,
    vitamin_c DECIMAL,
    calcium DECIMAL,
    iron DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 7. Shopping Lists

Stores user shopping lists.

```sql
CREATE TABLE shopping_lists (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 8. Shopping List Items

Stores items in a shopping list.

```sql
CREATE TABLE shopping_list_items (
    id UUID PRIMARY KEY,
    list_id UUID REFERENCES shopping_lists(id),
    name VARCHAR(255) NOT NULL,
    quantity DECIMAL,
    unit VARCHAR(50),
    is_checked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 9. Science Notes

Stores scientific explanations for recipes.

```sql
CREATE TABLE science_notes (
    id UUID PRIMARY KEY,
    recipe_id UUID REFERENCES recipes(id),
    section VARCHAR(255),
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Data Structures

### 1. User Object

```typescript
interface User {
    id: string;
    email: string;
    username?: string;
    created_at: string;
    updated_at: string;
}
```

### 2. Profile Object

```typescript
interface Profile {
    user_id: string;
    display_name?: string;
    avatar_url?: string;
    bio?: string;
    dietary_preferences?: {
        vegetarian: boolean;
        vegan: boolean;
        gluten_free: boolean;
        // ... other preferences
    };
    body_composition?: {
        weight: number;
        height: number;
        activity_level: string;
        // ... other metrics
    };
    created_at: string;
    updated_at: string;
}
```

### 3. Recipe Object

```typescript
interface Recipe {
    id: string;
    user_id?: string;
    title: string;
    cuisine?: string;
    dietary_restrictions?: string[];
    servings?: number;
    image_url?: string;
    created_at: string;
    updated_at: string;
}
```

### 4. Ingredient Object

```typescript
interface Ingredient {
    id: string;
    recipe_id?: string;
    name: string;
    quantity?: number;
    unit?: string;
    preparation?: string;
    created_at: string;
    updated_at: string;
}
```

### 5. Instruction Object

```typescript
interface Instruction {
    id: string;
    recipe_id?: string;
    step_number: number;
    text: string;
    created_at: string;
    updated_at: string;
}
```

### 6. Nutrition Object

```typescript
interface Nutrition {
    id: string;
    recipe_id?: string;
    calories?: number;
    protein?: number;
    fat?: number;
    carbohydrates?: number;
    sugar?: number;
    fiber?: number;
    sodium?: number;
    cholesterol?: number;
    vitamin_a?: number;
    vitamin_c?: number;
    calcium?: number;
    iron?: number;
    created_at: string;
    updated_at: string;
}
```

### 7. Shopping List Object

```typescript
interface ShoppingList {
    id: string;
    user_id?: string;
    title: string;
    created_at: string;
    updated_at: string;
}
```

### 8. Shopping List Item Object

```typescript
interface ShoppingListItem {
    id: string;
    list_id?: string;
    name: string;
    quantity?: number;
    unit?: string;
    is_checked: boolean;
    created_at: string;
    updated_at: string;
}
```

### 9. Science Note Object

```typescript
interface ScienceNote {
    id: string;
    recipe_id?: string;
    section: string;
    content: string;
    created_at: string;
    updated_at: string;
}
```

## Relationships

- A `User` can have one `Profile`.
- A `User` can have multiple `Recipes`.
- A `Recipe` can have multiple `Ingredients`.
- A `Recipe` can have multiple `Instructions`.
- A `Recipe` has one `Nutrition` entry.
- A `Recipe` can have multiple `ScienceNotes`.
- A `User` can have multiple `ShoppingLists`.
- A `ShoppingList` can have multiple `ShoppingListItems`.

## JSONB Usage

The `dietary_preferences` and `body_composition` fields in the `profiles` table use the JSONB data type to allow flexible storage of user preferences and body metrics.

## Data Validation

Data validation is performed at multiple levels:

1.  **Database Constraints**:  `NOT NULL`, `UNIQUE`, and foreign key constraints enforce data integrity.
2.  **API Validation**:  API endpoints validate request data before writing to the database.
3.  **Client-Side Validation**:  Client-side forms validate user input before submitting to the API.

## Related Documentation

-   [System Architecture](./system-architecture.md) - Overall system architecture
-   [Recipe Generation Pipeline](../systems/recipe-generation-pipeline.md) - Recipe creation flow
-   [Nutrition Analysis System](../systems/nutrition-analysis-system.md) - Nutrition calculation details
