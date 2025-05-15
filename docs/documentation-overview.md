
# Documentation Overview

This document provides a comprehensive overview of all documentation files available for the Recipe Alchemy application, their status, and brief descriptions.

## Available Documentation

| Document | Status | Description |
|----------|--------|-------------|
| [Recipe Chat System](./recipe-chat-system.md) | Complete | Describes the Recipe Chat system, including message flows, UI components, and backend interactions |
| [Recipe Generation Pipeline](./recipe-generation-pipeline.md) | Complete | Details the recipe generation process, components, and flows |
| [Recipe Modification Pipeline](./recipe-modification-pipeline.md) | Complete | Explains how recipes are modified using AI, the architecture, and implementation |
| [Shopping List System](./shopping-list-system.md) | Complete | Documentation for the shopping list functionality, including data models and user interactions |
| [Recipe Detail System](./recipe-detail-system.md) | Complete | Covers the recipe detail pages, components, and functionality |
| [Science Analysis System](./science-analysis-system.md) | Complete | Documents the science analysis feature that provides insights into cooking processes |
| [Nutrition Analysis System](./nutrition-analysis-system.md) | Complete | Explains the nutrition analysis system, calculations, and visualization components |

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
