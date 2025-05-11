
import { useState, useEffect } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  connectionType: string | null;
  effectiveType: string | null;
  downlink: number | null;
  downlinkMax: number | null;
  rtt: number | null;
  saveData: boolean | null;
}

/**
 * Hook to monitor network status and connection quality
 */
export const useNetworkStatus = () => {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: true,
    connectionType: null,
    effectiveType: null,
    downlink: null,
    downlinkMax: null,
    rtt: null,
    saveData: null,
  });

  useEffect(() => {
    // Initial state based on navigator.onLine
    setStatus(prevStatus => ({
      ...prevStatus,
      isOnline: navigator.onLine
    }));

    // Update network status when it changes
    const handleOnline = () => {
      setStatus(prevStatus => ({
        ...prevStatus,
        isOnline: true
      }));
    };

    const handleOffline = () => {
      setStatus(prevStatus => ({
        ...prevStatus,
        isOnline: false
      }));
    };

    // Network Information API if available
    const updateNetworkInfo = () => {
      if ('connection' in navigator) {
        // @ts-ignore - The Navigator.connection property is experimental
        const connection = navigator.connection;
        
        if (connection) {
          setStatus({
            isOnline: navigator.onLine,
            connectionType: connection.type || null,
            effectiveType: connection.effectiveType || null,
            downlink: connection.downlink || null,
            downlinkMax: connection.downlinkMax || null,
            rtt: connection.rtt || null,
            saveData: connection.saveData || null,
          });
        }
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Try to add connection change listener if available
    if ('connection' in navigator) {
      try {
        // @ts-ignore - The Navigator.connection property is experimental
        navigator.connection?.addEventListener('change', updateNetworkInfo);
        
        // Initial update
        updateNetworkInfo();
      } catch (error) {
        console.warn('Network Information API not fully supported:', error);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if ('connection' in navigator) {
        try {
          // @ts-ignore - The Navigator.connection property is experimental
          navigator.connection?.removeEventListener('change', updateNetworkInfo);
        } catch (error) {
          // Silent catch - API might not be fully supported
        }
      }
    };
  }, []);

  return status;
};
