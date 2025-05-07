
import { useState, useEffect } from 'react';

interface BatteryStatus {
  lowPowerMode: boolean;
  batteryLevel: number | null;
  charging: boolean | null;
}

export function useBatteryStatus(): BatteryStatus {
  const [status, setStatus] = useState<BatteryStatus>({
    lowPowerMode: false,
    batteryLevel: null,
    charging: null
  });

  useEffect(() => {
    // Use device memory as a proxy for device capability
    const deviceMemoryGB = (navigator as any).deviceMemory || 4;
    const lowMemoryDevice = deviceMemoryGB < 4;
    
    // Use hardware concurrency as a proxy for CPU capability
    const cpuCores = navigator.hardwareConcurrency || 4;
    const lowPowerCPU = cpuCores < 4;

    // Initial device assessment based on available device info
    let initialLowPowerEstimation = lowMemoryDevice || lowPowerCPU;

    // Try to access battery API if available
    const tryBattery = async () => {
      try {
        if ('getBattery' in navigator) {
          const battery = await (navigator as any).getBattery();
          
          const updateBatteryInfo = () => {
            // Consider low power mode if battery is below 20%
            const lowBattery = battery.level < 0.2;
            const lowPowerMode = lowBattery || (initialLowPowerEstimation && !battery.charging);
            
            setStatus({
              lowPowerMode,
              batteryLevel: battery.level,
              charging: battery.charging
            });
          };
          
          // Update initially
          updateBatteryInfo();
          
          // Add event listeners for battery changes
          battery.addEventListener('levelchange', updateBatteryInfo);
          battery.addEventListener('chargingchange', updateBatteryInfo);
          
          // Clean up event listeners
          return () => {
            battery.removeEventListener('levelchange', updateBatteryInfo);
            battery.removeEventListener('chargingchange', updateBatteryInfo);
          };
        } else {
          // Battery API not available, use our initial estimation
          setStatus({
            lowPowerMode: initialLowPowerEstimation,
            batteryLevel: null,
            charging: null
          });
        }
      } catch (error) {
        console.warn('Battery API error:', error);
        // Fallback to device estimation
        setStatus({
          lowPowerMode: initialLowPowerEstimation,
          batteryLevel: null,
          charging: null
        });
      }
    };
    
    // Check for device power saving mode if available
    if ('powerPreference' in navigator) {
      // This is just a placeholder - currently there's no standard API to detect low power mode
      // Future browsers might implement this feature
    }
    
    // Start battery monitoring
    tryBattery();
  }, []);

  return status;
}
