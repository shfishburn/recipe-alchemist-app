
import { useUnitSystemStore } from '@/stores/unitSystem';
import { UnitSystem } from '@/stores/unitSystem';

export const useUnitSystem = () => {
  const { unitSystem, setUnitSystem, toggleUnitSystem } = useUnitSystemStore();
  
  return {
    unitSystem,
    setUnitSystem,
    toggleUnitSystem,
    isMetric: unitSystem === 'metric',
    isImperial: unitSystem === 'imperial',
  };
};
