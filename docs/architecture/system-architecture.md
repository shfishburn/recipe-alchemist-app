
# Recipe Alchemy System Architecture

## Overview

Recipe Alchemy is a comprehensive AI-powered recipe platform built around a microservices architecture with React frontend and Supabase backend. The system integrates multiple AI components to provide recipe generation, modification, scientific analysis, and nutritional calculations.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            Recipe Alchemy UI                             │
│   ┌───────────┐   ┌────────────┐   ┌──────────────┐   ┌─────────────┐   │
│   │ Recipe     │   │ Recipe     │   │ Shopping     │   │ User        │   │
│   │ Creation   │   │ Detail     │   │ Lists        │   │ Profiles    │   │
│   └─────┬─────┘   └──────┬─────┘   └──────┬───────┘   └──────┬──────┘   │
└─────────┼───────────────┼───────────────┼──────────────────┼───────────┘
          │               │               │                  │
┌─────────┼───────────────┼───────────────┼──────────────────┼───────────┐
│         │               │               │                  │           │
│         ▼               ▼               ▼                  ▼           │
│   ┌───────────┐   ┌─────────────┐   ┌──────────┐     ┌────────────┐    │
│   │ Recipe    │   │ Recipe      │   │ Shopping │     │ User       │    │
│   │ API       │◄──┤ Detail API  │   │ List API │     │ Profile API│    │
│   └─────┬─────┘   └──────┬──────┘   └────┬─────┘     └──────┬─────┘    │
│         │                │                │                  │          │
│   ┌─────┴─────┐     ┌────┴─────┐      ┌───┴────┐        ┌───┴────┐     │
│   │ Recipe    │     │ Recipe   │      │Shopping│        │User    │     │
│   │Generation │     │Analysis  │      │List DB │        │Profile │     │
│   │Service    │     │Service   │      │        │        │DB      │     │
│   └─────┬─────┘     └────┬─────┘      └────────┘        └────────┘     │
│         │                │                                              │
│   ┌─────┴────────────────┴──────┐     ┌─────────────────────────┐      │
│   │      OpenAI Integration     │     │     Nutrition Database   │      │
│   └────────────────────────────┘      └─────────────────────────┘      │
│                                                                         │
│                      Supabase Backend Infrastructure                    │
└─────────────────────────────────────────────────────────────────────────┘
```

## Core Systems and Data Flow

Recipe Alchemy consists of these interconnected systems:

1. **Recipe Generation System**
   - Processes user inputs (ingredients, preferences)
   - Calls OpenAI API with specialized prompts
   - Produces complete recipes with steps and nutritional estimates

2. **Recipe Detail System**
   - Displays recipes with interactive components
   - Manages recipe viewing, sharing, and printing functionality
   - Interfaces with Recipe Analysis Service

3. **Recipe Modification System**
   - Takes existing recipes and user modification requests
   - Transforms recipes while maintaining culinary integrity
   - Updates nutritional information after modifications

4. **Recipe Chat System**
   - Provides conversational interface for recipe questions
   - Maintains context about the current recipe
   - Can suggest and implement modifications

5. **Nutrition Analysis System**
   - Calculates detailed nutritional information
   - Maps ingredients to standardized nutrition database
   - Generates visual representations of nutritional data

6. **Science Analysis System**
   - Creates scientific explanations of cooking processes
   - Identifies chemical reactions in cooking steps
   - Generates educational content about food science

7. **Shopping List System**
   - Transforms recipe ingredients into shopping lists
   - Organizes items by department
   - Manages multiple lists with progress tracking

## State Management Architecture

Recipe Alchemy employs a hybrid state management approach:

1. **React Query** for server state:
   - Recipe data
   - User profiles
   - Shopping lists
   - Nutritional information

2. **Zustand** for UI state:
   - Current recipe viewing state
   - Form inputs
   - UI preferences
   - Temporary modification states

3. **Context API** for shared component state:
   - Authentication context
   - User preferences
   - Theme settings

## Data Consistency Strategy

To maintain data consistency across systems:

1. **Optimistic Updates** - UI updates immediately while changes are sent to backend
2. **Invalidation Patterns** - Related queries are invalidated when data changes
3. **Versioning** - Recipe modifications create new versions rather than overwriting
4. **Conflict Resolution** - Last-write-wins with timestamp-based resolution

## Scientific Content Flow

Scientific content flows through the system as follows:

1. **Generation Phase** - Initial scientific insights created during recipe generation
2. **Enhancement Phase** - Science Analysis System enriches content with detailed explanations
3. **Integration Phase** - Scientific content is associated with specific recipe steps
4. **Presentation Phase** - Content is displayed in the Science tab of Recipe Detail view
5. **Interaction Phase** - Recipe Chat can answer questions using scientific context

When a recipe is modified, the Scientific content is re-analyzed to ensure it remains accurate for the modified recipe steps.

## Security Architecture

See [Security Architecture](./security-architecture.md) for detailed information on:
- Authentication flows
- Authorization and access control
- Data protection measures
- API security

## Integration Patterns

See [Integration Patterns](./integration-patterns.md) for detailed information on:
- System interaction protocols
- Event flows
- Error recovery strategies
- Contract testing approach

## Related Documentation

- [Data Model](./data-model.md) - Database schemas and data structures
- [Integration Patterns](./integration-patterns.md) - How systems interact
- [Recipe Generation Pipeline](../systems/recipe-generation-pipeline.md) - Recipe creation flow
- [Performance and Scaling](../operations/performance-and-scaling.md) - System scaling approach
