
# Carousel Component

This document provides detailed information about the custom carousel implementation in Recipe Alchemy, including its architecture, configuration options, and usage patterns.

## Overview

The Recipe Alchemy carousel is built on top of Embla Carousel, providing enhanced features and styling consistent with our design system. The carousel is designed to be flexible, performant, and accessible, supporting various content types and responsive behaviors.

## Architecture

### Component Structure

The carousel implementation follows a modular architecture:

```
src/styles/carousel/
├── index.css          # Main entry point
├── base.css           # Core carousel styles
├── navigation.css     # Navigation button styles
├── pagination.css     # Pagination dots styles
├── progress.css       # Progress bar styles
├── mobile.css         # Mobile-specific optimizations
└── misc.css           # Miscellaneous utilities
```

### Core Components

1. **CarouselWrapper** - Container component that manages carousel state
2. **CarouselViewport** - Visible area of the carousel
3. **CarouselContainer** - Container for slides
4. **CarouselSlide** - Individual slide component
5. **CarouselControls** - Navigation buttons and pagination dots
6. **CarouselProgress** - Visual progress indicator

## Basic Usage

```tsx
import { Carousel, CarouselSlide, CarouselControls } from "@/components/carousel";

function BasicCarousel() {
  return (
    <Carousel>
      <CarouselSlide>
        <div className="h-48 bg-gray-200 rounded flex items-center justify-center">
          Slide 1
        </div>
      </CarouselSlide>
      <CarouselSlide>
        <div className="h-48 bg-gray-200 rounded flex items-center justify-center">
          Slide 2
        </div>
      </CarouselSlide>
      <CarouselSlide>
        <div className="h-48 bg-gray-200 rounded flex items-center justify-center">
          Slide 3
        </div>
      </CarouselSlide>
      <CarouselControls />
    </Carousel>
  );
}
```

## Advanced Usage

### Recipe Card Carousel

```tsx
import { Carousel, CarouselSlide, CarouselControls } from "@/components/carousel";
import { RecipeCard } from "@/components/recipes/RecipeCard";

function RecipeCarousel({ recipes }) {
  return (
    <Carousel
      options={{
        align: 'start',
        containScroll: 'trimSnaps',
        dragFree: true
      }}
      breakpoints={{
        '(min-width: 640px)': {
          slides: { perView: 2, spacing: 16 }
        },
        '(min-width: 1024px)': {
          slides: { perView: 3, spacing: 24 }
        },
        '(min-width: 1280px)': {
          slides: { perView: 4, spacing: 24 }
        }
      }}
    >
      {recipes.map(recipe => (
        <CarouselSlide key={recipe.id}>
          <RecipeCard recipe={recipe} />
        </CarouselSlide>
      ))}
      <CarouselControls />
    </Carousel>
  );
}
```

### Auto-Playing Carousel

```tsx
import { Carousel, CarouselSlide, CarouselControls, CarouselProgress } from "@/components/carousel";

function AutoPlayCarousel() {
  return (
    <Carousel
      options={{
        loop: true
      }}
      plugins={[
        AutoplayPlugin({
          delay: 4000,
          stopOnInteraction: true,
          stopOnMouseEnter: true
        })
      ]}
    >
      {/* Slides */}
      <CarouselControls />
      <CarouselProgress />
    </Carousel>
  );
}
```

## API Reference

### Carousel Component

The main wrapper component that initializes the carousel.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `EmblaOptionsType` | `{}` | Core carousel configuration options |
| `plugins` | `EmblaPluginType[]` | `[]` | Embla carousel plugins |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Carousel orientation |
| `breakpoints` | `Record<string, EmblaOptionsType>` | `{}` | Responsive breakpoint options |
| `className` | `string` | `''` | Additional CSS class names |
| `skipSnaps` | `boolean` | `false` | Allow skipping of snaps during drag |
| `onInit` | `(embla: EmblaCarouselType) => void` | `undefined` | Callback when carousel initializes |
| `children` | `React.ReactNode` | Required | Carousel content |

### CarouselSlide Component

Individual slide container.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Additional CSS class names |
| `children` | `React.ReactNode` | Required | Slide content |

### CarouselControls Component

Navigation controls for the carousel.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showArrows` | `boolean` | `true` | Show navigation arrows |
| `showDots` | `boolean` | `true` | Show pagination dots |
| `arrowPosition` | `'inside' \| 'outside'` | `'inside'` | Position of arrow controls |
| `className` | `string` | `''` | Additional CSS class names |
| `prevArrow` | `React.ReactNode` | Default arrow | Custom previous arrow element |
| `nextArrow` | `React.ReactNode` | Default arrow | Custom next arrow element |
| `dotRender` | `(index: number, isSelected: boolean) => React.ReactNode` | Default dot | Custom dot renderer |

### CarouselProgress Component

Visual progress indicator.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'bar' \| 'dots'` | `'bar'` | Progress indicator style |
| `className` | `string` | `''` | Additional CSS class names |

## Styling Customization

### Custom Slide Styles

```tsx
<Carousel>
  <CarouselSlide className="custom-slide bg-gradient-to-r from-blue-500 to-purple-500 text-white">
    Gradient Slide
  </CarouselSlide>
</Carousel>
```

### Custom Navigation

```tsx
import { ChevronLeft, ChevronRight } from "lucide-react";

<Carousel>
  {/* Slides */}
  <CarouselControls
    showDots={false}
    arrowPosition="outside"
    prevArrow={<ChevronLeft className="h-6 w-6" />}
    nextArrow={<ChevronRight className="h-6 w-6" />}
    className="mt-4"
  />
</Carousel>
```

### Custom Progress Indicator

```tsx
<Carousel>
  {/* Slides */}
  <CarouselProgress
    variant="dots"
    className="mt-4"
  />
</Carousel>
```

## Responsive Configuration

The carousel supports responsive configuration through the `breakpoints` prop:

```tsx
<Carousel
  breakpoints={{
    // Small screens (640px and above)
    '(min-width: 640px)': {
      slides: {
        perView: 2,
        spacing: 16
      }
    },
    // Medium screens (768px and above)
    '(min-width: 768px)': {
      slides: {
        perView: 3,
        spacing: 20
      }
    },
    // Large screens (1024px and above)
    '(min-width: 1024px)': {
      slides: {
        perView: 4,
        spacing: 24
      }
    }
  }}
>
  {/* Slides */}
</Carousel>
```

## Animation Options

The carousel supports various animation options:

```tsx
<Carousel
  options={{
    // Animation speed
    speed: 10, // Default is 10
    
    // Animation easing function for scroll
    easing: (x) => 1 - Math.pow(1 - x, 4), // Default cubic easing
    
    // Scroll behavior when a slide is selected
    slidesToScroll: 1, // Default is 1
    
    // Slide snapping behavior
    dragFree: false, // Default is false
    
    // Adjusts the position of the active slide
    align: 'center', // 'start' | 'center' | 'end'
    
    // Jump directly to slides when clicking navigation
    skipSnaps: false
  }}
>
  {/* Slides */}
</Carousel>
```

## Accessibility Features

The carousel implements several accessibility features:

### Keyboard Navigation

Users can navigate the carousel with keyboard:
- `Tab`: Focus on carousel controls
- `Left/Right Arrow`: Navigate between slides when carousel has focus
- `Enter/Space`: Select the currently focused slide or control

### Screen Reader Support

- Appropriate ARIA roles and labels
- Announcements for slide changes
- Hidden controls for screen reader navigation

### Focus Management

- Focus is appropriately moved when slides change
- Focus is trapped within the carousel when navigating
- Focus indicators are clearly visible

Example of accessibility implementation:

```tsx
<Carousel aria-label="Featured Recipes">
  <CarouselSlide>
    <div aria-roledescription="slide" aria-label="1 of 5">
      Slide content
    </div>
  </CarouselSlide>
  {/* More slides */}
  <CarouselControls 
    prevArrow={<button aria-label="Previous slide">Prev</button>}
    nextArrow={<button aria-label="Next slide">Next</button>}
  />
</Carousel>
```

## Performance Considerations

The carousel is optimized for performance:

1. **Virtualization** - Only rendering visible slides and a few adjacent ones
2. **Intersection Observer** - Pausing autoplay when carousel is not in viewport
3. **Optimized Animations** - Using CSS properties that don't trigger layout
4. **Touch Optimizations** - Improved performance on touch devices
5. **Image Lazy Loading** - Loading images only when needed

## Common Patterns and Examples

### Full-Width Banner Carousel

```tsx
<Carousel
  options={{
    loop: true,
    align: 'center'
  }}
  className="w-full"
>
  <CarouselSlide className="w-full">
    <img 
      src="/banner1.jpg" 
      alt="Banner 1" 
      className="w-full h-[300px] object-cover"
    />
  </CarouselSlide>
  {/* More slides */}
  <CarouselControls />
  <CarouselProgress />
</Carousel>
```

### Card Carousel with Peek

```tsx
<Carousel
  options={{
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true
  }}
  className="w-full"
>
  {cards.map(card => (
    <CarouselSlide key={card.id} className="w-[300px] pl-4 first:pl-0">
      <div className="bg-white p-4 rounded shadow">
        {card.content}
      </div>
    </CarouselSlide>
  ))}
  <CarouselControls />
</Carousel>
```

### Testimonial Carousel

```tsx
<Carousel
  options={{
    loop: true,
    align: 'center'
  }}
  plugins={[AutoplayPlugin({ delay: 5000 })]}
>
  {testimonials.map(testimonial => (
    <CarouselSlide key={testimonial.id}>
      <div className="bg-white p-6 rounded-lg shadow text-center max-w-lg mx-auto">
        <p className="italic">{testimonial.quote}</p>
        <p className="font-bold mt-4">{testimonial.author}</p>
      </div>
    </CarouselSlide>
  ))}
  <CarouselControls />
</Carousel>
```

## Related Documentation

- [Design System](./design/README.md) - Core design guidelines
- [Components](./design/components.md) - Other UI components
- [Animations](./design/animations.md) - Animation principles and patterns
