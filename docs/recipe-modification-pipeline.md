
# Recipe Modification Pipeline

This document details the Recipe Modification Pipeline system, which allows AI-powered modifications to existing recipes based on user requests.

## System Overview

The Recipe Modification Pipeline enables users to request changes to recipes through a conversational interface. The system processes these requests, generates appropriate modifications using AI, and applies them to the recipe while maintaining data integrity.

## Architecture

The modification pipeline consists of several interconnected components:

```
┌─────────────────┐     ┌───────────────────┐     ┌────────────────────┐
│  User Interface │────▶│ Edge Function API │────▶│ OpenAI Integration │
└─────────────────┘     └───────────────────┘     └────────────────────┘
        │                        │                         │
        ▼                        ▼                         ▼
┌─────────────────┐     ┌───────────────────┐     ┌────────────────────┐
│  Chat History   │◀───▶│  Recipe Database  │◀───▶│ Validation System  │
└─────────────────┘     └───────────────────┘     └────────────────────┘
```

## Key Components

### 1. Supabase Edge Function: `/modify-quick-recipe`

Located at `supabase/functions/modify-quick-recipe/index.ts`, this edge function:
- Receives modification requests
- Validates input data
- Interfaces with OpenAI
- Returns structured recipe modifications
- Logs conversation history

### 2. Zod Schema

Located at `supabase/functions/modify-quick-recipe/schema.ts`, the schema:
- Defines the structure for AI response validation
- Ensures consistency in modification data
- Handles nutrition impact assessments

### 3. Frontend Integration

The modification system is integrated with the frontend through:
- React hooks for processing recipe updates
- State management for tracking changes
- UI components for displaying modification options

## Data Flow

1. **Request Initiation**:
   - User submits a modification request through the UI
   - Request is packaged with the current recipe state

2. **Edge Function Processing**:
   - Validates input recipe structure
   - Builds AI prompt with recipe context and modification history
   - Calls OpenAI with retry and circuit breaker patterns

3. **AI Processing**:
   - AI model analyzes the request and recipe
   - Generates structured modifications
   - Returns reasoning and text response

4. **Validation and Response**:
   - Response is validated against the Zod schema
   - Structured modifications are extracted
   - Chat record is saved to database

5. **Recipe Update**:
   - Frontend processes the modifications
   - Updates recipe with changes
   - Performs additional validation
   - Saves updated recipe to database

## Error Handling

The system implements robust error handling:

1. **Circuit Breaker Pattern**:
   - Prevents cascading failures by "opening" after consecutive errors
   - Automatically resets after a cooldown period

2. **Request Retries**:
   - Implements exponential backoff for transient failures
   - Limits maximum retry attempts

3. **Input Validation**:
   - Pre-validates request data structure
   - Returns clear error messages for malformed requests

4. **Response Validation**:
   - Uses Zod schema to validate AI responses
   - Rejects malformed responses with detailed errors

## Integration with Recipe Update System

The modification pipeline connects to the recipe update system via:

1. **Hook: `useRecipeDetail`**:
   - Fetches recipe details
   - Provides methods for updating recipes

2. **Processing Utility: `update-recipe.ts`**:
   - Validates incoming changes
   - Processes modifications according to their type
   - Ensures data integrity before database updates

3. **DB Integration: `save-recipe-update.ts`**:
   - Handles database operations for saving modified recipes
   - Performs final validation and formatting

## Future Enhancements

Planned improvements to the modification pipeline:

1. **Improved Modification History**:
   - Enhanced context tracking for better AI responses
   - Visualization of recipe evolution over time

2. **User Feedback Loop**:
   - Collect user feedback on modification quality
   - Use feedback to improve AI prompts

3. **Advanced Conflict Resolution**:
   - Detect and resolve conflicts between modifications
   - Provide options when changes would significantly alter recipe character
