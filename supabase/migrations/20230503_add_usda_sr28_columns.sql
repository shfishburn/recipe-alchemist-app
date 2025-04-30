
-- Add new columns to the usda_foods table to support SR28 format
ALTER TABLE public.usda_foods
ADD COLUMN IF NOT EXISTS cholesterol_mg numeric,
ADD COLUMN IF NOT EXISTS gmwt_1 numeric,
ADD COLUMN IF NOT EXISTS gmwt_desc1 text,
ADD COLUMN IF NOT EXISTS gmwt_2 numeric,
ADD COLUMN IF NOT EXISTS gmwt_desc2 text;

-- Add example data to the import_examples table for the new SR28 format
INSERT INTO public.import_examples (table_name, sample_data, description)
VALUES 
('usda_foods', 'food_code,food_name,calories,protein_(g),fat_g,carbs_g,fiber_g,sugar_g,sodium_mg,cholesterol_mg,GmWt_1,GmWt_Desc1,GmWt_2,GmWt_Desc2
01001,BUTTER:WITH SALT,717,0.85,81.11,0.06,0,0.06,643,215,5,"1 pat,  (1"" sq, 1/3"" high)",14.2,1 tbsp
01002,BUTTER:WHIPPED:W/ SALT,718,0.49,78.3,2.87,0,0.06,583,225,3.8,"1 pat,  (1"" sq, 1/3"" high)",9.4,1 tbsp', 
'SR28 format with extended fields including cholesterol and weight measures');
