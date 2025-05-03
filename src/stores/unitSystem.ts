
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCookie, setCookie } from '@/hooks/use-cookie-consent';

export type UnitSystem = 'metric' | 'imperial';

interface UnitSystemState {
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
  toggleUnitSystem: () => void;
}

export const useUnitSystemStore = create<UnitSystemState>()(
  persist(
    (set, get) => ({
      unitSystem: getCookie('units') as UnitSystem || 'metric', // Use cookie value first if available
      setUnitSystem: (system) => {
        setCookie('units', system); // Set the cookie using our consolidated function
        set({ unitSystem: system });
      },
      toggleUnitSystem: () => {
        const newSystem = get().unitSystem === 'metric' ? 'imperial' : 'metric';
        setCookie('units', newSystem); // Set the cookie using our consolidated function
        set({ unitSystem: newSystem });
      },
    }),
    {
      name: 'unit-system-preference', // Keep localStorage for backward compatibility
    }
  )
);
