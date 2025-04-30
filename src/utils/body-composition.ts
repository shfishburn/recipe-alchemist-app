
export function getBodyFatPercentile(age: number, gender: string, bodyFatPercentage: number) {
  // These are approximate percentiles based on general health guidelines
  // In a real application, these would be more precise and age-specific
  
  let percentile = 50; // Default middle percentile
  let category: string | undefined;
  let healthRisks: string[] = [];
  
  if (gender === 'male') {
    if (bodyFatPercentage < 6) {
      percentile = 5;
      category = 'Essential Fat';
      healthRisks = ['Hormonal dysfunction', 'Immune system compromise'];
    } else if (bodyFatPercentage < 14) {
      percentile = 20;
      category = 'Elite';
    } else if (bodyFatPercentage < 18) {
      percentile = 40;
      category = 'Fitness';
    } else if (bodyFatPercentage < 25) {
      percentile = 60;
      category = 'Average';
    } else if (bodyFatPercentage < 30) {
      percentile = 80;
      category = 'Overweight';
      healthRisks = ['Increased risk of heart disease', 'Type 2 diabetes risk'];
    } else {
      percentile = 95;
      category = 'Obese';
      healthRisks = ['High risk of heart disease', 'High risk of diabetes', 'Metabolic syndrome risk'];
    }
  } else { // female
    if (bodyFatPercentage < 14) {
      percentile = 5;
      category = 'Essential Fat';
      healthRisks = ['Hormonal dysfunction', 'Reproductive issues', 'Immune system compromise'];
    } else if (bodyFatPercentage < 21) {
      percentile = 20;
      category = 'Elite';
    } else if (bodyFatPercentage < 25) {
      percentile = 40;
      category = 'Fitness';
    } else if (bodyFatPercentage < 32) {
      percentile = 60;
      category = 'Average';
    } else if (bodyFatPercentage < 38) {
      percentile = 80;
      category = 'Overweight';
      healthRisks = ['Increased risk of heart disease', 'Type 2 diabetes risk'];
    } else {
      percentile = 95;
      category = 'Obese';
      healthRisks = ['High risk of heart disease', 'High risk of diabetes', 'Metabolic syndrome risk'];
    }
  }
  
  // Adjust percentile slightly based on age
  // Older people generally have higher body fat percentages
  if (age > 40) {
    percentile = Math.max(5, percentile - 10);
  } else if (age > 60) {
    percentile = Math.max(5, percentile - 20);
  }
  
  return { percentile, category, healthRisks };
}

export function calculateMetabolicAdaptation(params: {
  consecutiveWeeksDieting: number;
  adaptationRate: number;
  maximumAdaptation: number;
  initialWeight: number;
  currentWeight: number;
}) {
  const {
    consecutiveWeeksDieting,
    adaptationRate,
    maximumAdaptation,
    initialWeight,
    currentWeight
  } = params;
  
  // Calculate adaptation based on weeks dieting
  let adaptation = (consecutiveWeeksDieting * adaptationRate) / 100;
  
  // Cap at maximum adaptation
  adaptation = Math.min(adaptation, maximumAdaptation / 100);
  
  // Additional adaptation based on weight loss
  // For every 5% of body weight lost, add 1% to adaptation
  if (initialWeight > 0 && currentWeight < initialWeight) {
    const percentBodyWeightLost = ((initialWeight - currentWeight) / initialWeight) * 100;
    const additionalAdaptation = (percentBodyWeightLost / 5) * 0.01; // 1% for every 5% body weight
    adaptation += additionalAdaptation;
  }
  
  // Cap final result at maximum adaptation
  return Math.min(adaptation, maximumAdaptation / 100);
}
