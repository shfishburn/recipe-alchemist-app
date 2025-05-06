
import React from 'react';
import { CarouselExample } from './CarouselExample';

export function CarouselTest() {
  // Create sample items
  const items = [
    <div key="1" className="flex h-full min-h-[180px] items-center justify-center rounded-md bg-primary p-6">
      <span className="text-3xl font-semibold text-white">Slide 1</span>
    </div>,
    <div key="2" className="flex h-full min-h-[180px] items-center justify-center rounded-md bg-secondary p-6">
      <span className="text-3xl font-semibold text-white">Slide 2</span>
    </div>,
    <div key="3" className="flex h-full min-h-[180px] items-center justify-center rounded-md bg-accent p-6">
      <span className="text-3xl font-semibold text-white">Slide 3</span>
    </div>,
  ];

  return (
    <div className="flex flex-col space-y-12 py-8 px-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">Basic Carousel</h2>
        <CarouselExample 
          items={items} 
          autoplay={false}
        />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Autoplay Carousel</h2>
        <CarouselExample 
          items={items} 
          autoplay={true}
          autoplayInterval={3000}
        />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Compact Carousel (Arrows Only)</h2>
        <CarouselExample 
          items={items} 
          autoplay={false}
          showPagination={false}
        />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Custom Item Width Carousel</h2>
        <CarouselExample 
          items={items} 
          autoplay={false}
          itemClassName="md:basis-1/2 lg:basis-1/3"
        />
      </div>
    </div>
  );
}
