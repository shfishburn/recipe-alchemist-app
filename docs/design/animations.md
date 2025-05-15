
# Animations

Recipe Alchemy uses animations to enhance user experience, provide feedback, and guide attention. This document outlines our animation principles, specifications, and implementation patterns to ensure consistent, purposeful, and performant animations throughout the application.

## Animation Principles

Our animation strategy is guided by these core principles:

### 1. Purposeful Motion

Each animation should serve a clear purpose:
- **Give feedback** on user actions
- **Orient users** during navigation and state changes
- **Direct attention** to important information
- **Create continuity** between states and screens
- **Express brand personality** in subtle, appropriate ways

### 2. Subtle and Natural

Animations should feel natural and unobtrusive:
- **Subtle movements** that don't distract from content
- **Natural physics** that reflect real-world motion
- **Appropriate timing** that feels responsive yet natural
- **Contextual scale** - more subtle for frequent actions, more pronounced for significant events

### 3. Performance First

Animations must perform well across all devices:
- **Optimize for 60fps** rendering
- **Respect reduced motion preferences**
- **Minimize layout thrashing**
- **Use hardware acceleration appropriately**

## Animation Specifications

### Timing and Duration

Recipe Alchemy uses consistent timing for animations:

| Type | Duration | CSS Variable | Tailwind Class |
|------|----------|-------------|---------------|
| Instant | 100ms | `--duration-instant` | `duration-100` |
| Fast | 150ms | `--duration-fast` | `duration-150` |
| Standard | 300ms | `--duration-standard` | `duration-300` |
| Emphatic | 500ms | `--duration-emphatic` | `duration-500` |
| Complex | 700ms | `--duration-complex` | `duration-700` |

Guidelines for choosing duration:
- **Shorter durations** (100-150ms) for immediate feedback and small elements
- **Standard durations** (300ms) for most UI transitions
- **Longer durations** (500-700ms) for more complex or larger animations

### Easing Functions

| Type | Function | CSS Variable | Tailwind Class | Purpose |
|------|----------|-------------|---------------|---------|
| Standard | `ease-in-out` | `--ease-standard` | `ease-in-out` | Most transitions |
| Enter | `ease-out` | `--ease-enter` | `ease-out` | Elements entering the screen |
| Exit | `ease-in` | `--ease-exit` | `ease-in` | Elements exiting the screen |
| Bounce | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | `--ease-bounce` | `ease-[cubic-bezier(0.175,0.885,0.32,1.275)]` | Playful or emphatic animations |
| Smooth | `cubic-bezier(0.4, 0.0, 0.2, 1)` | `--ease-smooth` | `ease-[cubic-bezier(0.4,0,0.2,1)]` | Smooth transitions |

### Animation Properties

For optimal performance, prefer animating these properties:
- `opacity`
- `transform` (`scale`, `translate`, `rotate`)

Avoid animating these properties when possible:
- `width`/`height` (use `transform: scale()` instead)
- `top`/`left`/`bottom`/`right` (use `transform: translate()` instead)
- `box-shadow` (can cause repaints)
- `border-radius` (can be expensive)

## Standard Animation Patterns

### Transition Animations

#### Fade Transition

```css
.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  opacity: 1;
  transition: opacity 300ms var(--ease-enter);
}
.fade-exit {
  opacity: 1;
}
.fade-exit-active {
  opacity: 0;
  transition: opacity 300ms var(--ease-exit);
}
```

#### Slide Transition

```css
.slide-enter {
  transform: translateY(10px);
  opacity: 0;
}
.slide-enter-active {
  transform: translateY(0);
  opacity: 1;
  transition: opacity 300ms var(--ease-enter), transform 300ms var(--ease-enter);
}
.slide-exit {
  transform: translateY(0);
  opacity: 1;
}
.slide-exit-active {
  transform: translateY(10px);
  opacity: 0;
  transition: opacity 300ms var(--ease-exit), transform 300ms var(--ease-exit);
}
```

### Hover Animations

#### Scale Hover

```css
.hover-scale {
  transition: transform 150ms var(--ease-standard);
}
.hover-scale:hover {
  transform: scale(1.05);
}
```

#### Underline Hover

```css
.hover-underline {
  position: relative;
}
.hover-underline::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 300ms var(--ease-standard);
}
.hover-underline:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}
```

### Feedback Animations

#### Button Press

```css
.button-press {
  transition: transform 100ms var(--ease-standard);
}
.button-press:active {
  transform: scale(0.97);
}
```

#### Loading Spinner

```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-spinner {
  animation: spin 1s linear infinite;
}
```

#### Pulse Animation

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.pulse-animation {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### State Change Animations

#### Accordion

```css
.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 300ms var(--ease-standard);
}

.accordion-content.open {
  max-height: 1000px; /* Arbitrary large value */
}
```

#### Tab Switching

```css
.tab-content {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 300ms var(--ease-enter), transform 300ms var(--ease-enter);
}

.tab-content.active {
  opacity: 1;
  transform: translateY(0);
}
```

## Implementation Techniques

### CSS Transitions

For simple animations, use CSS transitions:

```css
.card {
  transition: transform 150ms var(--ease-standard), 
              box-shadow 150ms var(--ease-standard);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
```

### CSS Animations

For repeating or more complex animations, use CSS animations:

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 300ms var(--ease-enter) forwards;
}
```

### React Animation Patterns

#### Using Framer Motion

For more complex animations, Recipe Alchemy uses Framer Motion:

```tsx
import { motion } from "framer-motion";

function AnimatedCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -5,
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)" 
      }}
      className="card"
    >
      Card content
    </motion.div>
  );
}
```

#### Using CSS Classes with React

```tsx
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

function FadeInComponent({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
    <div className={cn(
      "transition-opacity duration-300 ease-out",
      isVisible ? "opacity-100" : "opacity-0"
    )}>
      {children}
    </div>
  );
}
```

## Animation Examples in Recipe Alchemy

### Recipe Card Hover Animation

```tsx
<div className="group">
  <div className="recipe-card transition-all duration-300 ease-out group-hover:transform group-hover:translate-y-[-4px] group-hover:shadow-lg">
    {/* Card content */}
  </div>
</div>
```

### Loading States

```tsx
<button 
  disabled={isLoading}
  className="relative"
>
  <span className={cn(
    "transition-opacity duration-150",
    isLoading ? "opacity-0" : "opacity-100"
  )}>
    Submit
  </span>
  
  {isLoading && (
    <span className="absolute inset-0 flex items-center justify-center">
      <Loader2 className="h-4 w-4 animate-spin" />
    </span>
  )}
</button>
```

### Page Transitions

```tsx
import { motion } from "framer-motion";

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

## Accessibility Considerations

### Respecting User Preferences

Always respect the `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

In React components:

```tsx
import { useReducedMotion } from "@/hooks/use-reduced-motion";

function AnimatedComponent() {
  const prefersReducedMotion = useReducedMotion();
  
  const animationProps = prefersReducedMotion 
    ? {} 
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3 }
      };
  
  return (
    <motion.div {...animationProps}>
      Content
    </motion.div>
  );
}
```

### Animation Safety

- Avoid flashing content or rapid flashing animations
- Ensure animations don't interfere with reading or interaction
- Provide alternatives for animated content
- Keep animation subtle and purposeful

## Performance Optimization

### Animation Performance Tips

1. **Use `transform` and `opacity`** for most animations
2. **Avoid animating layout properties** like width, height, padding
3. **Use hardware acceleration** with `will-change` or `transform: translateZ(0)` for complex animations
4. **Avoid animating too many elements** simultaneously
5. **Debounce animations** triggered by scroll or resize events
6. **Test on lower-powered devices** to ensure good performance
7. **Use `requestAnimationFrame`** for JavaScript animations

### Hardware Acceleration

Apply hardware acceleration judiciously:

```css
.hardware-accelerated {
  will-change: transform;
  /* or */
  transform: translateZ(0);
}
```

## Related Documentation

- [Design Tokens](./tokens.md) - Animation timing and easing variables
- [Components](./components.md) - Component-specific animation patterns
- [Accessibility](./accessibility.md) - Animation accessibility guidelines
