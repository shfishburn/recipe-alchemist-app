
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UnitSystem = 'metric' | 'imperial';

// Cookie functions for persistent unit setting
const setCookieUnits = (units: UnitSystem) => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1); // persists for 1 year
  document.cookie = `units=${units};expires=${d.toUTCString()};path=/;Secure;SameSite=Strict`;
};

const getCookieUnits = (): UnitSystem | null => {
  const match = document.cookie.match(/units=(metric|imperial)/);
  return match ? match[1] as UnitSystem : null;
};

interface UnitSystemState {
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
  toggleUnitSystem: () => void;
}

export const useUnitSystemStore = create<UnitSystemState>()(
  persist(
    (set, get) => ({
      unitSystem: getCookieUnits() || 'metric', // Use cookie value first if available
      setUnitSystem: (system) => {
        setCookieUnits(system); // Set the cookie
        set({ unitSystem: system });
      },
      toggleUnitSystem: () => {
        const newSystem = get().unitSystem === 'metric' ? 'imperial' : 'metric';
        setCookieUnits(newSystem); // Set the cookie
        set({ unitSystem: newSystem });
      },
    }),
    {
      name: 'unit-system-preference', // Keep localStorage for backward compatibility
    }
  )
);
