# Integrating AI Chat Modifications with Recipe Generation

## Problem Statement

The Recipe Alchemy application has a critical design flaw in its recipe modification system. Currently, the recipe chat modification component requests only partial modifications to ingredients and instructions rather than complete recipe objects. Additionally, there's no versioning system to track changes. These issues create inconsistent data models, complex merging logic, and prevent users from tracking their modification history.

## Current Issues

1. The modification system uses a different JSON schema than the recipe generation system
2. Only partial updates are requested, requiring error-prone merging logic
3. No versioning system exists to track recipe changes over time
4. The modification flow is disconnected from the recipe generation pipeline

## Implementation Requirements

Your task is to modify the existing codebase to:

1. Update the recipe modification system to use the same JSON schema as recipe generation
2. Modify the LLM prompt to request complete recipe objects rather than partial modifications
3. Implement a versioning system to track recipe changes
4. Keep the existing UI/UX patterns while adding version selection capability

## Constraints

- Work within the existing application architecture
- Maintain backward compatibility during transition
- Minimize database schema changes
- Ensure the solution works with the existing authentication system
- Preserve the chat-based interaction model

The solution should leverage the existing Recipe Alchemy codebase and components while addressing these fundamental design issues. Complete recipe objects should flow through the system with proper versioning to improve reliability and user experience.

## 1. Problem Assessment

Based on the documentation, the key issues are:

1. The recipe modification system uses a different JSON schema than recipe generation
2. It only requests partial modifications rather than complete recipe objects
3. There's no versioning to track changes over time
4. The systems are disconnected rather than integrated

## 2. Implementation Plan

### Phase 1: Update Modification Schema (1 week)

**Goal**: Align the modification system with the recipe generation schema

#### 1. Update the Zod Schema in `modify-quick-recipe/schema.ts`:

```typescript
// FROM
export const recipeModificationsSchema = z.object({
  textResponse: z.string(),
  reasoning: z.string(),
  modifications: z.object({
    title: z.string().optional(),
    ingredients: z.array(z.object({
      original: z.string().optional(),
      modified: z.string(),
      reason: z.string().optional()
    })).optional(),
    // other modification fields...
  }),
  // other fields...
});

// TO
export const recipeModificationsSchema = z.object({
  textResponse: z.string(),
  reasoning: z.string(),
  // Add the complete recipe properties here that match recipe generation
  recipe: z.object({
    title: z.string(),
    description: z.string().optional(),
    ingredients: z.array(z.object({
      qty_imperial: z.number(),
      unit_imperial: z.string(),
      qty_metric: z.number(),
      unit_metric: z.string(),
      shop_size_qty: z.number().optional(),
      shop_size_unit: z.string().optional(),
      item: z.string(),
      notes: z.string().optional()
    })),
    steps: z.array(z.string()),
    // Other fields matching generation schema...
    version_info: z.object({
      version_number: z.number(),
      parent_version_id: z.string().optional(),
      modification_reason: z.string()
    }).optional()
  }),
  // Keep existing fields for backward compatibility during transition
  modifications: z.object({
    // Original modification schema
  }).optional()
});
```

#### 2. Update the system prompt in `modify-quick-recipe/index.ts`:

```typescript
const prompt = ChatPromptTemplate.fromMessages([
  ["system", `
You are a culinary nutrition expert. When modifying recipes:
1) Keep flavors balanced and logical.
2) Honor cooking chemistry in substitutions.
3) Correctly recalc nutrition.
4) Return a complete recipe JSON that includes ALL fields from the original recipe with your modifications applied.
5) Follow the exact schema structure of the original recipe.
6) Don't return just the changes - return the entire recipe with changes applied.
7) Include a modification_reason field explaining the changes.
`],
  new MessagesPlaceholder("history"),
  ["human", "{input}"],
]);
```

### Phase 2: Database Updates (1 week)

**Goal**: Add versioning support without disrupting existing functionality

#### 1. Create recipe_versions table:

```sql
-- Add without breaking existing functionality
CREATE TABLE recipe_versions (
  version_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  parent_version_id UUID REFERENCES recipe_versions(version_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id),
  modification_request TEXT,
  recipe_data JSONB NOT NULL -- Store the complete recipe JSON
);

-- Index for efficient queries
CREATE INDEX idx_recipe_versions_recipe_id ON recipe_versions(recipe_id);
```

#### 2. Add helper function to `index-modify-quick-recipe.ts`:

```typescript
// Add this function to store recipe versions
async function storeRecipeVersion(recipeId, parentVersionId, versionNumber, userId, modificationRequest, recipeData) {
  const SUPA_URL = Deno.env.get("SUPABASE_URL");
  const SUPA_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!SUPA_URL || !SUPA_KEY) {
    console.error("Missing Supabase env vars");
    return null;
  }
  
  try {
    const sb = createClient(SUPA_URL, SUPA_KEY, {
      global: { headers: { Authorization: `Bearer ${SUPA_KEY}` } }
    });
    
    const { data, error } = await sb.from("recipe_versions").insert({
      recipe_id: recipeId,
      parent_version_id: parentVersionId,
      version_number: versionNumber,
      user_id: userId,
      modification_request: modificationRequest,
      recipe_data: recipeData
    }).select();
    
    if (error) {
      console.error("Version storage error:", error);
      return null;
    }
    
    return data[0];
  } catch (dbErr) {
    console.error("DB insert failed", dbErr);
    return null;
  }
}

// Add function to get latest version number
async function getLatestVersionNumber(recipeId) {
  const SUPA_URL = Deno.env.get("SUPABASE_URL");
  const SUPA_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!SUPA_URL || !SUPA_KEY) {
    console.error("Missing Supabase env vars");
    return 0;
  }
  
  try {
    const sb = createClient(SUPA_URL, SUPA_KEY, {
      global: { headers: { Authorization: `Bearer ${SUPA_KEY}` } }
    });
    
    const { data, error } = await sb.from("recipe_versions")
      .select("version_number")
      .eq("recipe_id", recipeId)
      .order("version_number", { ascending: false })
      .limit(1);
    
    if (error) {
      console.error("Version query error:", error);
      return 0;
    }
    
    return data.length > 0 ? data[0].version_number : 0;
  } catch (dbErr) {
    console.error("DB query failed", dbErr);
    return 0;
  }
}
```

### Phase 3: Update Edge Function (1 week)

**Goal**: Modify the edge function to store complete recipe versions

#### 1. Update the edge function handler in `index-modify-quick-recipe.ts`:

```typescript
serve(async (req) => {
  // CORS headers for all responses
  const headers = getCorsHeadersWithOrigin(req);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  try {
    const { recipe, userRequest, modificationHistory = [], user_id } = await req.json();

    // validate input
    try {
      validateRecipe(recipe);
    } catch (vall) {
      return new Response(JSON.stringify({ error: vall.message }), { status: 400, headers });
    }

    // build LangChain call
    const chain = createLangChainSequence();
    const input = `
      Original Recipe: ${JSON.stringify(recipe)}
      Modification Request: ${userRequest}
      
      Return a complete JSON object containing the entire recipe with your modifications applied.
    `;
    const history = [
      ...modificationHistory.map(e => ({ role: "human", content: e.request })),
      ...modificationHistory.map(e => ({ role: "ai", content: JSON.stringify(e.response) }))
    ];

    // call LLM with circuit breaker + retry
    let result: any;
    try {
      result = await openAICircuit.execute(() =>
        withRetry(() => chain.invoke({ input, history }), 3, 500)
      );
    } catch (llmErr) {
      const msg = llmErr.message.includes("Circuit is open")
        ? { error: "Service unavailable, too many failures" }
        : llmErr.message.includes("timeout")
          ? { error: "AI request timed out" }
          : { error: "AI generation failed" };
      return new Response(JSON.stringify(msg), { status: 503, headers });
    }

    // Zod-validate AI output
    let parsed: any;
    try {
      parsed = recipeModificationsSchema.parse(result);
    } catch (parseErr) {
      return new Response(
        JSON.stringify({
          error: "Invalid AI response format",
          details: (parseErr as Error).message
        }),
        { status: 422, headers }
      );
    }

    // Get latest version number
    const latestVersionNumber = await getLatestVersionNumber(recipe.id);
    const newVersionNumber = latestVersionNumber + 1;
    
    // Add version info to recipe
    const modifiedRecipe = parsed.recipe;
    if (!modifiedRecipe.version_info) {
      modifiedRecipe.version_info = {
        version_number: newVersionNumber,
        parent_version_id: recipe.version_id || null,
        modification_reason: userRequest
      };
    }
    
    // Store the version
    const versionData = await storeRecipeVersion(
      recipe.id,
      recipe.version_id || null,
      newVersionNumber,
      user_id || null,
      userRequest,
      modifiedRecipe
    );
    
    if (versionData) {
      modifiedRecipe.version_id = versionData.version_id;
    }

    // write chat record
    const SUPA_URL = Deno.env.get("SUPABASE_URL");
    const SUPA_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPA_URL || !SUPA_KEY) {
      console.error("Missing Supabase env vars");
    } else {
      try {
        const sb = createClient(SUPA_URL, SUPA_KEY, {
          global: { headers: { Authorization: `Bearer ${SUPA_KEY}` } }
        });
        await sb.from("recipe_chats").insert({
          recipe_id: recipe.id,
          user_message: userRequest,
          ai_response: parsed.textResponse,
          changes_suggested: true,
          version_id: modifiedRecipe.version_id, // Link to version
          source_type: "modification"
        });
      } catch (dbErr) {
        console.error("DB insert failed", dbErr);
      }
    }

    // Add version ID to response
    const response = {
      ...parsed,
      recipe: modifiedRecipe
    };

    // return success
    return new Response(JSON.stringify(response), { status: 200, headers });
  } catch (err) {
    console.error("Unexpected error", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers
    });
  }
});
```

### Phase 4: Update Frontend Components (2 weeks)

**Goal**: Modify the frontend to handle versioned recipes

#### 1. Update `use-recipe-modifications.ts`:

```typescript
import { useState, useCallback, useRef, useEffect } from 'react';
import { QuickRecipe } from '@/types/quick-recipe';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { ModificationStatus } from './types';
import { requestRecipeModifications } from './api-client';
import { saveModificationRequest } from './storage-utils';

export function useRecipeModifications(recipe: QuickRecipe) {
  const { session } = useAuth();
  const [status, setStatus] = useState<ModificationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [modificationRequest, setModificationRequest] = useState<string>('');
  const [modifiedRecipe, setModifiedRecipe] = useState<QuickRecipe>(recipe);
  const [versionHistory, setVersionHistory] = useState<any[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);

  // Fetch version history when recipe changes
  useEffect(() => {
    if (recipe.id) {
      fetchVersionHistory(recipe.id);
    }
    setModifiedRecipe(recipe);
  }, [recipe.id]);

  // Fetch recipe version history
  const fetchVersionHistory = async (recipeId: string) => {
    if (!session) return;
    
    try {
      // Implement API call to fetch version history
      const response = await fetch(`/api/recipe-versions/${recipeId}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      if (response.ok) {
        const versions = await response.json();
        setVersionHistory(versions);
        
        // Set selected version to the latest one
        if (versions.length > 0) {
          const latestVersion = versions.reduce((prev, current) => 
            (current.version_number > prev.version_number) ? current : prev
          );
          setSelectedVersionId(latestVersion.version_id);
          
          // If the recipe doesn't have a version_id, use the latest version
          if (!recipe.version_id) {
            setModifiedRecipe({
              ...recipe,
              ...latestVersion.recipe_data,
              version_id: latestVersion.version_id
            });
          }
        }
      } else {
        console.error("Failed to fetch version history");
      }
    } catch (err) {
      console.error("Error fetching version history:", err);
    }
  };

  // Select a specific version
  const selectVersion = useCallback((versionId: string) => {
    const version = versionHistory.find(v => v.version_id === versionId);
    if (version) {
      setSelectedVersionId(versionId);
      setModifiedRecipe({
        ...recipe,
        ...version.recipe_data,
        version_id: version.version_id
      });
    }
  }, [versionHistory, recipe]);

  // Request modifications (updated to handle complete recipe)
  const requestModifications = useCallback(async (request: string, immediate = false) => {
    // Existing implementation with modifications to handle versions...
    
    // When successful:
    if (result.recipe) {
      // Set the modified recipe with the full recipe object
      setModifiedRecipe(result.recipe);
      // Refresh version history
      fetchVersionHistory(recipe.id);
    }
    
  }, [modifiedRecipe, session, recipe.id]);

  // Return additional methods for version management
  return {
    status,
    error,
    modifiedRecipe,
    modificationRequest,
    isModified: JSON.stringify(recipe) !== JSON.stringify(modifiedRecipe),
    requestModifications,
    // Add version-related functionality
    versionHistory,
    selectedVersionId,
    selectVersion,
    refreshVersionHistory: () => fetchVersionHistory(recipe.id)
  };
}
```

#### 2. Update `QuickRecipeModifier.tsx`:

```tsx
import React, { useState, useCallback } from 'react';
import { useRecipeModifications } from '@/hooks/recipe-modifications';
import { QuickRecipe } from '@/types/quick-recipe';
import { toast } from "sonner";
import { useAuth } from '@/hooks/use-auth';
import { useAuthDrawer } from '@/hooks/use-auth-drawer';
import { ModificationRequest } from './modifier/ModificationRequest';
import { ModificationHistory } from './modifier/ModificationHistory';
import { ModifiedRecipeDisplay } from './modifier/ModifiedRecipeDisplay';
import { VersionSelector } from './modifier/VersionSelector'; // New component
import { StatusDisplay } from './modifier/StatusDisplay';
import { AuthOverlay } from './modifier/AuthOverlay';
import { ErrorDisplay } from '@/components/ui/error-display';

interface QuickRecipeModifierProps {
  recipe: QuickRecipe;
  onModifiedRecipe?: (modifiedRecipe: QuickRecipe) => void;
}

export const QuickRecipeModifier: React.FC<QuickRecipeModifierProps> = ({ recipe, onModifiedRecipe }) => {
  // Existing state and hooks...
  
  // Add version selector component
  const {
    status,
    error,
    modifiedRecipe,
    modificationRequest,
    versionHistory, // New
    selectedVersionId, // New
    selectVersion, // New
    isModified,
    requestModifications,
    refreshVersionHistory // New
  } = useRecipeModifications(recipe);
  
  // Rest of component implementation...
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Request Input and Controls */}
      <div className="space-y-4">
        <ModificationRequest 
          request={request}
          setRequest={setRequest}
          immediate={immediate}
          setImmediate={setImmediate}
          status={status}
          onRequestModifications={handleRequestModifications}
          onCancelRequest={cancelRequest}
        />

        {/* Status and Error Display */}
        <StatusDisplay status={status} error={error} />

        {/* Version Selector - New Component */}
        <VersionSelector
          versions={versionHistory}
          selectedVersionId={selectedVersionId}
          onSelectVersion={selectVersion}
        />
      </div>

      {/* Recipe Display and Modification Controls */}
      <div className="space-y-4">
        <ModifiedRecipeDisplay
          modifiedRecipe={modifiedRecipe}
          status={status}
          onApplyModifications={() => {
            if (onModifiedRecipe) {
              onModifiedRecipe(modifiedRecipe);
              toast("Modifications Applied", {
                description: "Your recipe modifications have been applied successfully."
              });
            }
          }}
        />
      </div>
    </div>
  );
};
```

#### 3. Create new `VersionSelector` component:

```tsx
// components/quick-recipe/modifier/VersionSelector.tsx
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDistanceToNow } from 'date-fns';

interface VersionSelectorProps {
  versions: any[];
  selectedVersionId: string | null;
  onSelectVersion: (versionId: string) => void;
}

export const VersionSelector: React.FC<VersionSelectorProps> = ({
  versions,
  selectedVersionId,
  onSelectVersion
}) => {
  if (!versions || versions.length === 0) {
    return null;
  }

  // Sort versions by version number (descending)
  const sortedVersions = [...versions].sort((a, b) => b.version_number - a.version_number);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Recipe Versions</h3>
        <span className="text-xs text-muted-foreground">
          {versions.length} version{versions.length !== 1 ? 's' : ''}
        </span>
      </div>

      <Select 
        value={selectedVersionId || undefined}
        onValueChange={onSelectVersion}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select version" />
        </SelectTrigger>
        <SelectContent>
          {sortedVersions.map((version) => (
            <SelectItem key={version.version_id} value={version.version_id}>
              <div className="flex flex-col">
                <span>Version {version.version_number}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedVersionId && (
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Modification:</span>{' '}
          {versions.find(v => v.version_id === selectedVersionId)?.modification_request || 'Original recipe'}
        </div>
      )}
    </div>
  );
};
```

### Phase 5: API Endpoints (1 week)

**Goal**: Create API endpoints to manage recipe versions

#### 1. Create recipe versions API endpoint:

```typescript
// supabase/functions/recipe-versions/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { getCorsHeadersWithOrigin } from "../_shared/cors.ts";

serve(async (req) => {
  const headers = getCorsHeadersWithOrigin(req);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }
  
  const url = new URL(req.url);
  const recipeId = url.pathname.split("/").pop();
  
  if (!recipeId) {
    return new Response(
      JSON.stringify({ error: "Recipe ID is required" }),
      { status: 400, headers }
    );
  }
  
  const SUPA_URL = Deno.env.get("SUPABASE_URL");
  const SUPA_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!SUPA_URL || !SUPA_KEY) {
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500, headers }
    );
  }
  
  try {
    const supabase = createClient(SUPA_URL, SUPA_KEY);
    
    // Get all versions for the recipe
    const { data, error } = await supabase
      .from("recipe_versions")
      .select("*")
      .eq("recipe_id", recipeId)
      .order("version_number", { ascending: false });
    
    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers }
      );
    }
    
    return new Response(
      JSON.stringify(data),
      { status: 200, headers }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers }
    );
  }
});
```

### Phase 6: Integration & Testing (1 week)

**Goal**: Test the updated system and ensure proper integration

1. **Unit Tests**:
   - Test schema validation with sample recipes
   - Test version selection functionality
   - Test recipe modification with versions

2. **Integration Tests**:
   - Test complete modification flow with versions
   - Verify version history retrieval and display
   - Test version selection and navigation

3. **Documentation**:
   - Update API documentation with version endpoints
   - Update user documentation with version management instructions

## 3. Migration Approach

1. **Staged Rollout**:
   - Deploy database changes first
   - Update backend edge functions with fallbacks to old behavior
   - Update frontend components with feature flags for version UI
   - Enable versioning for a subset of users to verify behavior
   - Full rollout after validation

2. **Data Migration**:
   - No changes needed for existing recipes
   - First modification will create the first version record
   - Legacy unversioned recipes display as "Version 1"

This implementation plan addresses the core issues while working within the existing architecture. It maintains backward compatibility during transition and adds the versioning capability you need for tracking recipe modifications.