
// Re-export all carousel components from this index file
export * from './carousel';
export * from './carousel-item';
export * from './carousel-pagination';
export * from './carousel-controls';

// Export with more descriptive names for clarity
import { Carousel } from './carousel';
import { CarouselItem } from './carousel-item';
import { CarouselPagination } from './carousel-pagination';
import { CarouselPrevious, CarouselNext } from './carousel-controls';

// Content component for better organization
const CarouselContent = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`swiper-wrapper ${className || ''}`} {...props}>
    {children}
  </div>
);

CarouselContent.displayName = "CarouselContent";

export { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext, 
  CarouselPagination
};
