
# Layout System

Recipe Alchemy's layout system provides a structured approach to page organization, spacing, and responsive behavior. This system ensures consistency across the application while supporting a wide range of content needs.

## Page Structure

### Container System

The application uses a container-based layout system with several key container types:

#### 1. Page Containers

The `container-page` class creates a centered content area with responsive padding:

```css
.container-page {
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container-page {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .container-page {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
```

#### 2. Content Width Variants

The `PageContainer` component offers several width variants:

- **Default**: `max-width: 4xl` (896px) - Standard content width
- **Narrow**: `max-width: 2xl` (672px) - Narrower width for forms and focused content
- **Full**: `max-width: 7xl` (1280px) - Full-width content

```tsx
import { PageContainer } from "@/components/ui/containers";

// Default width
<PageContainer>
  Standard content width
</PageContainer>

// Narrow width
<PageContainer variant="narrow">
  Narrower content for forms
</PageContainer>

// Full width
<PageContainer variant="full">
  Full-width content
</PageContainer>
```

### Section Structure

The `ContentSection` component provides consistent vertical spacing for page sections:

```tsx
import { ContentSection } from "@/components/ui/containers";

<ContentSection>
  <h2>Section Title</h2>
  <p>Section content with consistent spacing</p>
</ContentSection>
```

CSS implementation:

```css
.section-spacing {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

@media (min-width: 640px) {
  .section-spacing {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }
}

@media (min-width: 768px) {
  .section-spacing {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
}
```

## Grid System

Recipe Alchemy uses Tailwind's grid utilities for layout:

### Standard Grid

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Recipe Card Grid

Recipe cards are displayed in a responsive grid:

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  <RecipeCard />
  <RecipeCard />
  <RecipeCard />
</div>
```

### Auto-fit Grid

For items that should fill available space automatically:

```html
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-auto gap-4">
  <GridItem />
  <GridItem />
  <GridItem />
</div>
```

## Responsive Design

The layout system follows mobile-first responsive design principles:

### Breakpoints

| Breakpoint | Width | Description |
|------------|-------|-------------|
| `sm` | 640px | Small devices (large phones) |
| `md` | 768px | Medium devices (tablets) |
| `lg` | 1024px | Large devices (laptops) |
| `xl` | 1280px | Extra large devices (desktops) |
| `2xl` | 1536px | Very large screens |

### Responsive Patterns

#### Stack-to-Row Pattern

Content stacks vertically on mobile and flows horizontally on larger screens:

```html
<div class="flex flex-col md:flex-row gap-4">
  <div>Left content</div>
  <div>Right content</div>
</div>
```

#### Column Width Pattern

Columns adjust their relative widths across breakpoints:

```html
<div class="flex flex-col md:flex-row">
  <div class="w-full md:w-1/3">Sidebar</div>
  <div class="w-full md:w-2/3">Main content</div>
</div>
```

#### Visibility Pattern

Elements show or hide based on screen size:

```html
<div class="hidden md:block">Only visible on tablets and up</div>
<div class="block md:hidden">Only visible on mobile</div>
```

## Spacing System

Consistent spacing is applied through standardized classes:

### Horizontal Spacing

```html
<div class="space-x-4">
  <span>Item 1</span>
  <span>Item 2</span>
  <span>Item 3</span>
</div>
```

### Vertical Spacing

```html
<div class="space-y-6">
  <div>Section 1</div>
  <div>Section 2</div>
  <div>Section 3</div>
</div>
```

### Responsive Spacing

Spacing increases on larger screens:

```html
<div class="space-y-4 md:space-y-6 lg:space-y-8">
  <div>Section with responsive spacing</div>
  <div>Section with responsive spacing</div>
</div>
```

## Layout Components

### PageContainer

The `PageContainer` component provides consistent page-level layout:

```tsx
interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'full' | 'narrow';
  withNavbar?: boolean;
}
```

Usage:

```tsx
import { PageContainer } from "@/components/ui/containers";

<PageContainer variant="default" withNavbar={true}>
  <h1>Page Title</h1>
  <p>Page content with consistent layout</p>
</PageContainer>
```

### ContentSection

The `ContentSection` component provides consistent section-level layout:

```tsx
interface ContentSectionProps {
  children: React.ReactNode;
  className?: string;
}
```

Usage:

```tsx
import { ContentSection } from "@/components/ui/containers";

<ContentSection>
  <h2>Section Title</h2>
  <p>Section content with consistent spacing</p>
</ContentSection>
```

## Layout Patterns

### Two-Column Layout

Standard two-column layout with sidebar and main content:

```tsx
<div className="flex flex-col lg:flex-row">
  <div className="w-full lg:w-1/4 lg:pr-6">
    {/* Sidebar content */}
  </div>
  <div className="w-full lg:w-3/4">
    {/* Main content */}
  </div>
</div>
```

### Recipe Detail Layout

Recipe detail page with multiple sections:

```tsx
<PageContainer>
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <div className="lg:col-span-8">
      {/* Recipe content */}
    </div>
    <div className="lg:col-span-4">
      {/* Recipe sidebar */}
    </div>
  </div>
</PageContainer>
```

### Card Grid Layout

Card grid with responsive columns:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {recipes.map(recipe => (
    <RecipeCard key={recipe.id} recipe={recipe} />
  ))}
</div>
```

## Accessibility Considerations

### Focus Management

Layout components maintain proper focus order:

- Ensure a logical tab order follows the visual layout
- Avoid hidden content that receives focus
- Use `tabindex="0"` only when necessary

### Screen Reader Compatibility

Layout components support screen readers:

- Use semantic HTML elements for layout (e.g., `<main>`, `<section>`, `<aside>`)
- Include landmark roles for important sections
- Ensure content order makes logical sense when linearized

### Responsive Accessibility

- Ensure touch targets are large enough (minimum 44px × 44px)
- Maintain readable text sizes at all viewport widths
- Avoid relying solely on hover states for important interactions

## Mobile Optimizations

### Touch Optimizations

The layout system includes touch-optimized styling:

```css
.touch-target-base {
  min-height: 44px;
  min-width: 44px;
}

.touch-feedback {
  transition: all 0.15s;
}

.touch-feedback:active {
  transform: scale(0.97);
  opacity: 0.8;
}
```

### Mobile-Friendly Layout Adjustments

- Stack elements vertically on small screens
- Increase touch target sizes
- Show/hide elements based on screen size
- Adjust spacing for better mobile readability

## Related Documentation

- [Components](./components.md) - UI components used within layouts
- [Visual Language](./visual-language.md) - Visual design principles
- [Design Tokens](./tokens.md) - Design variables used in layouts
- [Accessibility](./accessibility.md) - Comprehensive accessibility guidelines
