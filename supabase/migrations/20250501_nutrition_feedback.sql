
-- Create a table for nutrition feedback
CREATE TABLE IF NOT EXISTS public.nutrition_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES public.recipes(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('accurate', 'inaccurate')),
  comment TEXT,
  ingredient_feedback JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved BOOLEAN DEFAULT FALSE,
  resolution_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Add RLS policies
ALTER TABLE public.nutrition_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for the nutrition_feedback table
CREATE POLICY "Users can create their own feedback"
  ON public.nutrition_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback"
  ON public.nutrition_feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create view to aggregate feedback statistics
CREATE OR REPLACE VIEW public.nutrition_feedback_stats AS
SELECT
  recipe_id,
  COUNT(*) AS total_feedback,
  SUM(CASE WHEN feedback_type = 'accurate' THEN 1 ELSE 0 END) AS accurate_count,
  SUM(CASE WHEN feedback_type = 'inaccurate' THEN 1 ELSE 0 END) AS inaccurate_count,
  CASE 
    WHEN COUNT(*) > 0 
    THEN SUM(CASE WHEN feedback_type = 'accurate' THEN 1 ELSE 0 END)::float / COUNT(*)
    ELSE 0
  END AS accuracy_rate
FROM
  public.nutrition_feedback
GROUP BY
  recipe_id;

-- Grant permissions
GRANT SELECT ON public.nutrition_feedback_stats TO authenticated;

-- Return success message
SELECT 'Nutrition feedback system successfully configured' AS message;
