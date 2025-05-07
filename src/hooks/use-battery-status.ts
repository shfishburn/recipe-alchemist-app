
import { useState, useEffect } from 'react';

interface BatteryStatus {
  charging: boolean;
  level: number;
  chargingTime: number;
  dischargingTime: number;
  lowPowerMode: boolean;
}

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<{
    charging: boolean;
    level: number;
    chargingTime: number;
    dischargingTime: number;
    addEventListener: (event: string, callback: () => void) => void;
    removeEventListener: (event: string, callback: () => void) => void;
  }>;
}

export function useBatteryStatus() {
  const [batteryStatus, setBatteryStatus] = useState<BatteryStatus>({
    charging: true,
    level: 1,
    chargingTime: 0,
    dischargingTime: Infinity,
    lowPowerMode: false,
  });

  useEffect(() => {
    const nav = navigator as NavigatorWithBattery;
    
    if (!nav.getBattery) {
      return;
    }

    let battery: any;
    
    const updateBatteryStatus = () => {
      if (!battery) return;
      
      const newStatus = {
        charging: battery.charging,
        level: battery.level,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
        // Consider low battery when below 20% and not charging
        lowPowerMode: battery.level < 0.2 && !battery.charging,
      };
      
      setBatteryStatus(newStatus);
    };

    nav.getBattery().then((b) => {
      battery = b;
      updateBatteryStatus();

      battery.addEventListener('chargingchange', updateBatteryStatus);
      battery.addEventListener('levelchange', updateBatteryStatus);
      battery.addEventListener('chargingtimechange', updateBatteryStatus);
      battery.addEventListener('dischargingtimechange', updateBatteryStatus);
    });

    return () => {
      if (battery) {
        battery.removeEventListener('chargingchange', updateBatteryStatus);
        battery.removeEventListener('levelchange', updateBatteryStatus);
        battery.removeEventListener('chargingtimechange', updateBatteryStatus);
        battery.removeEventListener('dischargingtimechange', updateBatteryStatus);
      }
    };
  }, []);

  return batteryStatus;
}
