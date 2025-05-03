
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GroceryPackageSize {
  id: string;
  ingredient: string;
  category: string;
  package_sizes: number[];
  package_unit: string;
  standard_qty?: number;
  standard_unit?: string;
  metric_equiv?: string;
  notes?: string;
}

export function useGroceryPackageSizes() {
  const [packageSizes, setPackageSizes] = useState<GroceryPackageSize[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPackageSizes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('grocery_package_sizes')
        .select('*')
        .order('category', { ascending: true });

      if (error) {
        throw error;
      }

      setPackageSizes(data || []);
    } catch (err) {
      console.error('Error fetching package sizes:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackageSizes();
  }, []);

  return {
    packageSizes,
    isLoading,
    error,
    refetch: fetchPackageSizes
  };
}
