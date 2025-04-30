
-- Create a function for fuzzy text matching of food names
CREATE OR REPLACE FUNCTION search_foods(query_text TEXT, similarity_threshold FLOAT DEFAULT 0.3)
RETURNS TABLE (
  id INT,
  food_code VARCHAR(8),
  food_name TEXT,
  food_category VARCHAR(100),
  calories NUMERIC,
  protein_g NUMERIC,
  carbs_g NUMERIC,
  fat_g NUMERIC,
  fiber_g NUMERIC,
  similarity FLOAT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id,
    f.food_code,
    f.food_name,
    f.food_category,
    f.calories,
    f.protein_g,
    f.carbs_g,
    f.fat_g,
    f.fiber_g,
    similarity(f.food_name, query_text) as similarity
  FROM 
    usda_foods f
  WHERE 
    f.food_name % query_text
    AND similarity(f.food_name, query_text) > similarity_threshold
  ORDER BY 
    similarity DESC;
END;
$$;

-- Grant permissions to use the function
GRANT EXECUTE ON FUNCTION search_foods TO service_role;
GRANT EXECUTE ON FUNCTION search_foods TO authenticated;
GRANT EXECUTE ON FUNCTION search_foods TO anon;
