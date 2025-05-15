
# Integration Between AI Systems

The AI systems in Recipe Alchemy are interconnected in several ways to provide a cohesive user experience.

## System Interconnections

1. Recipe generation creates the initial recipe with scientific steps
2. Recipe chat can analyze and suggest modifications to the recipe
3. Recipe modification can implement user-requested changes
4. Nutrition system provides data used by the Nutri-Score calculation
5. Science notes are extracted and enhanced across multiple systems

## Data Flow Between Systems

```
┌───────────────────┐      ┌───────────────────┐      ┌───────────────────┐
│                   │      │                   │      │                   │
│  Recipe Generation├─────►│  Recipe Chat      ├─────►│  Recipe           │
│                   │      │                   │      │  Modification     │
└─────────┬─────────┘      └───────────────────┘      └─────────┬─────────┘
          │                                                     │
          │                                                     │
          ▼                                                     ▼
┌───────────────────┐                              ┌───────────────────┐
│                   │                              │                   │
│  Nutrition        │◄─────────────────────────────┤  Science Notes    │
│  Analysis         │                              │  Generation       │
│                   │                              │                   │
└───────────────────┘                              └───────────────────┘
```

## Shared Components

Several components are shared across different AI systems:

1. **Prompt Components**: Common prompt elements are defined in `supabase/functions/_shared/recipe-prompts.ts`
2. **Response Processing**: Common response parsing logic shared across systems
3. **Error Handling**: Standardized error handling approaches

## System-Specific Integrations

### Recipe Generation → Recipe Chat

- Chat system can access the full context of a generated recipe
- Questions about recipe steps are answered with access to the scientific context

### Recipe Chat → Recipe Modification

- Chat suggestions can be converted to modification requests
- Scientific explanations from chat are incorporated into modification reasoning

### Recipe Modification → Nutrition Analysis

- Modifications trigger nutrition recalculation
- Nutrition impact of changes is analyzed and presented to user

### Nutrition Analysis → Science Notes

- Nutrition data informs the scientific explanations
- Nutritional benefits are included in science notes

## Cross-Cutting Concerns

These aspects are handled consistently across all AI systems:

1. **Ingredient Format Standardization**: All systems use the same ingredient format
2. **Temperature Specification**: Both °F and °C are always provided
3. **Shopping Package Sizes**: Consistent approach to package size recommendations
4. **López-Alt Scientific Style**: Maintained across all systems

## Edge Function Integration

The Supabase Edge Functions provide the backend for each AI system:

1. `generate-quick-recipe` - Handles recipe creation
2. `recipe-chat` - Processes chat requests
3. `modify-quick-recipe` - Handles recipe modifications
4. `nutrisynth-analysis` - Performs nutrition analysis

## Conclusion

The integrated approach ensures consistency in the scientific explanations and culinary guidance throughout the application. By leveraging specialized prompts in the style of J. Kenji López-Alt and maintaining consistent data formats, the application provides users with a seamless experience across its various AI-powered features.
