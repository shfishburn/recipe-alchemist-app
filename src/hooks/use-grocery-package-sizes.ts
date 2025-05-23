
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GroceryPackageSize } from '@/services/ShoppingListService';

/**
 * Hook for fetching and managing grocery package sizes
 */
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

      // Transform the data to ensure package_sizes is a number[] array
      const transformedData: GroceryPackageSize[] = data?.map(item => ({
        ...item,
        package_sizes: Array.isArray(item.package_sizes) ? item.package_sizes : []
      })) || [];
      
      setPackageSizes(transformedData);
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
