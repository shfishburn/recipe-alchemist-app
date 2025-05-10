
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
    <section className="py-12 md:py-16 bg-slate-50">
      <div className="container-page">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Personalized Nutrition Analysis</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Track your macro and micronutrient intake with our intelligent nutrition tracking system
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
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
            itemWidthMobile="100%"
            itemWidthDesktop="90%"
            className="nutrition-carousel"
          />
        </div>
      </div>
    </section>
  );
}

export default NutritionPreview;
