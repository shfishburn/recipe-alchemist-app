
import { useState, useEffect } from 'react';

// Define the BatteryManager interface
interface BatteryManagerInterface {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  addEventListener: (type: string, listener: EventListener) => void;
  removeEventListener: (type: string, listener: EventListener) => void;
}

// Augment the navigator interface
interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManagerInterface>;
}

interface BatteryStatus {
  charging: boolean;
  level: number;
  lowPowerMode: boolean;
  supported: boolean;
}

export function useBatteryStatus(): BatteryStatus {
  const [status, setStatus] = useState<BatteryStatus>({
    charging: true,
    level: 1,
    lowPowerMode: false,
    supported: false
  });

  useEffect(() => {
    // Check if Battery API is supported
    if ('getBattery' in navigator) {
      const getBatteryStatus = async () => {
        try {
          // Access battery API
          const battery = await (navigator as NavigatorWithBattery).getBattery?.();
          
          if (!battery) {
            console.log('Battery API not supported or permission denied');
            return;
          }
          
          // Initial state
          updateBatteryStatus(battery);
          
          // Listen for changes
          battery.addEventListener('chargingchange', () => updateBatteryStatus(battery));
          battery.addEventListener('levelchange', () => updateBatteryStatus(battery));
          
          // Detect low power mode based on various signals
          // 1. Battery level is low (below 20%)
          // 2. Device is not charging
          // 3. Check for reduced motion preference as potential signal
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          
          setStatus(current => ({
            ...current,
            supported: true,
            lowPowerMode: prefersReducedMotion || (battery.level < 0.2 && !battery.charging)
          }));
        } catch (error) {
          console.log('Battery API not supported or permission denied');
        }
      };
      
      getBatteryStatus();
    } else {
      // Fallback when Battery API is not supported
      // Check for reduced motion as a proxy for battery saving mode
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setStatus(current => ({
        ...current,
        lowPowerMode: prefersReducedMotion
      }));
    }
    
    // Listen for visibility changes to optimize background processing
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Page is hidden, potentially reduce animations or processing
        setStatus(current => ({
          ...current,
          lowPowerMode: true
        }));
      } else {
        // Re-evaluate when page becomes visible again
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setStatus(current => ({
          ...current,
          lowPowerMode: current.lowPowerMode && prefersReducedMotion
        }));
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Helper to update battery status
  const updateBatteryStatus = (battery: BatteryManagerInterface) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setStatus({
      charging: battery.charging,
      level: battery.level,
      lowPowerMode: prefersReducedMotion || (battery.level < 0.2 && !battery.charging),
      supported: true
    });
  };

  return status;
}
