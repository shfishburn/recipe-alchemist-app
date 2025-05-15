# Design Tokens

Design tokens are the visual design atoms of the design system—specifically, they are named entities that store visual design attributes. We use design tokens to maintain a scalable and consistent visual system for UI development.

## Token Categories

Recipe Alchemy design tokens are organized into these categories:

1. **Color Tokens** - Brand and interface colors
2. **Typography Tokens** - Font families, sizes, weights, and line heights
3. **Spacing Tokens** - Margin, padding, and positioning values
4. **Sizing Tokens** - Width, height, and other dimensional values
5. **Border Tokens** - Border widths, styles, and radii
6. **Shadow Tokens** - Elevation and depth values
7. **Animation Tokens** - Duration, easing, and delay values
8. **Opacity Tokens** - Transparency values

## Implementation

Our design tokens are implemented through:

1. **CSS Variables** - For runtime theme switching and developer access
2. **Tailwind Theme Configuration** - For integration with the Tailwind CSS utility classes

### CSS Variables

Design tokens are defined as CSS variables in the `theme.css` file:

```css
:root {
  /* Base colors */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  
  /* Component colors */
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  
  /* State colors */
  --primary: 262 46% 74%;
  --primary-foreground: 210 40% 98%;
  --secondary: 262 30% 54%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  
  /* Functional colors */
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  
  /* Border and focus */
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 262 46% 74%;
  
  /* Component dimensions */
  --radius: 0.5rem;
}
```

### Dark Mode Variables

```css
.dark {
  --background: 224 71% 4%;
  --foreground: 213 31% 91%;
  
  /* Component colors */
  --card: 224 71% 4%;
  --card-foreground: 213 31% 91%;
  --popover: 224 71% 4%;
  --popover-foreground: 213 31% 91%;
  
  /* State colors */
  --primary: 262 46% 74%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 262 30% 54%;
  --secondary-foreground: 210 40% 98%;
  
  /* Functional colors */
  --muted: 223 47% 11%;
  --muted-foreground: 215.4 16.3% 56.9%;
  --accent: 216 34% 17%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 63% 31%;
  --destructive-foreground: 210 40% 98%;
  
  /* Border and focus */
  --border: 216 34% 17%;
  --input: 216 34% 17%;
  --ring: 262 46% 74%;
}
```

### Tailwind Configuration

Design tokens are mapped to the Tailwind configuration:

```typescript
// tailwind.config.ts
export default {
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        recipe: {
          blue: '#04a118',
          orange: '#fb923c',
          green: '#59a52c',
          yellow: '#facc15',
          purple: '#9b87f5',
          teal: '#14b8a6',
          amber: '#d97706',
          primaryPurple: '#9b87f5',
          secondaryPurple: '#7E69AB',
          tertiaryPurple: '#6E59A5',
          darkPurple: '#1A1F2C'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      // ... other theme extensions
    }
  }
}
```

## Usage Guidelines

### Using CSS Variables

Access design tokens in CSS using the `var()` function:

```css
.my-component {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
}
```

### Using Tailwind Classes

Access design tokens through Tailwind utility classes:

```html
<div class="bg-background text-foreground border border-border rounded-lg">
  Content
</div>
```

### Using the `cn()` Utility

Combine Tailwind classes with conditional logic using the `cn()` utility:

```tsx
import { cn } from "@/lib/utils";

function MyComponent({ isActive }: { isActive: boolean }) {
  return (
    <div className={cn(
      "p-4 rounded-lg border",
      isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
    )}>
      My Component
    </div>
  );
}
```

## Color Token System

Our color system uses HSL values stored in CSS variables:

```css
--primary: 262 46% 74%;
```

This format stores hue, saturation, and lightness separately, which is then composed in the HTML with:

```css
background-color: hsl(var(--primary));
```

### Benefits of this Approach

1. **Theme Switching** - Easier to override just one part of the color (e.g., lightness)
2. **Color Manipulation** - Can adjust opacity easily
3. **Consistency** - Single source of truth for colors

## Spacing Token System

Our spacing system uses a scale based on 4px increments:

| Token | Size | CSS Variable | Tailwind Class |
|-------|------|-------------|---------------|
| space-1 | 4px | `--space-1` | p-1, m-1 |
| space-2 | 8px | `--space-2` | p-2, m-2 |
| space-3 | 12px | `--space-3` | p-3, m-3 |
| space-4 | 16px | `--space-4` | p-4, m-4 |
| space-5 | 20px | `--space-5` | p-5, m-5 |
| space-6 | 24px | `--space-6` | p-6, m-6 |
| space-8 | 32px | `--space-8` | p-8, m-8 |
| space-10 | 40px | `--space-10` | p-10, m-10 |
| space-12 | 48px | `--space-12` | p-12, m-12 |
| space-16 | 64px | `--space-16` | p-16, m-16 |

## Typography Token System

Typography tokens control text appearance throughout the application:

| Token | CSS Variable | Tailwind Class |
|-------|-------------|---------------|
| Font Family | `--font-sans` | font-sans |
| Font Size Base | `--font-size-base` | text-base |
| Line Height Base | `--line-height-base` | leading-normal |
| Font Weight Normal | `--font-weight-normal` | font-normal |
| Font Weight Medium | `--font-weight-medium` | font-medium |
| Font Weight Bold | `--font-weight-bold` | font-bold |

## Shadow Token System

Shadows create depth and elevation:

| Token | CSS Variable | Tailwind Class |
|-------|-------------|---------------|
| Shadow Card | `--shadow-card` | shadow-card |
| Shadow Hover | `--shadow-hover` | shadow-hover |
| Shadow Panel | `--shadow-panel` | shadow-panel |

## Border Token System

Border tokens control edge treatments:

| Token | CSS Variable | Tailwind Class |
|-------|-------------|---------------|
| Border Width | `--border-width` | border |
| Border Radius Small | `--radius-sm` | rounded-sm |
| Border Radius | `--radius` | rounded |
| Border Radius Large | `--radius-lg` | rounded-lg |
| Border Radius Full | `--radius-full` | rounded-full |

## Animation Token System

Animation tokens control motion patterns:

| Token | CSS Variable | Tailwind Class |
|-------|-------------|---------------|
| Duration Short | `--duration-short` | duration-150 |
| Duration Normal | `--duration-normal` | duration-300 |
| Duration Long | `--duration-long` | duration-500 |
| Ease Default | `--ease-default` | ease-in-out |
| Ease In | `--ease-in` | ease-in |
| Ease Out | `--ease-out` | ease-out |

## Extending Design Tokens

To extend the token system:

1. Add new CSS variables to `theme.css`
2. Map them to Tailwind in `tailwind.config.ts`
3. Document the new tokens in this guide
4. Create examples showing proper usage

## Related Documentation

- [Visual Language](./visual-language.md) - Visual principles that tokens represent
- [Components](./components.md) - UI components that utilize design tokens
- [Layout System](./layout.md) - How tokens are used in layouts
