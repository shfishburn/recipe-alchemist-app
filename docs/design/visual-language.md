
# Visual Language

The Recipe Alchemy visual language establishes a cohesive system of colors, typography, spacing, and other visual elements that create a distinctive and consistent user experience.

## Color Palette

Our color system is built around a purple-centric palette with complementary accent colors, providing both brand identity and functional clarity.

### Primary Colors

The core purple palette serves as our primary brand identity:

| Color | Hex | CSS Variable | Usage |
|-------|-----|-------------|-------|
| Primary Purple | `#9b87f5` | `--primary` | Primary actions, highlights, brand identity |
| Secondary Purple | `#7E69AB` | `--secondary` | Secondary elements, hover states |
| Tertiary Purple | `#6E59A5` | `--tertiary` | Tertiary elements |
| Dark Purple | `#1A1F2C` | `--dark-purple` | Text, dark backgrounds |

### Supporting Colors

Functional colors that help communicate meaning and status:

| Color | Hex | Purpose |
|-------|-----|---------|
| Green | `#59a52c`, `#04a118` | Success states, highlights |
| Orange | `#fb923c` | Warnings, attention-grabbing elements |
| Yellow | `#facc15` | Highlights, decorative elements |
| Teal | `#14b8a6` | Information, categories |
| Amber | `#d97706` | Dietary indicators |

### System Colors

Interface colors for consistent UI styling:

| Color | Light Mode | Dark Mode | Purpose |
|-------|------------|-----------|---------|
| Background | `#ffffff` | `#1A1F2C` | Page background |
| Foreground | `#1A1F2C` | `#f9fafb` | Text color |
| Muted | `#f1f5f9` | `#334155` | Secondary backgrounds |
| Muted Foreground | `#64748b` | `#94a3b8` | Secondary text |
| Border | `#e2e8f0` | `#334155` | Borders and dividers |

### Accessibility Considerations

All color combinations must meet WCAG 2.1 AA standards for contrast:

- Text on backgrounds: Minimum 4.5:1 contrast ratio
- Large text: Minimum 3:1 contrast ratio
- UI components and graphical objects: Minimum 3:1 contrast ratio

### Color Usage Guidelines

- **Use primary purple** for primary actions, calls-to-action, and key interactive elements
- **Use supporting colors** to convey meaning (success, warning, information)
- **Limit accent colors** to avoid visual overwhelm
- **Ensure sufficient contrast** between text and backgrounds
- **Don't rely solely on color** to convey information (use icons, text, and other visual cues)

## Typography

Recipe Alchemy uses a clean, readable typography system with clear hierarchy.

### Font Family

- **Primary Font**: System font stack for optimal performance and native feel
  ```css
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
  "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", 
  "Segoe UI Emoji", "Segoe UI Symbol";
  ```

### Type Scale

Our responsive type scale adjusts sizes based on viewport width:

| Element | Mobile | Tablet | Desktop | Weight | Line Height |
|---------|--------|--------|---------|--------|-------------|
| h1 | 2.25rem | 2.5rem | 3rem | 500 | 1.2 |
| h2 | 1.875rem | 2rem | 2.25rem | 500 | 1.2 |
| h3 | 1.5rem | 1.75rem | 2rem | 500 | 1.25 |
| h4 | 1.25rem | 1.375rem | 1.5rem | 500 | 1.3 |
| Body | 1rem | 1rem | 1rem | 400 | 1.5 |
| Small | 0.875rem | 0.875rem | 0.875rem | 400 | 1.5 |

### Typography Guidelines

- **Use headings hierarchically** (h1 > h2 > h3) for proper document structure
- **Maintain appropriate line length** (50-75 characters) for body text
- **Use proper letter spacing** (-0.015em for headings, normal for body text)
- **Align text appropriately** (left-aligned for languages that read left-to-right)
- **Consider line height** (looser for body text, tighter for headings)

### Scientific Content Typography

Scientific content has specialized typography needs:

- **Chemical formulas**: Use proper subscripts and superscripts 
- **Units of measure**: Maintain proper spacing between numbers and units
- **Scientific notation**: Format consistently with appropriate superscripts
- **Technical terms**: Consider italics for scientific names and terminology

## Iconography

Recipe Alchemy uses [Lucide React](https://lucide.dev/) icons for a consistent visual language.

### Icon Guidelines

- Use consistent icon sizes (16px, 20px, 24px standard)
- Maintain adequate spacing around icons (minimum 8px)
- Ensure icons have appropriate labels or tooltips
- Use icons consistently to represent the same concepts
- Keep icon style consistent (stroke width, corner radius)

## Spacing System

Our spacing system uses a standardized scale based on 4px increments.

| Token | Size | Usage |
|-------|------|-------|
| space-1 | 4px | Minimum spacing, icon padding |
| space-2 | 8px | Tight spacing, icon margins |
| space-3 | 12px | Form field spacing |
| space-4 | 16px | Standard component padding |
| space-6 | 24px | Medium component spacing |
| space-8 | 32px | Large component spacing |
| space-12 | 48px | Section spacing |
| space-16 | 64px | Large section spacing |

### Spacing Guidelines

- Use consistent spacing for similar components
- Increase spacing as viewport width increases
- Maintain consistent rhythm with the spacing system
- Allow adequate white space for readability

## Shadows and Elevation

Shadows create hierarchy and elevation in the interface.

| Token | Values | Usage |
|-------|--------|-------|
| shadow-sm | `0 1px 2px rgba(0, 0, 0, 0.05)` | Subtle elevation |
| shadow | `0 2px 4px rgba(0, 0, 0, 0.08)` | Standard elevation |
| shadow-md | `0 4px 6px rgba(0, 0, 0, 0.1)` | Medium elevation |
| shadow-lg | `0 8px 16px rgba(0, 0, 0, 0.12)` | High elevation |

## Borders and Corners

| Token | Value | Usage |
|-------|-------|-------|
| radius-sm | 0.375rem | Small components |
| radius | 0.5rem | Standard components |
| radius-lg | 0.625rem | Large components |
| radius-full | 9999px | Pills, avatars |

## Visual Assets

Visual examples of the design system in action can be found in the `assets` folder:

- [Color Palette](./assets/color-palette.png)
- [Typography Scale](./assets/typography-scale.png)
- [Spacing System](./assets/spacing-system.png)
