export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      favorites: {
        Row: {
          created_at: string
          id: string
          recipe_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          recipe_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          recipe_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      import_examples: {
        Row: {
          created_at: string | null
          description: string
          id: number
          sample_data: string
          table_name: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: number
          sample_data: string
          table_name: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: number
          sample_data?: string
          table_name?: string
        }
        Relationships: []
      }
      ingredient_embeddings: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          embedding: string | null
          id: string
          ingredient_text: string
          normalized_text: string
          updated_at: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          ingredient_text: string
          normalized_text: string
          updated_at?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          ingredient_text?: string
          normalized_text?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ingredient_mappings: {
        Row: {
          alternative_matches: Json | null
          confidence_score: number
          created_at: string | null
          feedback_count: number | null
          id: number
          ingredient_text: string
          match_method: string
          normalized_text: string
          updated_at: string | null
          usda_food_code: string
        }
        Insert: {
          alternative_matches?: Json | null
          confidence_score: number
          created_at?: string | null
          feedback_count?: number | null
          id?: number
          ingredient_text: string
          match_method: string
          normalized_text: string
          updated_at?: string | null
          usda_food_code: string
        }
        Update: {
          alternative_matches?: Json | null
          confidence_score?: number
          created_at?: string | null
          feedback_count?: number | null
          id?: number
          ingredient_text?: string
          match_method?: string
          normalized_text?: string
          updated_at?: string | null
          usda_food_code?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          nutrition_preferences: Json | null
          username: string | null
          weight_goal_deficit: number | null
          weight_goal_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          nutrition_preferences?: Json | null
          username?: string | null
          weight_goal_deficit?: number | null
          weight_goal_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          nutrition_preferences?: Json | null
          username?: string | null
          weight_goal_deficit?: number | null
          weight_goal_type?: string | null
        }
        Relationships: []
      }
      recipe_chats: {
        Row: {
          ai_response: string
          applied: boolean | null
          changes_suggested: Json | null
          created_at: string
          deleted_at: string | null
          id: string
          recipe_id: string
          source_image: string | null
          source_type: string | null
          source_url: string | null
          user_message: string
        }
        Insert: {
          ai_response: string
          applied?: boolean | null
          changes_suggested?: Json | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          recipe_id: string
          source_image?: string | null
          source_type?: string | null
          source_url?: string | null
          user_message: string
        }
        Update: {
          ai_response?: string
          applied?: boolean | null
          changes_suggested?: Json | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          recipe_id?: string
          source_image?: string | null
          source_type?: string | null
          source_url?: string | null
          user_message?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_chats_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          chef_notes: string | null
          cook_time_min: number | null
          cooking_tip: string | null
          created_at: string
          cuisine: string | null
          cuisine_category:
            | Database["public"]["Enums"]["cuisine_category"]
            | null
          deleted_at: string | null
          dietary: string | null
          flavor_tags: string[] | null
          id: string
          image_url: string | null
          ingredients: Json
          instructions: string[]
          nutrition: Json | null
          prep_time_min: number | null
          previous_version_id: string | null
          reasoning: string | null
          science_notes: Json | null
          servings: number
          tagline: string | null
          title: string
          updated_at: string
          user_id: string
          version_number: number
        }
        Insert: {
          chef_notes?: string | null
          cook_time_min?: number | null
          cooking_tip?: string | null
          created_at?: string
          cuisine?: string | null
          cuisine_category?:
            | Database["public"]["Enums"]["cuisine_category"]
            | null
          deleted_at?: string | null
          dietary?: string | null
          flavor_tags?: string[] | null
          id?: string
          image_url?: string | null
          ingredients: Json
          instructions: string[]
          nutrition?: Json | null
          prep_time_min?: number | null
          previous_version_id?: string | null
          reasoning?: string | null
          science_notes?: Json | null
          servings: number
          tagline?: string | null
          title: string
          updated_at?: string
          user_id: string
          version_number?: number
        }
        Update: {
          chef_notes?: string | null
          cook_time_min?: number | null
          cooking_tip?: string | null
          created_at?: string
          cuisine?: string | null
          cuisine_category?:
            | Database["public"]["Enums"]["cuisine_category"]
            | null
          deleted_at?: string | null
          dietary?: string | null
          flavor_tags?: string[] | null
          id?: string
          image_url?: string | null
          ingredients?: Json
          instructions?: string[]
          nutrition?: Json | null
          prep_time_min?: number | null
          previous_version_id?: string | null
          reasoning?: string | null
          science_notes?: Json | null
          servings?: number
          tagline?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "recipes_previous_version_id_fkey"
            columns: ["previous_version_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_lists: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          items: Json
          preparation_notes: string[] | null
          tips: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          items?: Json
          preparation_notes?: string[] | null
          tips?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          items?: Json
          preparation_notes?: string[] | null
          tips?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      usda_foods: {
        Row: {
          calcium_mg: number | null
          calories: number | null
          carbs_g: number | null
          cholesterol_mg: number | null
          copper_mg: number | null
          created_at: string | null
          embedding: string | null
          fat_g: number | null
          fiber_g: number | null
          food_code: string
          food_name: string
          gmwt_1: number | null
          gmwt_2: number | null
          gmwt_desc1: string | null
          gmwt_desc2: string | null
          id: number
          iron_mg: number | null
          magnesium_mg: number | null
          manganese_mg: number | null
          niacin_mg: number | null
          potassium_mg: number | null
          protein_g: number | null
          riboflavin_mg: number | null
          sodium_mg: number | null
          sugar_g: number | null
          thiamin_mg: number | null
          updated_at: string | null
          vitamin_a_iu: number | null
          vitamin_c_mg: number | null
          vitamin_d_iu: number | null
          vitaminb12_mg: number | null
          vitaminb6_mg: number | null
          zinc_mg: number | null
        }
        Insert: {
          calcium_mg?: number | null
          calories?: number | null
          carbs_g?: number | null
          cholesterol_mg?: number | null
          copper_mg?: number | null
          created_at?: string | null
          embedding?: string | null
          fat_g?: number | null
          fiber_g?: number | null
          food_code: string
          food_name: string
          gmwt_1?: number | null
          gmwt_2?: number | null
          gmwt_desc1?: string | null
          gmwt_desc2?: string | null
          id?: number
          iron_mg?: number | null
          magnesium_mg?: number | null
          manganese_mg?: number | null
          niacin_mg?: number | null
          potassium_mg?: number | null
          protein_g?: number | null
          riboflavin_mg?: number | null
          sodium_mg?: number | null
          sugar_g?: number | null
          thiamin_mg?: number | null
          updated_at?: string | null
          vitamin_a_iu?: number | null
          vitamin_c_mg?: number | null
          vitamin_d_iu?: number | null
          vitaminb12_mg?: number | null
          vitaminb6_mg?: number | null
          zinc_mg?: number | null
        }
        Update: {
          calcium_mg?: number | null
          calories?: number | null
          carbs_g?: number | null
          cholesterol_mg?: number | null
          copper_mg?: number | null
          created_at?: string | null
          embedding?: string | null
          fat_g?: number | null
          fiber_g?: number | null
          food_code?: string
          food_name?: string
          gmwt_1?: number | null
          gmwt_2?: number | null
          gmwt_desc1?: string | null
          gmwt_desc2?: string | null
          id?: number
          iron_mg?: number | null
          magnesium_mg?: number | null
          manganese_mg?: number | null
          niacin_mg?: number | null
          potassium_mg?: number | null
          protein_g?: number | null
          riboflavin_mg?: number | null
          sodium_mg?: number | null
          sugar_g?: number | null
          thiamin_mg?: number | null
          updated_at?: string | null
          vitamin_a_iu?: number | null
          vitamin_c_mg?: number | null
          vitamin_d_iu?: number | null
          vitaminb12_mg?: number | null
          vitaminb6_mg?: number | null
          zinc_mg?: number | null
        }
        Relationships: []
      }
      usda_unit_conversions: {
        Row: {
          conversion_factor: number
          created_at: string | null
          food_category: string
          from_unit: string
          id: number
          notes: string | null
          to_unit: string
          updated_at: string | null
        }
        Insert: {
          conversion_factor: number
          created_at?: string | null
          food_category: string
          from_unit: string
          id?: number
          notes?: string | null
          to_unit: string
          updated_at?: string | null
        }
        Update: {
          conversion_factor?: number
          created_at?: string | null
          food_category?: string
          from_unit?: string
          id?: number
          notes?: string | null
          to_unit?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      usda_yield_factors: {
        Row: {
          cooking_method: string
          created_at: string | null
          description: string | null
          food_category: string
          id: number
          source: string | null
          updated_at: string | null
          yield_factor: number
        }
        Insert: {
          cooking_method: string
          created_at?: string | null
          description?: string | null
          food_category: string
          id?: number
          source?: string | null
          updated_at?: string | null
          yield_factor: number
        }
        Update: {
          cooking_method?: string
          created_at?: string | null
          description?: string | null
          food_category?: string
          id?: number
          source?: string | null
          updated_at?: string | null
          yield_factor?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      match_ingredient_embeddings: {
        Args: {
          query_embedding: string
          similarity_threshold?: number
          match_count?: number
        }
        Returns: {
          ingredient_text: string
          normalized_text: string
          food_code: string
          food_name: string
          similarity: number
        }[]
      }
      search_foods: {
        Args: { query_text: string; similarity_threshold?: number }
        Returns: {
          id: number
          food_code: string
          food_name: string
          food_category: string
          calories: number
          protein_g: number
          carbs_g: number
          fat_g: number
          fiber_g: number
          similarity: number
        }[]
      }
      search_usda_foods: {
        Args: { query_text: string; similarity_threshold?: number }
        Returns: {
          fdc_id: number
          description: string
          similarity: number
        }[]
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      cuisine_category:
        | "Global"
        | "Regional American"
        | "European"
        | "Asian"
        | "Dietary Styles"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      cuisine_category: [
        "Global",
        "Regional American",
        "European",
        "Asian",
        "Dietary Styles",
      ],
    },
  },
} as const
