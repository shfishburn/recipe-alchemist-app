
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UnitSystem = 'metric' | 'imperial';

interface UnitSystemState {
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
  toggleUnitSystem: () => void;
}

export const useUnitSystemStore = create<UnitSystemState>()(
  persist(
    (set, get) => ({
      unitSystem: 'metric',
      setUnitSystem: (system) => set({ unitSystem: system }),
      toggleUnitSystem: () => set({ 
        unitSystem: get().unitSystem === 'metric' ? 'imperial' : 'metric' 
      }),
    }),
    {
      name: 'unit-system-preference',
    }
  )
);
