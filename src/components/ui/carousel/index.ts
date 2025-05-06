
// Re-export all carousel components from this index file
export * from './carousel';
export * from './carousel-item';
export * from './carousel-pagination';
export * from './carousel-content';

// Export with more descriptive names for clarity
import { Carousel } from './carousel';
import { CarouselItem } from './carousel-item';
import { CarouselPagination } from './carousel-pagination';
import { CarouselContent } from './carousel-content';

export { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPagination
};
