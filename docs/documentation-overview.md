
# Documentation Overview

This document provides a comprehensive overview of all documentation files available for the Recipe Alchemy application, their status, and brief descriptions.

## Available Documentation

| Document | Status | Description |
|----------|--------|-------------|
| [User Guide Overview](./user-guide/overview.md) | Complete | A high-level overview of all features with links to detailed guides |
| [Recipe Generation Pipeline](./recipe-generation-pipeline.md) | Complete | Details the recipe generation process, components, and flows |
| [Recipe Chat System](./recipe-chat-system.md) | Complete | Describes the Recipe Chat system, including message flows, UI components, and backend interactions |
| [Recipe Modification Pipeline](./recipe-modification-pipeline.md) | Complete | Explains how recipes are modified using AI, the architecture, and implementation |
| [Shopping List System](./shopping-list-system.md) | Complete | Documentation for the shopping list functionality, including data models and user interactions |
| [Recipe Detail System](./recipe-detail-system.md) | Complete | Covers the recipe detail pages, components, and functionality |
| [Science Analysis System](./science-analysis-system.md) | Complete | Documents the science analysis feature that provides insights into cooking processes |
| [Nutrition Analysis System](./nutrition-analysis-system.md) | Complete | Explains the nutrition analysis system, calculations, and visualization components |
| [AI Prompts and Responses](./ai-prompts-and-responses.md) | Complete | Comprehensive overview of all AI prompt systems and response formats used throughout the application |
| [Data Model](./data-model.md) | Complete | Comprehensive documentation of the database schema, relationships, and key fields |
| [User Guide - Feature Areas](./user-guide/) | Complete | Detailed guides for specific feature areas of the application |

## Edge Functions

The application uses several Supabase Edge Functions for secure backend processing:

| Function | Purpose | Related Documentation |
|----------|---------|------------------------|
| [generate-quick-recipe](../supabase/functions/generate-quick-recipe/) | Generates recipe content using AI | [Recipe Generation Pipeline](./recipe-generation-pipeline.md) |
| [modify-quick-recipe](../supabase/functions/modify-quick-recipe/) | Modifies existing recipes with AI assistance | [Recipe Modification Pipeline](./recipe-modification-pipeline.md) |
| [generate-recipe-image](../supabase/functions/generate-recipe-image/) | Creates images for recipes | [Recipe Detail System](./recipe-detail-system.md) |
| [recipe-chat](../supabase/functions/recipe-chat/) | Handles conversational AI about recipes | [Recipe Chat System](./recipe-chat-system.md), [AI Prompts and Responses](./ai-prompts-and-responses.md) |
| [fuse-nutrition](../supabase/functions/fuse-nutrition/) | Combines nutrition data from multiple sources | [Nutrition Analysis System](./nutrition-analysis-system.md) |
| [usda-food-api](../supabase/functions/usda-food-api/) | Interfaces with USDA Food Data Central API | [Nutrition Analysis System](./nutrition-analysis-system.md) |
| [analyze-reactions](../supabase/functions/analyze-reactions/) | Analyzes chemical reactions in cooking steps | [Science Analysis System](./science-analysis-system.md) |

## Architecture Overview

The Recipe Alchemy application is built with a modern React frontend and Supabase backend architecture:

- **Frontend**: React + TypeScript application using Tailwind CSS and shadcn/ui components
- **Backend**: Supabase for authentication, database, and serverless edge functions
- **AI Integration**: OpenAI API for recipe generation, modification, and analysis

## Key System Interactions

The application consists of several interconnected systems:

1. **Recipe Generation** → Creates new recipes based on user inputs
2. **Recipe Modification** → Allows AI-powered updates to existing recipes
3. **Recipe Chat** → Enables conversational interaction about recipes
4. **Shopping List** → Converts recipes to shopping lists with intelligent organization
5. **Nutrition Analysis** → Calculates and visualizes nutritional information
6. **Science Analysis** → Provides scientific explanations for cooking processes

## Technology Stack

- **Frontend Framework**: React 18
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query + Context API + Zustand
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **AI Provider**: OpenAI GPT models
- **External APIs**: USDA Food Data Central

## Database Schema

The application uses a comprehensive database schema with over 20 tables to support its features. Key tables include:

- `recipes` - Core recipe data
- `profiles` - User profile information
- `shopping_lists` - User shopping lists
- `usda_foods` - Nutritional database
- `recipe_step_reactions` - Scientific cooking analysis
- `food_embeddings` - Vector representations for semantic matching

For detailed information on the database schema, see the [Data Model](./data-model.md) documentation.
