
import { useUnitSystemStore } from '@/stores/unitSystem';
import { UnitSystem } from '@/stores/unitSystem';

export const useUnitSystem = () => {
  const { unitSystem, setUnitSystem, toggleUnitSystem } = useUnitSystemStore();
  
  return {
    unitSystem,
    setUnitSystem,
    updateUnitSystem: setUnitSystem, // Add this alias for compatibility
    toggleUnitSystem,
    isMetric: unitSystem === 'metric',
    isImperial: unitSystem === 'imperial',
  };
};
