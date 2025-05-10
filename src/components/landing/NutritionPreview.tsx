
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
    <section className="py-8 md:py-16 bg-slate-50 w-full overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-xl md:text-3xl font-bold mb-2">Personalized Nutrition Analysis</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-2">
            Track your macro and micronutrient intake with our intelligent nutrition tracking system
          </p>
        </div>
        
        <div className="max-w-full md:max-w-4xl mx-auto">
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
