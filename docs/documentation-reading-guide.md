
# Documentation Reading Guide

Welcome to the Recipe Alchemy documentation! This guide will help you navigate through our documentation in the most efficient and logical order based on your needs and interests.

## Introduction

Recipe Alchemy's documentation is organized into several interconnected documents that cover different aspects of the application. This guide provides a recommended reading order to help you understand the system architecture, features, and implementation details in a structured way.

## Recommended Reading Order

For the most effective understanding of Recipe Alchemy, we recommend reading the documentation in the following order:

1. **[User Guide](./user-guide.md)** - Start here to get a comprehensive overview of all features from a user perspective
2. **[Documentation Overview](./documentation-overview.md)** - Review this for a high-level summary of all available documentation
3. **[Recipe Generation Pipeline](./recipe-generation-pipeline.md)** - Understand the core recipe creation process
4. **[Recipe Detail System](./recipe-detail-system.md)** - Learn how recipe information is displayed and organized
5. **[Recipe Modification Pipeline](./recipe-modification-pipeline.md)** - Explore how recipes can be modified using AI
6. **[Recipe Chat System](./recipe-chat-system.md)** - Discover the conversational interface for recipe interactions
7. **[AI Prompts and Responses](./ai-prompts-and-responses.md)** - Understand how AI models are prompted and how responses are processed
8. **[Nutrition Analysis System](./nutrition-analysis-system.md)** - Understand how nutritional information is calculated and displayed
9. **[Science Analysis System](./science-analysis-system.md)** - Learn about the scientific explanations provided for cooking processes
10. **[Shopping List System](./shopping-list-system.md)** - Explore how shopping lists are created and managed
11. **[Data Model](./data-model.md)** - Dive into the database schema and relationships (more technical)

## Reading Paths by Role

### For End Users and Product Managers
1. User Guide
2. Documentation Overview
3. Recipe Generation Pipeline
4. Recipe Detail System
5. Recipe Modification Pipeline
6. Shopping List System

### For Developers and Technical Staff
1. Documentation Overview
2. Data Model
3. Recipe Generation Pipeline
4. Recipe Chat System
5. AI Prompts and Responses
6. Recipe Modification Pipeline
7. Nutrition Analysis System
8. Science Analysis System
9. Shopping List System

### For Data Scientists and Nutritionists
1. User Guide
2. AI Prompts and Responses
3. Nutrition Analysis System
4. Science Analysis System
5. Recipe Modification Pipeline
6. Data Model

## Document Dependencies

The following diagram illustrates the relationships and dependencies between documents:

```
                   ┌───────────────────────┐
                   │   User Guide          │
                   └───────────────────────┘
                              │
                              ▼
                   ┌───────────────────────┐
                   │ Documentation Overview│
                   └───────────────────────┘
                              │
               ┌──────────────┴──────────────┐
               │                             │
               ▼                             ▼
┌──────────────────────┐         ┌─────────────────────┐
│Recipe Generation     │         │  Data Model         │
│Pipeline              │         │                     │
└──────────────────────┘         └─────────────────────┘
     │         │                            │
     │         │         ┌──────────────────┘
     │         │         │
     ▼         ▼         ▼
┌────────────────────┐  ┌─────────────────────┐
│Recipe Detail       │  │Recipe Chat          │
│System              │──│System               │
└────────────────────┘  └─────────────────────┘
     │                            │
     ▼                            ▼
┌────────────────────┐  ┌─────────────────────┐
│Recipe Modification │  │AI Prompts and       │
│Pipeline            │──│Responses            │
└────────────────────┘  └─────────────────────┘
     │                            │
     │                            ▼
     │               ┌─────────────────────┐
     │               │Nutrition Analysis   │
     │               │System               │
     │               └─────────────────────┘
     │                            │
     │                            ▼
     │               ┌─────────────────────┐
     │               │Science Analysis     │
     │               │System               │
     │               └─────────────────────┘
     ▼                            
┌────────────────────┐           
│Shopping List       │           
│System              │           
└────────────────────┘           
```

## Key Document Summaries

### User Guide
A comprehensive overview of all features available to users throughout the application, organized by feature areas with links to more detailed documentation.

### Documentation Overview
A high-level summary of all available documentation files, their status, and brief descriptions. This serves as a reference point for locating specific documentation.

### Recipe Generation Pipeline
Details the core process of how recipes are generated using AI, including the components, data flow, implementation details, and the related Edge Function (`generate-quick-recipe`).

### Recipe Detail System
Explains how recipe information is displayed and organized, including the tabbed interface, nutritional analysis, and scientific explanations.

### Recipe Modification Pipeline
Describes the system for modifying existing recipes using AI, including the conversational interface, application of changes, and the Edge Function (`modify-quick-recipe`).

### Recipe Chat System
Covers the conversational interface for interacting with recipes, including message flows, UI components, backend integration, and the Edge Function (`recipe-chat`).

### AI Prompts and Responses
Provides detailed information about all AI prompt systems and response formats used throughout the application, including prompt engineering techniques, response processing, and data flows.

### Nutrition Analysis System
Explains how nutritional information is calculated, analyzed, and visualized for recipes using the Edge Functions (`fuse-nutrition` and `usda-food-api`).

### Science Analysis System
Details the system that provides scientific explanations for cooking processes and techniques in recipes using the Edge Function (`analyze-reactions`).

### Shopping List System
Describes the functionality for creating, managing, and organizing shopping lists from recipes using the Edge Function (`generate-shopping-list`).

### Data Model
Provides comprehensive documentation of the database schema, relationships, and key fields that underpin the entire application.

## Edge Functions Reference

Recipe Alchemy uses several Supabase Edge Functions for secure backend processing. Each function is referenced in its relevant system documentation:

| Edge Function | Primary Documentation | Purpose |
|---------------|------------------------|---------|
| `generate-quick-recipe` | [Recipe Generation Pipeline](./recipe-generation-pipeline.md) | Generates recipe content using AI |
| `modify-quick-recipe` | [Recipe Modification Pipeline](./recipe-modification-pipeline.md) | Modifies existing recipes with AI assistance |
| `recipe-chat` | [Recipe Chat System](./recipe-chat-system.md) | Handles conversational AI about recipes |
| `analyze-reactions` | [Science Analysis System](./science-analysis-system.md) | Analyzes chemical reactions in cooking steps |
| `fuse-nutrition` | [Nutrition Analysis System](./nutrition-analysis-system.md) | Combines nutrition data from multiple sources |
| `usda-food-api` | [Nutrition Analysis System](./nutrition-analysis-system.md) | Interfaces with USDA Food Data Central API |
| `generate-recipe-image` | [Recipe Detail System](./recipe-detail-system.md) | Creates images for recipes |

## Conclusion

By following this reading guide, you'll gain a structured understanding of Recipe Alchemy's architecture and functionality. If you're looking for specific information, refer to the Document Summaries section to identify the most relevant document for your needs.

For technical details about specific implementations, the Data Model document serves as an excellent reference point for understanding how different components interact with the database, while the AI Prompts and Responses document provides critical insights into how AI models are leveraged throughout the system.
