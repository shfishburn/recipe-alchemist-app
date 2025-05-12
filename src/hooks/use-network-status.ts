
import { useState, useEffect } from 'react';

// Define the NetworkInformation API interface since TypeScript doesn't include it by default
interface NetworkInformation {
  readonly type?: string;
  readonly effectiveType?: string;
  readonly downlink?: number;
  readonly downlinkMax?: number;
  readonly rtt?: number;
  readonly saveData?: boolean;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
}

// Extended Navigator interface to include connection property
interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
}

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
        const connection = (navigator as NavigatorWithConnection).connection;
        
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
        const connection = (navigator as NavigatorWithConnection).connection;
        connection?.addEventListener('change', updateNetworkInfo);
        
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
          const connection = (navigator as NavigatorWithConnection).connection;
          connection?.removeEventListener('change', updateNetworkInfo);
        } catch (error) {
          // Silent catch - API might not be fully supported
        }
      }
    };
  }, []);

  return status;
};
