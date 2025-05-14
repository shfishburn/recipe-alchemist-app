
import React from 'react';
import { Carousel } from '@/components/ui/carousel';
import { MacroCarouselItem } from './nutrition/MacroCarouselItem';
import { macroItems, carbsData, fatsData, sampleMicronutrientsData } from './nutrition/nutrition-sample-data';

export function NutritionPreview() {
  // Add micronutrients data to the third item in the carousel
  const enhancedMacroItems = macroItems.map((item, index) => {
    if (index === 2) {
      return {
        ...item,
        showMicronutrients: true,
        micronutrientsData: sampleMicronutrientsData
      };
    }
    return item;
  });
  
  return (
    <section className="py-6 md:py-12 bg-slate-50 w-full overflow-hidden">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <div className="text-center mb-4 md:mb-6">
          <h2 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">Personalized Nutrition Analysis</h2>
          <p className="text-xs md:text-sm text-muted-foreground max-w-2xl mx-auto px-2">
            Track your macro and micronutrient intake with our intelligent nutrition tracking system
          </p>
        </div>
        
        <div className="max-w-full md:max-w-4xl mx-auto px-1">
          <Carousel
            items={enhancedMacroItems.map((item, index) => ({
              id: `macro-item-${index}`,
              content: item,
            }))}
            renderItem={(item, index) => (
              <MacroCarouselItem 
                item={item.content} 
                carbsData={carbsData} 
                fatsData={fatsData}
              />
            )}
            showArrows={true}
            showDots={true}
            showCounter={false}
            itemWidthMobile="90%"
            itemWidthDesktop="85%"
            className="nutrition-carousel"
            gap="gap-2 md:gap-4"
          />
        </div>
      </div>
    </section>
  );
}

export default NutritionPreview;
