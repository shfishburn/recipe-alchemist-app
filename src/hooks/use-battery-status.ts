
import { useState, useEffect } from 'react';
import { useMediaQuery } from './use-media-query';

interface BatteryStatus {
  charging: boolean;
  level: number;
  chargingTime: number;
  dischargingTime: number;
}

interface BatteryManager extends BatteryStatus, EventTarget {
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
}

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

export function useBatteryStatus() {
  const [batteryStatus, setBatteryStatus] = useState<Partial<BatteryStatus>>({
    charging: true, // Assume plugged in by default
    level: 1, // Assume full battery by default
    chargingTime: 0,
    dischargingTime: Infinity,
  });
  const [supported, setSupported] = useState<boolean | null>(null);
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  
  // Use a state to track if device is in low power mode
  const [lowPowerMode, setLowPowerMode] = useState(false);

  // Check for battery API support and initialize
  useEffect(() => {
    const nav = navigator as NavigatorWithBattery;
    
    if (nav.getBattery) {
      setSupported(true);
      
      const handleBatteryChange = (battery: BatteryManager) => {
        setBatteryStatus({
          charging: battery.charging,
          level: battery.level,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime,
        });
        
        // Consider device in low power mode if:
        // 1. Battery level is below 20% and not charging
        // 2. The user has explicitly chosen reduced motion
        setLowPowerMode(
          (battery.level <= 0.2 && !battery.charging) || 
          prefersReducedMotion
        );
      };
      
      nav.getBattery().then((battery) => {
        handleBatteryChange(battery);
        
        // Add event listeners
        battery.addEventListener('chargingchange', () => handleBatteryChange(battery));
        battery.addEventListener('levelchange', () => handleBatteryChange(battery));
        battery.addEventListener('chargingtimechange', () => handleBatteryChange(battery));
        battery.addEventListener('dischargingtimechange', () => handleBatteryChange(battery));
        
        // Clean up event listeners
        return () => {
          battery.removeEventListener('chargingchange', () => handleBatteryChange(battery));
          battery.removeEventListener('levelchange', () => handleBatteryChange(battery));
          battery.removeEventListener('chargingtimechange', () => handleBatteryChange(battery));
          battery.removeEventListener('dischargingtimechange', () => handleBatteryChange(battery));
        };
      }).catch(() => {
        setSupported(false);
      });
    } else {
      setSupported(false);
      
      // If we can't detect battery, use reduced motion preference as a proxy
      setLowPowerMode(prefersReducedMotion);
    }
  }, [prefersReducedMotion]);
  
  // Consider reduced motion preference changes
  useEffect(() => {
    if (!supported) {
      setLowPowerMode(prefersReducedMotion);
    }
  }, [prefersReducedMotion, supported]);
  
  // On mobile Safari, we may not have battery API
  // Use a heuristic for mobile devices without battery API
  useEffect(() => {
    if (supported !== false) return;
    
    // Check if it's likely to be a mobile device
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    // If it's a mobile device and we don't have battery API access,
    // assume we should be conservative with animations
    if (isMobileDevice) {
      setLowPowerMode(true);
    }
  }, [supported]);
  
  return {
    ...batteryStatus,
    supported,
    lowPowerMode,
  };
}
