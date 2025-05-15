
# Data Model Documentation

This document provides a comprehensive overview of the data model used in Recipe Alchemy, including database tables, relationships, and key fields.

## Core Tables

### recipes

The central table storing recipe information.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| title | text | Recipe title |
| description | text | Brief description of the recipe |
| instructions | text[] | Array of step-by-step instructions |
| ingredients | jsonb | Structured ingredients data |
| servings | integer | Number of servings |
| prep_time_min | integer | Preparation time in minutes |
| cook_time_min | integer | Cooking time in minutes |
| image_url | text | URL to recipe image |
| user_id | uuid | Reference to user who created the recipe |
| cuisine | text | Cuisine type (e.g., Italian, Mexican) |
| cuisine_category | enum | Broader cuisine category |
| dietary | text | Dietary classification (e.g., vegetarian, keto) |
| flavor_tags | text[] | Array of flavor profile tags |
| nutrition | jsonb | Nutrition information |
| nutrition_fused | jsonb | AI-enhanced nutrition data |
| nutrition_confidence | jsonb | Confidence scores for nutrition data |
| nutri_score | jsonb | Nutritional scoring system data |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |
| version_number | integer | Version tracking |
| previous_version_id | uuid | Reference to previous version |
| deleted_at | timestamp | Soft delete timestamp |
| slug | text | URL-friendly identifier |
| chef_notes | text | Special preparation notes |
| cooking_tip | text | Helpful tips for cooking |
| reasoning | text | AI reasoning for recipe generation |
| science_notes | jsonb | Scientific cooking explanations |
| tagline | text | Short marketing description |

### profiles

Stores user profile information.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key (matches auth.users) |
| username | text | User's display name |
| avatar_url | text | URL to profile picture |
| created_at | timestamp | Account creation time |
| nutrition_preferences | jsonb | User's dietary preferences |
| weight_goal_type | text | Weight management goal |
| weight_goal_deficit | integer | Calorie deficit target |

### favorites

Tracks which recipes users have favorited.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | User reference |
| recipe_id | uuid | Recipe reference |
| created_at | timestamp | When the recipe was favorited |

### shopping_lists

Contains user-created shopping lists.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| title | text | Shopping list name |
| items | jsonb | Array of shopping items |
| user_id | uuid | User reference |
| tips | text[] | Helpful shopping tips |
| preparation_notes | text[] | Recipe preparation notes |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |
| deleted_at | timestamp | Soft delete timestamp |

### recipe_chats

Stores conversational interactions about recipes.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| recipe_id | uuid | Recipe reference |
| user_message | text | User's query/message |
| ai_response | text | AI-generated response |
| changes_suggested | jsonb | Suggested recipe modifications |
| applied | boolean | Whether changes were applied |
| created_at | timestamp | Message timestamp |
| meta | jsonb | Additional metadata |
| source_type | text | Origin of conversation |
| source_url | text | Reference URL if applicable |
| source_image | text | Reference image if applicable |
| deleted_at | timestamp | Soft delete timestamp |

## Nutrition & Scientific Data Tables

### usda_foods

USDA food database with nutritional information.

| Column | Type | Description |
|--------|------|-------------|
| id | integer | Primary key |
| food_code | varchar | USDA food code identifier |
| food_name | text | Food item name |
| calories | numeric | Energy in kcal |
| protein_g | numeric | Protein content in grams |
| carbs_g | numeric | Carbohydrate content in grams |
| fat_g | numeric | Fat content in grams |
| fiber_g | numeric | Dietary fiber in grams |
| sugar_g | numeric | Sugar content in grams |
| sodium_mg | numeric | Sodium in milligrams |
| potassium_mg | numeric | Potassium in milligrams |
| calcium_mg | numeric | Calcium in milligrams |
| iron_mg | numeric | Iron in milligrams |
| vitamin_a_iu | numeric | Vitamin A in International Units |
| vitamin_c_mg | numeric | Vitamin C in milligrams |
| vitamin_d_iu | numeric | Vitamin D in International Units |
| created_at | timestamp | Record creation time |
| updated_at | timestamp | Record update time |

### ingredient_nutrition_fused

AI-enhanced nutrition data combining multiple sources.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| ingredient_text | text | Original ingredient text |
| normalized_name | text | Standardized ingredient name |
| nutrition | jsonb | Combined nutritional data |
| sources | jsonb | Source references |
| confidence | jsonb | Confidence metrics |
| fusion_method | text | Algorithm used for fusion |
| provenance | jsonb | Data lineage information |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

### recipe_step_reactions

Chemical and scientific explanations for cooking steps.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| recipe_id | uuid | Recipe reference |
| step_index | integer | Instruction step number |
| step_text | text | Original instruction text |
| reactions | text[] | Chemical reactions occurring |
| reaction_details | text[] | Detailed explanation |
| cooking_method | text | Method classification |
| temperature_celsius | numeric | Operating temperature |
| duration_minutes | numeric | Process duration |
| chemical_systems | jsonb | Chemical systems involved |
| thermal_engineering | jsonb | Heat transfer details |
| process_parameters | jsonb | Process control parameters |
| ingredient_context | text[] | Relevant ingredients |
| confidence | numeric | Analysis confidence score |
| created_at | timestamp | Analysis timestamp |
| metadata | jsonb | Additional metadata |

## Vector Database Tables

### food_embeddings

Vector embeddings for semantic food matching.

| Column | Type | Description |
|--------|------|-------------|
| id | integer | Primary key |
| food_code | varchar | USDA food code |
| embedding | vector | Numerical vector representation |
| embedding_version | integer | Model version |
| embedding_model | text | AI model used |
| embedding_text | text | Text used for embedding |
| embedding_id | text | Unique embedding identifier |
| is_current | boolean | Whether this is the active embedding |
| created_at | timestamp | Creation timestamp |
| metadata | jsonb | Additional embedding metadata |

### ingredient_embeddings

Vector embeddings for ingredient matching.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| ingredient_text | text | Original ingredient text |
| normalized_text | text | Standardized ingredient name |
| embedding | vector | Vector representation |
| confidence_score | float | Match confidence |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

## Reference & Support Tables

### grocery_package_sizes

Standard grocery package sizing data.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| ingredient | text | Ingredient name |
| category | text | Product category |
| standard_qty | numeric | Base quantity |
| standard_unit | text | Measurement unit |
| package_unit | text | Packaging unit |
| package_sizes | numeric[] | Common package sizes |
| metric_equiv | text | Metric equivalent |
| notes | text | Additional information |
| created_at | timestamp | Record creation time |
| updated_at | timestamp | Record update time |

### usda_yield_factors

Cooking yield adjustment factors.

| Column | Type | Description |
|--------|------|-------------|
| id | integer | Primary key |
| food_category | varchar | Food category |
| cooking_method | varchar | Method of preparation |
| yield_factor | numeric | Weight change factor |
| description | text | Explanatory notes |
| source | text | Data source |
| created_at | timestamp | Record creation time |
| updated_at | timestamp | Record update time |

### usda_unit_conversions

Unit conversion factors for ingredients.

| Column | Type | Description |
|--------|------|-------------|
| id | integer | Primary key |
| food_category | varchar | Food category |
| from_unit | varchar | Source unit |
| to_unit | varchar | Target unit |
| conversion_factor | numeric | Multiplication factor |
| notes | text | Additional context |
| created_at | timestamp | Record creation time |
| updated_at | timestamp | Record update time |

## Relationships

1. **recipes** ← **favorites**: Many-to-many relationship between users and recipes
2. **recipes** → **recipe_chats**: One-to-many relationship (a recipe can have multiple chat sessions)
3. **recipes** → **recipe_step_reactions**: One-to-many relationship (each recipe step has scientific explanations)
4. **profiles** → **shopping_lists**: One-to-many relationship (a user can have multiple shopping lists)
5. **usda_foods** → **food_embeddings**: One-to-many relationship (a food can have multiple vector embeddings)

## Data Flow Architecture

The Recipe Alchemy system uses a multi-layered data approach:

1. **Core Data**: Recipe content, user profiles, favorites, shopping lists
2. **Scientific Layer**: Chemical reactions, cooking processes
3. **Nutritional Layer**: Food composition, nutrition fusion
4. **Vector Database**: Semantic matching and similarity searching
5. **Reference Data**: Conversion factors, package sizing, yield adjustments

Each layer supports specific application features while maintaining data integrity through well-defined relationships.
