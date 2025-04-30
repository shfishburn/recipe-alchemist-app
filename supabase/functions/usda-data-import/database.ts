
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

// Define table types
export enum TableType {
  USDA_FOODS = 'usda_foods',
  UNIT_CONVERSIONS = 'usda_unit_conversions',
  YIELD_FACTORS = 'usda_yield_factors'
}

// Define interfaces for batch operations
export interface BatchInsertOptions {
  supabase: SupabaseClient;
  data: Record<string, any>[];
  table: TableType;
  batchSize: number;
  mode: 'insert' | 'upsert';
}

export interface BatchResult {
  totalRecords: number;
  successCount: number;
  errorCount: number;
  errors: { index: number; error: string }[];
  batchResults: { batch: number; count: number }[];
}

// Function to perform batch insert/upsert operations
export async function insertBatch({ 
  supabase, 
  data, 
  table, 
  batchSize,
  mode 
}: BatchInsertOptions): Promise<BatchResult> {
  const result: BatchResult = {
    totalRecords: data.length,
    successCount: 0,
    errorCount: 0,
    errors: [],
    batchResults: []
  };

  // Get conflict target columns based on table type for upsert mode
  const getConflictTarget = (tableType: TableType): string[] => {
    switch (tableType) {
      case TableType.USDA_FOODS:
        return ['food_code'];
      case TableType.UNIT_CONVERSIONS:
        return ['food_category', 'from_unit', 'to_unit'];
      case TableType.YIELD_FACTORS:
        return ['food_category', 'cooking_method'];
      default:
        return [];
    }
  };

  // Process data in batches
  for (let i = 0; i < data.length; i += batchSize) {
    const batchNumber = Math.floor(i / batchSize) + 1;
    console.log(`Processing batch ${batchNumber} (items ${i + 1} to ${Math.min(i + batchSize, data.length)})`);
    
    const batchData = data.slice(i, i + batchSize);
    let query = supabase.from(table).insert(batchData);
    
    // If mode is upsert, configure conflict resolution
    if (mode === 'upsert') {
      const conflictTarget = getConflictTarget(table);
      if (conflictTarget.length > 0) {
        query = supabase
          .from(table)
          .upsert(batchData, { 
            onConflict: conflictTarget.join(','),
            ignoreDuplicates: false
          });
      } else {
        console.warn(`No conflict target configured for ${table}, falling back to plain insert`);
      }
    }
    
    const { data: insertedData, error } = await query;
    
    if (error) {
      console.error(`Error in batch ${batchNumber}:`, error);
      result.errorCount += batchData.length;
      result.errors.push({ 
        index: i, 
        error: `Batch ${batchNumber} failed: ${error.message}` 
      });
    } else {
      const count = insertedData?.length || batchData.length;
      result.successCount += count;
      result.batchResults.push({ batch: batchNumber, count });
      console.log(`Batch ${batchNumber} complete: ${count} records processed`);
    }
  }
  
  return result;
}
