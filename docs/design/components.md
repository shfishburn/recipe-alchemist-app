# Components

The Recipe Alchemy component library provides a comprehensive set of UI components that form the building blocks of the application interface. Components are built using Shadcn UI as a foundation, with custom components for recipe-specific functionality.

## Component Categories

Our components are organized into these categories:

1. **Core Components** - Fundamental UI elements used throughout the application
2. **Layout Components** - Structure and organization of content
3. **Form Components** - User input and data collection
4. **Data Display** - Visualization and presentation of complex data
5. **Recipe Components** - Specialized components for recipe display and interaction
6. **Feedback Components** - User notifications and status indicators
7. **Navigation Components** - User movement through the application

## Core Components

### Button

Buttons trigger actions or navigation events.

#### Variants

- **Primary**: Main call-to-action buttons
- **Secondary**: Alternative actions
- **Outline**: Less prominent actions
- **Ghost**: Subtle actions within a context
- **Destructive**: Dangerous actions (delete, remove)
- **Link**: Button that appears as a link

#### States

- Default
- Hover
- Focus
- Active
- Disabled
- Loading

#### Props

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
  loadingText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  touchFeedback?: "default" | "none";
  asChild?: boolean;
}
```

#### Usage

```tsx
import { Button } from "@/components/ui/button";

export function ButtonExample() {
  return (
    <div className="flex gap-4">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Delete</Button>
      <Button isLoading loadingText="Saving...">Submit</Button>
    </div>
  )
}
```

#### Accessibility

- Use `aria-disabled` when buttons appear enabled but have functionality disabled
- Ensure buttons have appropriate text content for screen readers
- Use `type="button"` unless the button submits a form
- Maintain minimum touch target size (44px × 44px) for mobile

### Card

Cards group related content into a container.

#### Structure

- **Card**: Container component
- **CardHeader**: Top section of the card, typically with title and description
- **CardContent**: Main content area
- **CardFooter**: Bottom section with actions
- **CardTitle**: Card heading
- **CardDescription**: Card subheading or description

#### Usage

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CardExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  )
}
```

### Badge

Badges display short status descriptors.

#### Variants

- **Default**: Standard badge
- **Secondary**: Less prominent badge
- **Outline**: Badge with border only
- **Destructive**: Error or warning status

#### Usage

```tsx
import { Badge } from "@/components/ui/badge";

export function BadgeExample() {
  return (
    <div className="flex gap-4">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  )
}
```

## Recipe Components

### NutriScoreBadge

Displays a recipe's Nutri-Score grade (A-E) with appropriate coloring.

#### Props

```typescript
interface NutriScoreBadgeProps {
  nutriScore?: NutriScore | null;
  grade?: 'A' | 'B' | 'C' | 'D' | 'E';
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}
```

#### Usage

```tsx
import { NutriScoreBadge } from "@/components/recipe-detail/nutrition/NutriScoreBadge";

export function NutriScoreExample() {
  return (
    <div className="flex gap-4">
      <NutriScoreBadge grade="A" />
      <NutriScoreBadge grade="B" />
      <NutriScoreBadge grade="C" />
      <NutriScoreBadge grade="D" />
      <NutriScoreBadge grade="E" />
    </div>
  )
}
```

### RecipeCard

Displays a recipe in a card format for lists and grids.

#### Features

- Recipe image with proper aspect ratio
- Title and brief description
- Cooking time and serving information
- Cuisine and dietary tags
- Nutri-Score badge
- Interactive hover effects

#### Usage

```tsx
import { RecipeCard } from "@/components/recipes/RecipeCard";

export function RecipeCardExample() {
  const recipe = {
    id: "1",
    title: "Mediterranean Chickpea Salad",
    image_url: "/images/chickpea-salad.jpg",
    prep_time: 15,
    cook_time: 0,
    servings: 4,
    description: "Fresh Mediterranean salad with chickpeas, tomatoes, cucumbers, and feta cheese.",
    cuisine: ["mediterranean", "greek"],
    dietary: ["vegetarian", "high-protein"],
    nutrition: {
      nutriScore: {
        grade: "A"
      }
    }
  };

  return <RecipeCard recipe={recipe} />;
}
```

### FormattedItem

Displays ingredient text with consistent formatting.

#### Props

```typescript
interface FormattedItemProps {
  item: FormattableItem;
  options?: FormattingOptions;
  className?: string;
}

interface FormattingOptions {
  highlight?: 'name' | 'quantity' | 'all' | 'none';
  strikethrough?: boolean;
  unitSystem?: 'metric' | 'imperial';
  className?: string;
}
```

#### Usage

```tsx
import { FormattedItem } from "@/components/common/formatted-item/FormattedItem";

export function FormattedItemExample() {
  const ingredient = {
    item: "olive oil",
    quantity: 2,
    unit: "tablespoon"
  };

  return (
    <div className="space-y-2">
      <FormattedItem item={ingredient} />
      <FormattedItem 
        item={ingredient} 
        options={{ highlight: 'name' }} 
      />
      <FormattedItem 
        item={ingredient} 
        options={{ strikethrough: true }} 
      />
    </div>
  );
}
```

## Specialized Components

For more detailed documentation on specific complex components:

- [Carousel Component](../carousel-component.md) - Comprehensive documentation for the carousel implementation
- [Scientific Content Components](../scientific-styling-guide.md#scientific-content-components) - Components for displaying scientific and nutritional information

## Form Components

### CuisineSelector

Multi-select component for choosing cuisine types.

#### Props

```typescript
export interface CuisineSelectorProps {
  value: string[];
  onChange: (cuisine: string[]) => void;
}
```

#### Usage

```tsx
import { CuisineSelector } from "@/components/quick-recipe/form-components/CuisineSelector";
import { useState } from "react";

export function CuisineSelectorExample() {
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);

  return (
    <div className="w-full max-w-md">
      <label className="block text-sm font-medium mb-2">
        Select Cuisines
      </label>
      <CuisineSelector
        value={selectedCuisines}
        onChange={setSelectedCuisines}
      />
    </div>
  );
}
```

### DietarySelector

Multi-select component for choosing dietary preferences.

#### Props

```typescript
export interface DietarySelectorProps {
  value: string[];
  onChange: (dietary: string[]) => void;
}
```

#### Usage

```tsx
import { DietarySelector } from "@/components/quick-recipe/form-components/DietarySelector";
import { useState } from "react";

export function DietarySelectorExample() {
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);

  return (
    <div className="w-full max-w-md">
      <label className="block text-sm font-medium mb-2">
        Dietary Preferences
      </label>
      <DietarySelector
        value={selectedDietary}
        onChange={setSelectedDietary}
      />
    </div>
  );
}
```

## Layout Components

### PageContainer

Container for page-level layout with consistent spacing.

#### Props

```typescript
interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'full' | 'narrow';
  withNavbar?: boolean;
}
```

#### Usage

```tsx
import { PageContainer } from "@/components/ui/containers";

export function PageContainerExample() {
  return (
    <PageContainer>
      <h1>Page Content</h1>
      <p>This is wrapped in a standard page container.</p>
    </PageContainer>
  );
}
```

### ContentSection

Section container with consistent vertical spacing.

#### Props

```typescript
interface ContentSectionProps {
  children: React.ReactNode;
  className?: string;
}
```

#### Usage

```tsx
import { ContentSection } from "@/components/ui/containers";

export function ContentSectionExample() {
  return (
    <ContentSection>
      <h2>Section Title</h2>
      <p>This is a content section with consistent spacing.</p>
    </ContentSection>
  );
}
```

## Component Design and Implementation Guidelines

When implementing components:

1. **Follow Shadcn UI patterns** for consistency
2. **Use design tokens** rather than hardcoded values
3. **Create small, focused components** rather than large, complex ones
4. **Document props and usage** for all components
5. **Test for accessibility** using keyboard navigation and screen readers
6. **Optimize for performance** by minimizing re-renders
7. **Consider mobile experience** from the start

## Component Composition Patterns

For complex components, follow these composition patterns:

1. **Compound components** for related UI elements (e.g., Card with CardHeader, CardBody)
2. **Render props** for components that need flexible rendering
3. **Higher-order components** for shared functionality
4. **Custom hooks** for reusable logic

## Related Documentation

- [Design Tokens](./tokens.md) - Design variables used by components
- [Accessibility](./accessibility.md) - Accessibility guidelines for components
- [Animations](./animations.md) - Animation patterns for interactive components
