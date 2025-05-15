
# Carousel Component Documentation

## Overview

The Recipe Alchemy application uses custom carousel components to display various types of content, including recipes, nutrition information, and scientific explanations. This document outlines the implementation, styling, and usage of these carousel components.

## Carousel Architecture

### File Structure

The carousel implementation is organized in a modular structure:

```
src/styles/carousel/
├── index.css       # Main entry point that imports all carousel styles
├── base.css        # Core carousel container and layout styles
├── navigation.css  # Carousel navigation controls
├── pagination.css  # Pagination indicators
├── progress.css    # Progress indicators for auto-scrolling
├── mobile.css      # Mobile-specific optimizations
└── misc.css        # Miscellaneous and utility styles
```

### Key Components

The carousel system consists of several key components:

1. **Carousel Container**: The main wrapper that holds all carousel elements
2. **Scroll Area**: The horizontally scrollable area containing carousel items
3. **Carousel Items**: Individual content pieces displayed in the carousel
4. **Navigation Controls**: Previous/next buttons for manual navigation
5. **Pagination Indicators**: Visual indicators showing current position
6. **Progress Indicators**: Visual indicators for auto-scrolling progress

## CSS Implementation

### Base Styles

```css
/* Base carousel container styles */
.carousel-container {
  @apply relative h-auto;
  overflow: visible;
  -webkit-overflow-scrolling: touch;
}

.carousel-scroll-area {
  @apply flex overflow-x-auto pb-4 snap-x snap-mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  scroll-behavior: smooth;
  min-height: 0;
  max-width: 100vw;
  scroll-snap-type: x mandatory;
}

.carousel-scroll-area::-webkit-scrollbar {
  display: none;
}

.carousel-item {
  @apply flex-shrink-0 h-auto align-top;
  transition: opacity 0.3s ease;
  max-width: 100%;
  scroll-snap-align: center;
  scroll-snap-stop: always;
}
```

### Navigation Controls

```css
/* Carousel navigation buttons */
.carousel-nav-button {
  @apply rounded-full border-gray-300 dark:border-gray-600 hover:bg-recipe-blue hover:text-white hover:border-transparent;
  min-height: 24px;
  min-width: 24px;
  opacity: 0.9;
  position: absolute;
  top: 50%; 
  transform: translateY(-50%);
  will-change: opacity, background-color, color;
  transition: opacity 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}
```

### Pagination Indicators

```css
/* Pagination dots */
.carousel-pagination {
  @apply flex justify-center gap-1 sm:gap-1.5 mt-2 sm:mt-3;
}

.carousel-pagination-dot {
  @apply inline-block rounded-full bg-gray-300 transition-all duration-200;
  width: 5px !important;
  height: 5px !important;
}
```

### Progress Indicators

```css
/* Auto-scrolling progress indicator */
.carousel-progress-indicator {
  @apply absolute bottom-0 left-0 h-0.5 bg-recipe-blue opacity-70;
  width: 0;
}

.carousel-progress-indicator.animate {
  animation: carousel-progress linear forwards;
}
```

## Mobile Optimization

The carousel is optimized for mobile devices with:

1. **Touch-friendly controls**: Larger touch targets and appropriate spacing
2. **Performance optimizations**: Hardware acceleration for smooth scrolling
3. **Reduced animations**: For better performance on lower-end devices
4. **Snap behavior**: Improved snap behavior for touch interactions
5. **Visible indicators**: Pagination dots more visible on small screens

```css
/* Additional mobile optimizations */
@media (max-width: 640px) {
  .carousel-pagination {
    gap: 0.5rem;
  }
  
  .reduce-motion-mobile {
    scroll-behavior: auto;
  }
  
  /* Ensure mobile carousel doesn't overflow screen */
  .nutrition-carousel {
    margin-left: -2px;
    margin-right: -2px;
    max-width: calc(100% + 4px);
    padding-left: 0;
    padding-right: 0;
  }
}
```

## Accessibility Features

The carousel implementation includes several accessibility enhancements:

1. **Keyboard Navigation**: Next/previous buttons are keyboard accessible
2. **Screen Reader Support**: Appropriate ARIA attributes for screen readers
3. **Reduced Motion Support**: Respects user's prefers-reduced-motion settings
4. **Focus Management**: Proper focus handling when navigating carousel items
5. **Alternative Navigation**: Pagination as an alternative navigation method

```css
/* Reduce motion for user preferences */
@media (prefers-reduced-motion) {
  .carousel-scroll-area {
    scroll-behavior: auto;
  }
  
  .carousel-item {
    transition: none;
  }
}
```

## Usage Examples

### Basic Recipe Carousel

```jsx
<div className="carousel-container">
  <div className="carousel-scroll-area">
    {recipes.map((recipe) => (
      <div className="carousel-item" key={recipe.id}>
        <RecipeCard recipe={recipe} />
      </div>
    ))}
  </div>
  <CarouselNavigation onPrevious={handlePrevious} onNext={handleNext} />
  <CarouselPagination itemCount={recipes.length} activeIndex={activeIndex} />
</div>
```

### Auto-advancing Carousel

```jsx
<div className="carousel-container">
  <div className="carousel-scroll-area">
    {slides.map((slide) => (
      <div className="carousel-item" key={slide.id}>
        {slide.content}
      </div>
    ))}
  </div>
  <div className="carousel-progress-indicator animate" 
       style={{"--carousel-duration": `${duration}ms`}} />
</div>
```

## Performance Considerations

The carousel implementation includes several performance optimizations:

1. **Hardware Acceleration**: Elements use CSS properties that trigger GPU rendering
2. **Minimal DOM Updates**: The design minimizes DOM manipulation during scrolling
3. **Efficient Animation**: Only properties that benefit from hardware acceleration are animated
4. **Lazy Loading**: Content can be lazy-loaded as needed
5. **Optimized Images**: Image carousel items can use optimized loading strategies

```css
/* Performance optimizations */
.hw-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
  will-change: transform;
}
```

## Browser Compatibility

The carousel implementation works across all modern browsers with:

1. **Vendor Prefixes**: Appropriate prefixes for cross-browser compatibility
2. **Fallbacks**: Fallback behaviors for browsers that don't support certain features
3. **Testing**: Verified on Chrome, Firefox, Safari, and Edge
